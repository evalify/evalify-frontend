import axiosInstance from "@/lib/axios/axios-client";

// Define BankSchema type
export type BankSchema = {
  id: string;
  name: string;
  description: string;
  semester: number;
  batch: string[];
  createdAt: string;
  bankQuestion: string[];
};

class Bank {
  async getAllBanks() {
    const response = await axiosInstance.get("/bank");
    return await response.data;
  }
  async createBank(bankData: BankSchema) {
    const response = await axiosInstance.post("/bank", bankData);
    return await response.data;
  }
}

export default Bank;
