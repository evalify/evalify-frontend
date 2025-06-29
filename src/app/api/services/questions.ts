import {
  QuestionCreationRequest,
  QuestionResponse,
} from "@/components/question_creation/question-creation-types";

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}

class QuestionsService {
  private readonly baseUrl = "/api/questions";

  async createQuestion(
    questionData: QuestionCreationRequest,
  ): Promise<QuestionResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || errorData.error || "Failed to save question",
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error: Unable to save question");
    }
  }

  async getQuestion(id: string): Promise<QuestionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || errorData.error || "Failed to fetch question",
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error: Unable to fetch question");
    }
  }

  async updateQuestion(
    id: string,
    questionData: QuestionCreationRequest,
  ): Promise<QuestionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || errorData.error || "Failed to update question",
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error: Unable to update question");
    }
  }

  async deleteQuestion(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || errorData.error || "Failed to delete question",
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error: Unable to delete question");
    }
  }
}

export const questionsService = new QuestionsService();
