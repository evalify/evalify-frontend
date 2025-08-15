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
  semester: string; // Changed from number to string to match API response (e.g., "S1", "S2")
  questions: number;
  topics: number;
  created_at: string;
  access: Array<{
    user: {
      id: string;
      name: string;
      email: string;
      profileId: string | null;
    };
    tag: string;
  }>;
};

type BankQuestion = {
  id?: string;
  questionId?: string; // Backend uses both id and questionId
  question: string;
  type: string;
  marks?: number;
  difficulty?: string;
  created_at?: string;
  topics?: BankTopic[];

  // Additional fields that should be included for proper rendering
  explanation?: string | null;
  hint?: string | null;
  bloomsTaxonomy?: string;
  co?: number;

  // MCQ/MMCQ specific fields
  options?: Array<{
    id?: string | null;
    text: string;
    isCorrect: boolean;
  }>;

  // TRUE/FALSE specific fields
  answers?: boolean;

  // CODING specific fields
  functionName?: string;
  returnType?: string;
  params?: Array<{
    param: string;
    type: string;
  }>;
  language?: string[];
  driverCode?: string;
  boilerCode?: string;
  testcases?: Array<{
    input: unknown[];
    expected: unknown;
    tags?: string;
    isMinimal?: boolean;
    language?: string;
  }>;
  answer?: string | null;

  // FILL_UP specific fields
  strictMatch?: boolean;
  llmEval?: boolean | null;
  template?: string;
  blanks?: Array<{
    id: string;
    answers: string[];
  }>;

  // DESCRIPTIVE specific fields
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;

  // MATCH_THE_FOLLOWING specific fields
  keys?: Array<{
    id?: string;
    leftPair: string;
    rightPair: string;
  }>;
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
      topicId: topicIds?.length ? topicIds : null,
      bankId,
      difficulty: difficulty.length ? difficulty : null,
      noOfQuestions,
      questionType: questionType?.length ? questionType : null,
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

  static async createBank(bankData: {
    name: string;
    courseCode?: string;
    semester: string;
  }): Promise<BankSchema> {
    // Convert semester string (e.g., "S1") to integer (e.g., 1) for API
    const semesterNumber = parseInt(bankData.semester.substring(1));

    const payload = {
      name: bankData.name,
      courseCode: bankData.courseCode || null,
      semester: semesterNumber,
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
    bankData: Partial<Omit<BankSchema, "semester">> & { semester?: number },
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
  ): Promise<BankQuestion[]> {
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
  ) {
    await axiosInstance.post(`/api/bank/${bankId}/questions`, questionData);
  }

  static async updateBankQuestion(
    bankId: string,
    id: string,
    questionData: Record<string, unknown>,
  ) {
    await axiosInstance.patch(
      `/api/bank/${bankId}/questions/${id}`,
      questionData,
    );
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

  static async deleteBankQuestion(
    bankId: string,
    questionId: string,
  ): Promise<void> {
    await axiosInstance.delete(`/api/bank/${bankId}/questions/${questionId}`);
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
