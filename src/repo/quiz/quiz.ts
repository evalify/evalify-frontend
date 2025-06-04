import axiosInstance from "@/lib/axios/axios-client";

const Quiz = {
  async getAllQuizzes() {
    return axiosInstance("/api/quiz", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default Quiz;
