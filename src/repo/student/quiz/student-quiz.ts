import axiosInstance from "@/lib/axios/axios-client";

class StudentQuiz {
  static async getAllStudentQuizzes() {
    const result = await axiosInstance.get("/api/students/quiz");
    return await result.data;
  }
}
export default StudentQuiz;
