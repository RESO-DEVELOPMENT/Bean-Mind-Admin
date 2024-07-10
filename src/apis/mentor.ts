import { TMentor } from 'types/user';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getUsers = (params?: any) => request.get('/teachers', { params });

const getUserById = (id: string,  params?: any) => request.get(`/teachers/${id}`, { params });

const remove = (id: string) => request.delete(`/teachers/${id}`);

const add = (data: any) => request.post('/teachers', data);

const update = (data: TMentor) => request.put(`/teachers`, data);

const mentorApi = {
  ...generateAPIWithPaging<TMentor>('teachers'),
  getUsers,
  getUserById,
  remove,
  add,
  update,
};

export default mentorApi;
