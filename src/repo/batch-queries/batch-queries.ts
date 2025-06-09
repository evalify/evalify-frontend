import axiosInstance from "@/lib/axios/axios-client";

interface CreateBatchRequest {
  name: string;
  graduationYear: number;
  departmentId: string;
  section: string;
  isActive: boolean;
}

interface UpdateBatchRequest extends Partial<CreateBatchRequest> {
  id: string;
}

const batchQueries = {
  createBatch: async (data: CreateBatchRequest) => {
    const response = await axiosInstance.post("/api/batch", data);
    return response.data;
  },

  updateBatch: async (data: UpdateBatchRequest) => {
    const { id, ...updateData } = data;
    const response = await axiosInstance.put(`/api/batch/${id}`, updateData);
    return response.data;
  },

  deleteBatch: async (batchId: string) => {
    const response = await axiosInstance.delete(`/api/batch/${batchId}`);
    return response.data;
  },

  getBatchById: async (batchId: string) => {
    const response = await axiosInstance.get(`/api/batch/${batchId}`);
    return response.data;
  },

  getBatchStudents: async (
    batchId: string,
    page: number,
    size: number,
    searchQuery?: string,
    sortBy?: string,
    sortOrder?: string,
  ) => {
    const params: { [key: string]: string | number } = {
      page,
      size,
    };

    let url = `/api/batch/${batchId}/students`;

    if (searchQuery && searchQuery.trim() !== "") {
      params.query = searchQuery;
      url = `/api/batch/${batchId}/students/search`;
    }

    // Add sorting parameters if provided
    if (sortBy && sortOrder) {
      params.sort_by = sortBy;
      params.sort_order = sortOrder;
    }

    const response = await axiosInstance.get(url, { params });
    return response.data;
  },

  assignUsersToBatch: async (data: {
    userIds: (string | number)[];
    batchId: string;
  }) => {
    await axiosInstance.put(
      `/api/batch/${data.batchId}/add-students`,
      data.userIds,
    );
  },

  removeStudentFromBatch: async (batchId: string, studentId: string) => {
    const response = await axiosInstance.put(
      `/api/batch/${batchId}/delete-students`,
      [studentId],
    );
    return response.data;
  },
};

export default batchQueries;
