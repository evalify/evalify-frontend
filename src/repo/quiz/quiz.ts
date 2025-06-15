import axiosInstance from "@/lib/axios/axios-client";

type QuizSchema = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  startTime: string;
  endTime: string;
  duration: number;
  password: string;
  fullScreen: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  linearQuiz: boolean;
  calculator: boolean;
  autoSubmit: boolean;
  publishResult: boolean;
  publishQuiz: boolean;
  section: string[];
  course: string[];
  student: string[];
  lab: string[];
  batch: string[];
  createdAt: string;
  createdBy: string;
};

class Quiz {
  static async getAllQuizzes() {
    const response = await axiosInstance.get("/api/quiz");
    return await response.data;
  }
  static async createQuiz(quizData: QuizSchema) {
    const response = await axiosInstance.post("/api/quiz", quizData);
    return await response.data;
  }
  static async getQuizById(quizId: string) {
    const response = await axiosInstance.get(`/api/quiz/${quizId}`);
    return await response.data;
  }
  static async updateQuiz(quizId: string, quizData: QuizSchema) {
    const response = await axiosInstance.put(`/api/quiz/${quizId}`, quizData);
    return await response.data;
  }
  static async deleteQuiz(quizId: string) {
    const response = await axiosInstance.delete(`/api/quiz/${quizId}`);
    return await response.data;
  }
}

export default Quiz;
