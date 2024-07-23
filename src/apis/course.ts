import { TCourse } from 'types/course';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getCourses = (params?: any) => request.get('/courses', { params });

const getCourseById = (id: string, params?: any) => request.get(`/courses/${id}`, { params });

const getSubjectByCourseId = (id: string) => request.get(`/courses/${id}/subjects?page=1&size=10`);

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
  getSubjectByCourseId,
};

export default courseApi;
