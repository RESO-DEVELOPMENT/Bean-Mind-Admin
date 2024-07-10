import { TMentor } from 'types/user';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getTeachers = (params?: any) => request.get('/teachers', { params });

const getTeacherById = (id: string,  params?: any) => request.get(`/teachers/${id}`, { params });

const remove = (id: string) => request.delete(`/teachers/${id}`);

const add = (data: any) => request.post('/teachers', data);

const update = (data: TMentor) => request.put(`/teachers`, data);

const teacherApi = {
  ...generateAPIWithPaging<TMentor>('teachers'),
  getTeachers,
  getTeacherById,
  remove,
  add,
  update,
};

export default teacherApi;
