import axiosInstance from "@/lib/axios/axios-client";
import { Lab } from "@/types/types";

interface CreateLabData {
  name: string;
  block: string;
  ipSubnet: string;
}

interface UpdateLabData {
  name: string;
  block: string;
  ipSubnet: string;
}

interface LabsResponse {
  data: Lab[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}

const labQueries = {
  getLabs: async (): Promise<LabsResponse> => {
    const response = await axiosInstance.get("/api/lab");
    return response.data;
  },

  searchLabs: async (
    name?: string,
    block?: string,
    ipSubnet?: string,
  ): Promise<LabsResponse> => {
    const params: { [key: string]: string } = {};

    if (name) params.name = name;
    if (block) params.block = block;
    if (ipSubnet) params.ipSubnet = ipSubnet;

    const response = await axiosInstance.get("/api/lab/search", { params });
    return response.data;
  },

  createLab: async (data: CreateLabData): Promise<Lab> => {
    const response = await axiosInstance.post("/api/lab", data);
    return response.data;
  },

  updateLab: async (id: string, data: UpdateLabData): Promise<Lab> => {
    const response = await axiosInstance.put(`/api/lab/${id}`, data);
    return response.data;
  },

  deleteLab: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/lab/${id}`);
  },

  deleteMultipleLabs: async (ids: string[]): Promise<void> => {
    await axiosInstance.delete("/api/lab/batch", { data: { ids } });
  },
};

export default labQueries;
