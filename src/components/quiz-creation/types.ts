export interface CourseInstructorPreviewDTO {
  id: string;
  name: string;
  courseCode: string;
  description: string;
  quizzes: number;
  semester: CourseInstructorSemesterDTO;
}

export interface CourseInstructorSemesterDTO {
  id: string;
  name: string;
  year: number;
}

export interface CourseStudentInstructorDTO {
  courseId: string | null;
  students: CourseStudentInstructorDetailsDTO[];
}

export interface CourseStudentInstructorDetailsDTO {
  id: string | null;
  name: string;
  email: string;
  phoneNumber: string;
  image: string | null;
  batch: string | null;
}

export interface LabResponse {
  id: string;
  name: string;
  block: string;
  ipSubnet: string;
}

export interface BatchResponse {
  id: string;
  name: string;
  graduationYear: number;
  departmentId: string;
  section: string;
  isActive: boolean;
}

export interface QuizParticipantData {
  students: string[];
  courses: string[];
  labs: string[];
  batches: string[];
}
