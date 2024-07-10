import { TMajor, TSubjectMajor } from 'types/major';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getMajors = (params?: any) => request.get('/curriculums', { params });

const getMajorById = (id: number, params?: any) => request.get(`/curriculums/${id}`, { params });

const remove = (id: number) => request.delete(`/curriculums/${id}`);

const add = (data: TMajor) => request.post('/curriculums', data);

const update = (data: TMajor) => request.put(`/curriculums`, data);

const addSubjectMajor = (data: TSubjectMajor) => request.post(`/admin/majors/subject-major`, data);
const removeSubjectMajor = (data: TSubjectMajor) =>
  request.delete(`/admin/majors/subject-major`, { data });

const majorApi = {
  ...generateAPIWithPaging<TMajor>('/curriculums'),
  getMajors,
  getMajorById,
  remove,
  add,
  update,
  addSubjectMajor,
  removeSubjectMajor,
};

export default majorApi;
