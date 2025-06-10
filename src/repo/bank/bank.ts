import axiosInstance from "@/lib/axios/axios-client";

type BankSchema = {
  id: string;
  name: string;
  description: string;
  semester: number; // change from string to number
  course: string[]; // add course array
  batch: string[]; // add batch array if used
  created_at: string; // ISO string for created time (use snake_case to match backend)
};

class Bank {
  static async getAllBanks(params?: URLSearchParams): Promise<BankSchema[]> {
    const url = params ? `/api/bank?${params.toString()}` : "/api/bank";
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async createBank(
    bankData: Omit<BankSchema, "id" | "created_at">,
  ): Promise<BankSchema> {
    const payload = {
      ...bankData,
      created_at: new Date().toISOString(), // Adds "2025-06-07T09:02:11.036Z"
    };

    console.log("Creating bank with data:", payload);
    const response = await axiosInstance.post("/api/bank", payload);
    return response.data;
  }

  static async getBankById(bankId: string): Promise<BankSchema> {
    const response = await axiosInstance.get(`/api/bank/${bankId}`);
    return response.data;
  }

  static async updateBank(
    bankId: string,
    bankData: Partial<BankSchema>,
  ): Promise<BankSchema> {
    const response = await axiosInstance.put(`/api/bank/${bankId}`, bankData);
    return response.data;
  }

  static async deleteBank(bankId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/api/bank/${bankId}`);
    return response.data;
  }
}

export default Bank;
