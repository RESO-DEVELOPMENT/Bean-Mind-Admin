import { TSubject } from "./subject";


export type TMajor = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sort: string;
  subjects: TSubject[];
}

export type TSubjectMajor = {
  subjectId: number;
  majorId: number;
}
