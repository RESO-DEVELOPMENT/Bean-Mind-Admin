export type TSubject = {
  id: string;
  subjectCode?: string | null;
  title: string;
  description?: string | null;
  courseId?: string | null;
  schoolId?: string | null;
  insDate?: string | null;
  updDate?: string | null;
  // publishedDate?: Date;
  delFlg?: boolean | null;
};
