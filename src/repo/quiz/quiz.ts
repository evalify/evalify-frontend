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

  static async getQuizzesByCourseId(courseId: string) {
    const response = await axiosInstance.get(`/api/quiz/course/${courseId}`);
    return await response.data;
  }

  static async getQuizQuestions(quizId: string) {
    const response = await axiosInstance.get(`/api/quiz/${quizId}/questions`);
    return await response.data;
  }

  /* Quiz Sections */
  static async getQuizSections(quizId: string) {
    const response = await axiosInstance.get(`/api/quiz/${quizId}/section`);
    return await response.data;
  }

  static async createQuizSection(
    quizId: string,
    sectionData: { name: string },
  ) {
    const response = await axiosInstance.post(
      `/api/quiz/${quizId}/section`,
      sectionData,
    );
    return await response.data;
  }
  static async updateQuizSection(
    quizId: string,
    sectionId: string,
    sectionData: { name: string },
  ) {
    const response = await axiosInstance.put(
      `/api/quiz/${quizId}/section/${sectionId}`,
      sectionData,
    );
    return await response.data;
  }
  static async deleteQuizSection(quizId: string, sectionId: string) {
    const response = await axiosInstance.delete(
      `/api/quiz/${quizId}/section/${sectionId}`,
    );
    return await response.data;
  }
}
export default Quiz;
