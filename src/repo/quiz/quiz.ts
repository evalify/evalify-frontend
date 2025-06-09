import axiosInstance from "@/lib/axios/axios-client";

const Quiz = {
  async getAllQuizzes() {
    const response = axiosInstance.get("/quiz");
    return response;
  },
  // async createQuiz(quizData) {
  //   const response = await axiosInstance.post("/quiz", quizData);
  //   return response;
  // },
};

export default Quiz;
