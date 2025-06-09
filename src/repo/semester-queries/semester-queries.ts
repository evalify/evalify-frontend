import { Course, Semester } from "@/types/types";
import axiosInstance from "@/lib/axios/axios-client";

export interface DataTableResponse {
  data: Semester[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}
const semesterQueries = {
  getSemesters: async (
    searchQuery?: string,
    page: number = 0,
    size: number = 10,
    columnFilters?: Record<string, string[]>,
  ): Promise<DataTableResponse> => {
    const isActiveFilter = columnFilters?.isActive?.[0];
    let endpoint = "/semester";
    const params: { [key: string]: string } = {};

    if (searchQuery) {
      endpoint = `/semester/search`;
      params.query = searchQuery;
      params.page = page.toString();
      params.size = size.toString();
    } else {
      params.page = page.toString();
      params.size = size.toString();
    }

    const response = await axiosInstance.get(endpoint, { params });
    const data = response.data;

    if (Array.isArray(data)) {
      let filteredData = data;

      if (isActiveFilter !== undefined) {
        const isActiveValue = isActiveFilter === "true";
        filteredData = filteredData.filter(
          (semester: Semester) => semester.isActive === isActiveValue,
        );
      }

      return {
        data: filteredData,
        pagination: {
          total_pages: 1,
          current_page: 0,
          per_page: filteredData.length,
          total_count: filteredData.length,
        },
      };
    }

    if (data.pagination) {
      return data as DataTableResponse;
    }

    if (data.data) {
      return {
        data: data.data,
        pagination: {
          total_pages: 1,
          current_page: 0,
          per_page: data.data.length,
          total_count: data.data.length,
        },
      };
    }

    return {
      data: [],
      pagination: {
        total_pages: 0,
        current_page: 0,
        per_page: size,
        total_count: 0,
      },
    };
  },

  getSemester: async (id: string): Promise<Semester> => {
    const response = await axiosInstance.get(`/semester/${id}`);
    return response.data;
  },

  createSemester: async (semester: Omit<Semester, "id">): Promise<Semester> => {
    const response = await axiosInstance.post("/api/semester", semester);
    return response.data;
  },

  updateSemester: async (semester: Semester): Promise<Semester> => {
    const response = await axiosInstance.put(
      `/api/semester/${semester.id}`,
      semester,
    );
    return response.data;
  },

  deleteSemester: async (id: string) => {
    const response = await axiosInstance.delete(`/api/semester/${id}`);
    return response.data;
  },

  getSemesterById: async (id: string): Promise<Semester> => {
    const response = await axiosInstance.get(`/semester/${id}`);
    return response.data;
  },

  getCourseBySemesterId: async (id: string): Promise<Course[]> => {
    const response = await axiosInstance.get(`/semester/${id}/courses`);
    return response.data;
  },

  createCourseForSemester: async (semesterId: string, course: Course) => {
    const response = await axiosInstance.post(
      `/semester/${semesterId}/courses`,
      course,
    );
    return response.data;
  },
  deleteCourseFromSemester: async (semesterId: string, courseId: string) => {
    const response = await axiosInstance.delete(
      `/semester/${semesterId}/courses/${courseId}`,
    );
    return response.data;
  },
};

export default semesterQueries;
