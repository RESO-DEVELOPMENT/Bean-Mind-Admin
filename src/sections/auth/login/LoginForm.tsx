// import * as Yup from 'yup';
// import { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// // form
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// // @mui
// import { Link, Stack, Alert, IconButton, InputAdornment, Button } from '@mui/material';
// import GoogleIcon from '@mui/icons-material/Google';
// import { LoadingButton } from '@mui/lab';
// // routes
// import { PATH_AUTH } from '../../../routes/paths';
// // hooks
// import useAuth from '../../../hooks/useAuth';
// import useIsMountedRef from '../../../hooks/useIsMountedRef';
// // components
// import Iconify from '../../../components/Iconify';
// import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
// import LoginWithGoogle from './LoginWithGoogle';
// import { Console } from 'console';

// // ----------------------------------------------------------------------

// type FormValuesProps = {
//   email: string;
//   password: string;
//   remember: boolean;
//   afterSubmit?: string;
// };

// export default function LoginForm() {
//   const { login } = useAuth();

//   const isMountedRef = useIsMountedRef();

//   const [showPassword, setShowPassword] = useState(false);

//   const LoginSchema = Yup.object().shape({
//     email: Yup.string().email('Email must be a valid email address').required('Email is required'),
//     password: Yup.string().required('Password is required'),
//   });

//   const defaultValues = {
//     email: 'demo@minimals.cc',
//     password: 'demo1234',
//     remember: true,
//   };

//   const methods = useForm<FormValuesProps>({
//     resolver: yupResolver(LoginSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     setError,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = methods;

//   const onSubmit = async (data: FormValuesProps) => {
//     try {

//       await login(data.email, data.password);
//     } catch (error) {
//       console.error(error);

//       reset();

//       if (isMountedRef.current) {
//         setError('afterSubmit', { ...error, message: error.message });
//       }
//     }
//   };

//   return (
//     <><FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Stack spacing={3}>
//         {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

//         <RHFTextField name="email" label="Email address" />

//         <RHFTextField
//           name="password"
//           label="Password"
//           type={showPassword ? 'text' : 'password'}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                   <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }} />
//       </Stack>

//       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
//         <RHFCheckbox name="remember" label="Remember me" />
//         <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
//           Forgot password?
//         </Link>
//       </Stack>

//       <LoadingButton
//         fullWidth
//         size="large"
//         type="submit"
//         variant="contained"
//         loading={isSubmitting}
//       >
//         Login
//       </LoadingButton>

//     </FormProvider><LoginWithGoogle /></>
//   );
// }
import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import LoginWithGoogle from './LoginWithGoogle';

// ----------------------------------------------------------------------

type FormValuesProps = {
  username: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export default function LoginForm() {
  const { login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username: '',
    password: '',
    remember: false,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {

      console.log('data', data)
      await login(data.username, data.password);
    } catch (error) {
      console.error(error);
      reset();

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message || 'Login failed' });
      }
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          <RHFTextField name="username" label="Username" />

          <RHFTextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <RHFCheckbox name="remember" label="Remember me" />
          <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </FormProvider>
      <LoginWithGoogle />
    </>
  );
}
