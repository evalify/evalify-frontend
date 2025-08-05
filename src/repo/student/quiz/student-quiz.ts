import axiosInstance from "@/lib/axios/axios-client";

class StudentQuiz {
  static async getAllStudentQuizzes(status?: string) {
    const params = status && status !== "all" ? { status } : {};
    const result = await axiosInstance.get("/api/students/quiz", { params });
    return await result.data;
  }

  static async startQuiz(quizId: string) {
    const result = await axiosInstance.post(`/api/quiz/${quizId}/start`, {
      password: "1234",
    });
    return await result.data;
  }
}
export default StudentQuiz;
