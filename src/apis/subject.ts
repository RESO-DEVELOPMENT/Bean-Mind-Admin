import { TSubject } from 'types/subject';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getSubjects = (params?: any) => request.get('/subjects', { params });
//const getSubjects = () => request.get('/subjects');

const getSubjectById = (id: string) =>
  request.get<TSubject>(`/subjects/${id}`);

const remove = (id: string) => request.delete(`/subjects/${id}`);

const add = (data: any) => request.post('/subjects', data);
//const add = (id: string, params: any) => request.post(`/subjects/${courseId}`, data);
//const add = (id: string, data: Partial<TSubject>) => request.post(`/subjects?Id=${Id}`, data);

//const update = (data: TSubject) => request.put(`/subjects`, data);
//const update = (data: TSubject) => request.patch(`/subjects`, data);
const update = (id: string, data: Partial<TSubject>) => request.patch(`/subjects/${id}`, data);

const subjectApi = {
  ...generateAPIWithPaging<TSubject>('subjects'),
  getSubjects,
  getSubjectById,
  remove,
  add,
  update,
};

export default subjectApi;
