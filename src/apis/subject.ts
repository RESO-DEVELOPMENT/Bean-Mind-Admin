import { TSubject } from 'types/subject';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getSubjects = (params?: any) => request.get('/subjects', { params });

const getSubjectById = (id: string, params?: any) =>
  request.get<TSubject>(`/subjects/${id}`, { params });

const remove = (id: string) => request.delete(`/subjects/${id}`);

const add = (data: any) => request.post('/subjects', data);

const update = (id: string, data: Partial<TSubject>) => request.patch(`/subjects`, data);

const subjectApi = {
  ...generateAPIWithPaging<TSubject>('subjects'),
  getSubjects,
  getSubjectById,
  remove,
  add,
  update,
};

export default subjectApi;
