import axiosInstance from "@/lib/axios/axios-client";
import { User } from "@/components/admin/users/types/types";

interface CreateUserData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}

interface UpdateUserData extends Omit<CreateUserData, "password"> {
  id: string;
}

const userQueries = {
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await axiosInstance.post("/user", data);
    return response.data;
  },

  updateUser: async (data: UpdateUserData): Promise<User> => {
    const { id, ...updateData } = data;
    const response = await axiosInstance.put(`/api/user/${id}`, updateData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/api/user/${userId}`);
  },

  bulkDeleteUsers: async (userIds: (string | number)[]): Promise<void> => {
    await axiosInstance.delete("/api/user/bulk", { data: userIds });
  },

  fetchUsersByRole: async (role: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/api/user/role/${role}`);
    return response.data;
  },

  searchStudents: async (query: string): Promise<User[]> => {
    if (!query) {
      return [];
    }
    const response = await axiosInstance.get(
      `/teams/students/search?query=${encodeURIComponent(query)}`,
    );
    const result = response.data;
    return Array.isArray(result) ? result : result.data || [];
  },

  fetchUserById: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/api/user/${userId}`);
    return response.data;
  },
};

export default userQueries;
