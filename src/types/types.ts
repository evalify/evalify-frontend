export interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  profileId?: string;
  role: "STUDENT" | "ADMIN" | "FACULTY" | "MANAGER";
  phoneNumber?: string;
  image?: string;
  isActive: boolean;
}

export interface Semester extends Record<string, unknown> {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
}

export interface Batch {
  id: string;
  name: string;
  graduationYear: number;
  section: string;
  isActive: boolean;
  students?: User[];
  managers?: User[];
  semester?: Semester[];
  department?: Department;
}

export interface Course extends Record<string, unknown> {
  id: string;
  name: string;
  code?: string;
  description: string;
  type: CourseType;
  createdAt: string;
  updatedAt: string;
  _links?: {
    self: {
      href: string;
    };
  };
}

export enum CourseType {
  CORE,
  ELECTIVE,
  MICRO_CREDENTIAL,
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  columnId: string;
  assignedToId?: string;
  userId: string;
}

export interface CourseData {
  id: string;
  name: string;
  code?: string;
  description: string;
  type: "CORE" | "ELECTIVE" | "MICRO_CREDENTIAL";
  progressPercentage: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  lastReviewDate: string | null;
  totalReviews: number;
}

export interface Department {
  id: string;
  name: string;
  batches?: Batch[];
}

export interface DataTableResponse<T> {
  data: T[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export interface Lab {
  id: string;
  name: string;
  block: string;
  ipSubnet: string;
}
