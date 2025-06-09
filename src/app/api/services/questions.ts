import { QuestionData } from "@/components/question_creation/question-editor";
import { QuestionType } from "@/components/question_creation/question-type-selector";

export interface QuestionCreationRequest {
  type: QuestionType;
  data: QuestionData;
  settings: {
    marks: number;
    difficulty: string;
    bloomsTaxonomy: string;
    courseOutcome: string;
    topics: { value: string; label: string }[];
  };
}

export interface QuestionResponse {
  id: string;
  message: string;
  question: QuestionCreationRequest;
}

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
