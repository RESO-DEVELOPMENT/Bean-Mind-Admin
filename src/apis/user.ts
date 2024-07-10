import { TStudent } from 'types/user';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getUsers = (params?: any) => request.get('/students', { params });

const getUserById = (id: string, params?: any) => request.get(`/students/${id}`, { params });

const remove = (id: string) => request.delete(`/students/${id}`);

const add = (data: any) => request.post('/students', data);

const update = (data: TStudent) => request.put(`/students`, data);

const userApi = {
  ...generateAPIWithPaging<TStudent>('students'),
  getUsers,
  getUserById,
  remove,
  add,
  update,
};

export default userApi;
