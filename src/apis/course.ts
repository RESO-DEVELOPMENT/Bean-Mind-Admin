import { TCourse } from 'types/course';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getCourses = (params?: any) => request.get('/courses', { params });

const getCourseById = (id: string, params?: any) => request.get(`/courses/${id}`, { params });

const remove = (id: string) => request.delete(`/courses/${id}`);

const add = (data: any) => request.post('/courses', data);

const update = (id: string, data: TCourse) => request.put(`/courses/${id}`, data);

const courseApi = {
  ...generateAPIWithPaging<TCourse>('courses'),
  getCourses,
  getCourseById,
  remove,
  add,
  update,
};

export default courseApi;
