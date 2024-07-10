export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  gender: number;
  imageUrl: string;
  phone: string;
  email: string;
  address: string;
  dayOfBirth: string;
  status: number;
  badge: number;
  roleId: number;
};

export type TStudent = {
  id: string;
  firstName: string;
  lastName: string
  dateOfBirth: string;
  imgUrl: string;
  insDate: string;
  updDate: string;
};
export type TMentor = {
  id: string;
  firstName: string;
  lastName: string;

  // fullName: string;
  // gender: number;
  imgUrl: string;
  phone: string;
  email: string;
  // address: string;
  dateOfBirth: string;
  // status: number;
  // badge: number;
  // roleId: number;
  schoolId: number;
  account: string
  school: string;
  accountId: number;
  insDate: string;
  updDate: string;
  delflg: true;
  dayOfBirth: string;

  
};

export type TAdmin = {
  id: string;
  firstName: string;
  lastName: string;
  gender: number;
  imageUrl: string;
  phone: string;
  email: string;
  address: string;
  dayOfBirth: string;
  status: number;
  badge: number;
  roleId: number;
};
