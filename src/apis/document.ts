import { TDocument } from "types/document";
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';
const getDocument = (params?: any) => request.get('/documents', { params });

const getDocumentById = (id: string,  params?: any) => request.get(`/documents/${id}`, { params });

const remove = (id: string) => request.delete(`/documents/${id}`);

const add = (data: any) => request.post('/documents', data);

const update = (data: TDocument) => request.put(`/documents`, data);

const documentApi = {
  ...generateAPIWithPaging<TDocument>('documents'),
  getDocument,
  getDocumentById,
  remove,
  add,
  update,
};

export default documentApi;