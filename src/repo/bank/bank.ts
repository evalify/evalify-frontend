import axiosInstance from "@/lib/axios/axios-client";

type User = {
  id: string;
  name: string;
  email: string;
};

type BankSchema = {
  id: string;
  name: string;
  courseCode: string;
  semester: string;
  questions: number;
  topics: number;
  created_at: string;
  access: User[];
};

type BankTopic = {
  id: string;
  name: string;
};

class Bank {
  static async getAllBanks(params?: URLSearchParams): Promise<BankSchema[]> {
    const url = params ? `/bank?${params.toString()}` : "/api/bank/";
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async createBank(
    bankData: Omit<BankSchema, "id" | "created_at">,
  ): Promise<BankSchema> {
    const payload = {
      ...bankData,
      createdAt: new Date().toISOString(), // Adds "2025-06-07T09:02:11.036Z"
    };

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
    const response = await axiosInstance.patch(`/api/bank/${bankId}`, bankData);
    return response.data;
  }

  static async deleteBank(bankId: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`/api/bank/${bankId}`);
    return response.data;
  }

  static async getBankTopics(bankId: string): Promise<BankTopic[]> {
    const response = await axiosInstance.get(`/api/bank/${bankId}/topics`);
    return response.data;
  }

  static async addBankTopic(
    bankId: string,
    topic: string,
  ): Promise<BankTopic[]> {
    const response = await axiosInstance.post(`/api/bank/${bankId}/topic`, {
      name: topic,
    });
    return response.data;
  }

  static async updateBankTopic(
    bankId: string,
    topicId: string,
    topicData: Partial<BankTopic>,
  ): Promise<BankTopic> {
    const response = await axiosInstance.put(
      `/api/bank/${bankId}/topic/${topicId}`,
      topicData,
    );
    return response.data;
  }

  static async deleteBankTopic(
    bankId: string,
    topicId: string,
  ): Promise<BankTopic[]> {
    const response = await axiosInstance.delete(
      `/api/bank/${bankId}/topic/${topicId}`,
    );
    return response.data;
  }
}

export default Bank;
