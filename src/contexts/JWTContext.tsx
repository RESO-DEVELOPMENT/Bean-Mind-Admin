import { createContext, ReactNode, useEffect, useReducer, useState } from 'react';
// utils
import request, { axiosInstance } from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import jwtDecode from 'jwt-decode';
import { useUserRole } from './UserRoleContext';
import { set } from 'lodash';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const { setRole } = useUserRole();
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user') || "{}");
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          setRole(user.role);
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }

      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
    });
    console.log(response.data);
    const { accessToken, name, role , userId} = response.data;
    setRole(role);
    const user = {
      name: name,
      role: role,
      userId: userId
    }
    //localStorage.setItem('accessToken', accessToken);
    setSession(accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({
      type: Types.Login,
      payload: {
        user,
      },
    });
  };

  // googleProvider
  const googleProvider = new GoogleAuthProvider();
  // auth
  const auth = getAuth();

  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then(async (result) => {
      const resultUser: any = result.user;

      const response = await request.post(`/authenticate/login`, {
        idToken: resultUser.accessToken,
      });
      const { accessToken } = response?.data?.data;
      const user = response?.data?.data;
      console.log(user);
      setSession(accessToken);

      dispatch({
        type: Types.Login,
        payload: {
          user,
        },
      });
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axiosInstance.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('user');
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        user: {
          id: state?.user?.uid,
          email: state?.user?.email || '',
          photoURL: state?.user?.imageUrl || '',
          displayName: state?.user?.name || state?.user?.fullName || '',
          role: state?.user?.role || '',
          phoneNumber: state?.user?.phone || '',
          // country: profile?.country || '',
          address: state?.user?.address || '',
          // state: profile?.state || '',
          // city: profile?.city || '',
          // zipCode: profile?.zipCode || '',
          // about: profile?.about || '',
          // isPublic: profile?.isPublic || false,
        },
        // user,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
