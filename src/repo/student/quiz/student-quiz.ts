import axiosInstance from "@/lib/axios/axios-client";

// Types for quiz update operations
export interface QuizAnswerUpdate {
  questionId: string;
  duration: number; // Duration spent on this question in milliseconds
  answer: QuizAnswerData;
}

export type QuizAnswerData =
  | string // Coding, Descriptive, File upload
  | boolean // True/False
  | string // MCQ (UUID)
  | string[] // MMCQ (List of UUIDs)
  | FillUpAnswer[] // Fill up
  | MatchAnswer[]; // Match the following

export interface FillUpAnswer {
  id: string;
  answer: string | null;
}

export interface MatchAnswer {
  leftPairId: string;
  rightPairId: string;
}

class StudentQuiz {
  static async getAllStudentQuizzes(status?: string) {
    const params = status && status !== "all" ? { status } : {};
    const result = await axiosInstance.get("/api/students/quiz", { params });
    return await result.data;
  }

  static async startQuiz(quizId: string, password?: string) {
    const result = await axiosInstance.post(`/api/quiz/${quizId}/start`, {
      password: password || "",
    });
    return await result.data;
  }

  static async updateQuiz(quizId: string, data: QuizAnswerUpdate) {
    const result = await axiosInstance.patch(
      `/api/quiz/${quizId}/update`,
      data,
    );
    return await result.data;
  }

  static async submitQuiz(quizId: string) {
    const result = await axiosInstance.patch(`/api/quiz/${quizId}/submit`);
    return await result.data;
  }
}
export default StudentQuiz;
