export type TUser = {
  id: number;
  fullName: string;
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

export type TMentor = {
  id: number;
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


};

export type TAdmin = {
  id: number;
  fullName: string;
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
