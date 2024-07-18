import { TMentee } from 'types/user';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getStudents = (params?: any) => request.get('/students', { params });

const getStudentById = (id: string, params?: any) => request.get(`/students/${id}`, { params });

const remove = (id: string) => request.delete(`/students/${id}`);

//const add = (data: any) => request.post('/students', data);
const add = (data: any, parentId?: string, courseId?: string) =>
  request.post(
    '/students',
    data,
    {
      params: {
        parentId,
        courseId,
      },
    }
  );

//const update = (data: TMentee) => request.put(`/students`, data);
const update = (id: string, data: Partial<TMentee>, parentId?: string, courseId?: string) =>
  request.patch(
    `/students/${id}`,
    data, 
    {
      params: {
        parentId,
        courseId
      }
    }
  );

const studentApi = {
  ...generateAPIWithPaging<TMentee>('students'),
  getStudents,
  getStudentById,
  remove,
  add,
  update,
};

export default studentApi;
