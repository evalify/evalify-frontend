import { Course, Batch, User } from "@/types/types";
import axiosInstance from "@/lib/axios/axios-client";
import {
  CourseInstructorPreviewDTO,
  CourseStudentInstructorDTO,
  LabResponse,
} from "@/components/quiz-creation/types";

export const courseQueries = {
  getCourseById: async (id: string): Promise<Course> => {
    const response = await axiosInstance.get(`/api/course/${id}`);
    return response.data;
  },

  getCourseBatches: async (id: string): Promise<Batch[]> => {
    const response = await axiosInstance.get(`/api/course/${id}/batches`);
    const paginatedResponse = response.data;
    return paginatedResponse.data || [];
  },

  getCourseStudents: async (id: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/api/course/${id}/students`);
    const paginatedResponse = response.data;
    return paginatedResponse.data || [];
  },

  getCourseInstructors: async (id: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/api/course/${id}/instructors`);
    const instructors = response.data;
    return instructors || [];
  },

  assignBatchesToCourse: async (courseId: string, batchIds: string[]) => {
    const response = await axiosInstance.post(
      `/api/course/${courseId}/batches`,
      { batchIds },
    );
    return response.data;
  },

  removeBatchFromCourse: async (courseId: string, batchId: string) => {
    const response = await axiosInstance.delete(
      `/api/course/${courseId}/batches/${batchId}`,
    );
    return response.data;
  },

  assignStudentsToCourse: async (courseId: string, studentIds: string[]) => {
    const response = await axiosInstance.post(
      `/api/course/${courseId}/students`,
      { studentIds },
    );
    return response.data;
  },

  removeStudentFromCourse: async (courseId: string, studentId: string) => {
    const response = await axiosInstance.delete(
      `/api/course/${courseId}/students/${studentId}`,
    );
    return response.data;
  },

  assignInstructorsToCourse: async (
    courseId: string,
    instructorIds: string[],
  ) => {
    const response = await axiosInstance.post(
      `/api/course/${courseId}/instructors`,
      { instructorIds },
    );
    return response.data;
  },

  removeInstructorFromCourse: async (
    courseId: string,
    instructorId: string,
  ) => {
    const response = await axiosInstance.delete(
      `/api/course/${courseId}/instructors/${instructorId}`,
    );
    return response.data;
  },

  getFaculty: async (): Promise<User[]> => {
    const response = await axiosInstance.get(`/api/user/faculty`);
    const faculty = response.data;
    return faculty.data || [];
  },

  getMyCourses: async (): Promise<Course[]> => {
    const response = await axiosInstance.get(`/api/course/my-courses`);
    const paginatedResponse = response.data;
    return paginatedResponse.data || [];
  },

  getActiveCourses: async (userId: string): Promise<Course[]> => {
    const response = await axiosInstance.post(`/api/course/active`, { userId });
    const courses = response.data;
    return courses.data || [];
  },

  getCoursesHandledByUser: async (): Promise<Course[]> => {
    const response = await axiosInstance.get(`/api/courses/instructors`);
    return response.data ?? [];
  },

  getCoursesByInstructor: async (): Promise<CourseInstructorPreviewDTO[]> => {
    const response = await axiosInstance.get(`/api/courses/instructors`);
    return response.data ?? [];
  },

  getCourseStudentsByInstructor: async (): Promise<
    CourseStudentInstructorDTO[]
  > => {
    const response = await axiosInstance.get(
      `/api/courses/students/instructors`,
    );
    return response.data ?? [];
  },

  getAllLabs: async (): Promise<LabResponse[]> => {
    const response = await axiosInstance.get(`/api/lab/all`);
    return response.data ?? [];
  },
};
