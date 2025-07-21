import { Difficulty, QuestionTypes } from "@/components/render-questions";
import axiosInstance from "@/lib/axios/axios-client";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type BankSchema = {
  id: string;
  name: string;
  courseCode: string;
  semester: string;
  questions: number;
  topics: number;
  created_at: string;
  access: User[];
};

type BankQuestion = {
  id: string;
  question: string;
  type: string;
  marks?: number;
  difficulty?: string;
  explanation?: string;
  hintText?: string;
  bloomsTaxonomy?: string;
  co?: number;
  created_at: string;
  topics?: BankTopic[];
  _originalData?: Record<string, unknown>; // Store original backend response for ID extraction
};

export type { BankQuestion };

export type BankTopic = {
  id: string;
  name: string;
};

export type CopyBankQuestionDTO = {
  bankId: string;
  questionIds: string[];
  move: boolean;
  createNewTopic: boolean;
};

export type AddBankQuestionDTO = {
  sectionId: string;
  bankQuestionId: string[]; // Singular form to match backend
};

export type QuizQuestionAddResponse = {
  message: string;
  addedQuestionsCount: number; // Changed from addedQuestions to match backend
  totalQuestions: number;
};

// Add paginated response type
export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};
interface SharedUser {
  user: User;
  tag: string;
}

export interface SharedUsers {
  sharedUsers: SharedUser[];
}

class Bank {
  static async getFilteredQuestions(
    bankId: string[],
    noOfQuestions: number,
    difficulty: Difficulty[],
    sectionId: string,
    quizId?: string,
    topicIds?: string[],
    questionType?: QuestionTypes[],
    signal?: AbortSignal, // Add AbortSignal parameter
  ): Promise<BankQuestion[]> {
    const body = {
      topicId: topicIds || null,
      bankId,
      difficulty,
      noOfQuestions,
      questionType: questionType || null,
    };

    console.log("Request body:", body);

    const response = await axiosInstance.post<BankQuestion[]>(
      `/api/quiz/${quizId}/question/filter`,
      body,
      { signal }, // Pass AbortSignal to axios config
    );
    return response.data;
  }
  static async getAllBanks(
    params?: URLSearchParams,
  ): Promise<PaginatedResponse<BankSchema>> {
    const url = params ? `/api/bank?${params.toString()}` : "/api/bank";
    const response = await axiosInstance.get(url);
    return response.data;
  }

  static async getBankUsers(bankId: string): Promise<SharedUsers> {
    const response = await axiosInstance.get(`/api/bank/${bankId}/share`);
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

  static async getBankQuestions(
    bankId: string,
    topicIds: string[],
  ): Promise<unknown[]> {
    const params = new URLSearchParams();
    topicIds.forEach((id) => params.append("topicIds", id));

    const response = await axiosInstance.get(
      `/api/bank/${bankId}/questions/by-topic?${params.toString()}`,
    );
    return response.data;
  }

  static async addQuestionToBank(
    bankId: string,
    questionData: Record<string, unknown>,
  ): Promise<BankQuestion> {
    const response = await axiosInstance.put(
      `/api/bank/${bankId}/questions/add-question`,
      questionData,
    );
    return response.data;
  }

  static async getBankQuestionsByTopic(
    bankId: string,
    topicIds: string[],
  ): Promise<BankQuestion[]> {
    const response = await axiosInstance.post(
      `/api/bank/${bankId}/questions/by-topic`,
      topicIds,
    );
    return response.data;
  }

  static async shareBank(
    bankId: string,
    userIds: string[],
  ): Promise<SharedUsers> {
    const response = await axiosInstance.post(`/api/bank/${bankId}/share`, {
      userID: userIds,
    });
    return response.data;
  }

  static async unshareBank(
    bankId: string,
    userIds: string[],
  ): Promise<SharedUsers> {
    const response = await axiosInstance.delete(`/api/bank/${bankId}/share`, {
      data: { userID: userIds },
    });
    return response.data;
  }

  static async copyQuestions(
    sourceBankId: string,
    dto: CopyBankQuestionDTO,
  ): Promise<void> {
    const response = await axiosInstance.post(
      `/api/bank/${sourceBankId}/copy`,
      dto,
    );
    return response.data;
  }

  static async addBankQuestionToQuiz(
    quizId: string,
    dto: AddBankQuestionDTO,
  ): Promise<QuizQuestionAddResponse> {
    console.log("Adding bank question to quiz:", {
      quizId,
      dto,
    });
    const response = await axiosInstance.post(
      `/api/quiz/${quizId}/question/add`,
      dto,
    );
    return response.data;
  }
}

export default Bank;
