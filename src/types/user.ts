export type TUser = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: number;
  imgUrl: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: Date;
  status: number;
  badge: number;
  roleId: number;
};

export type TMentor = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  imageUrl: string;
  email: string;
  phone: string;
  //schoolId: string;
  accountId: string;
  insDate?: Date | null;
  updDate?: Date | null;
  delFlg?: boolean | null;

  //gender: number;
  //address: string;
  //status: number;
  //badge: number;
  //roleId: number;
};

export type TMentee = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  imgUrl: string;
  parentId?: string | null;
  accountId?: string | null;
  insDate?: Date | null;
  updDate?: Date | null;
  delFlg?: boolean | null;
}

export type TAdmin = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: number;
  imgUrl: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: Date; //changed
  status: number;
  badge: number;
  roleId: number;
};
