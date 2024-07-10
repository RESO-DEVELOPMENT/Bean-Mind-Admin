export type TSubject = {
  id: string;
  title: string;
  subjectCode: string;
  description: string;
  courseId?: string | null;
  schoolId?: string | null;
  insDate?: Date | null;
  updDate?: Date | null;
};
