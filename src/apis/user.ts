import { TMentee } from 'types/user';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getStudents = (params?: any) => request.get('/students', { params });

const getStudentById = (id: string, params?: any) => request.get(`/students/${id}`, { params });

const remove = (id: string) => request.delete(`/students/${id}`);

const add = (data: any) => request.post('/students', data);

const update = (data: TMentee) => request.put(`/students`, data);

const studentApi = {
  ...generateAPIWithPaging<TMentee>('students'),
  getStudents,
  getStudentById,
  remove,
  add,
  update,
};

export default studentApi;
