import {
  QuestionCreationRequest,
  QuestionResponse,
} from "@/components/question_creation/types";
import axiosInstance from "@/lib/axios/axios-client";
import { QuestionData } from "@/components/question_creation/question-editor";

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}

interface QuestionCreationSettings {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  courseOutcome: string;
  topics: { value: string; label: string }[];
}

interface CreateQuestionRequest {
  type: QuestionCreationRequest["type"];
  data: QuestionData;
  settings: QuestionCreationSettings;
}

class QuestionsService {
  private isValidUUID(str: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  private transformQuestionData(
    request: CreateQuestionRequest,
    isUpdate: boolean = false,
  ): any {
    const { type, data, settings } = request;

    // Extract topic IDs from settings
    const topicIds = settings.topics.map((topic) => topic.value);

    // Parse course outcome to integer
    const co = parseInt(settings.courseOutcome) || 0;

    // Map difficulty to backend enum
    const difficultyMap: Record<string, string> = {
      easy: "EASY",
      medium: "MEDIUM",
      hard: "HARD",
    };

    // Map blooms taxonomy to backend enum
    const taxonomyMap: Record<string, string> = {
      remember: "REMEMBER",
      understand: "UNDERSTAND",
      apply: "APPLY",
      analyze: "ANALYZE",
      evaluate: "EVALUATE",
      create: "CREATE",
    };

    // Base DTO structure
    const baseDTO = {
      type: type.toUpperCase().replace("-", "_"),
      question: data.question,
      topicIds,
      explanation: data.explanation || null,
      hint: null, // Not currently supported in frontend
      marks: settings.marks,
      bloomsTaxonomy: taxonomyMap[settings.bloomsTaxonomy] || "UNDERSTAND",
      co,
      negativeMark: null, // Not currently supported in frontend
      difficulty: difficultyMap[settings.difficulty] || "MEDIUM",
    };

    // Add type-specific fields based on discriminated union
    switch (data.type) {
      case "mcq":
        return {
          ...baseDTO,
          type: data.allowMultipleCorrect ? "MMCQ" : "MCQ",
          options: (data.options || []).map((option) => {
            const optionData: any = {
              text: option.text,
              isCorrect: option.isCorrect,
            };

            // Include id only for updates and only if it's a valid UUID
            if (isUpdate && this.isValidUUID(option.id)) {
              optionData.id = option.id;
            }
            // For create operations or frontend-generated IDs, exclude id field

            return optionData;
          }),
        };

      case "coding":
        return {
          ...baseDTO,
          type: "CODING",
          driverCode: null, // Not currently used
          boilerCode: data.starterCode || null,
          functionName: data.functionName || null,
          returnType: null, // Would need to be added to frontend
          params: null, // Would need to be added to frontend
          testcases:
            data.testCases?.map((tc: any) => ({
              input: tc.inputs,
              output: tc.expectedOutput,
              isHidden: tc.isHidden || false,
            })) || [],
          language: data.language ? [data.language] : [],
          answer: null,
        };

      case "fillup":
        return {
          ...baseDTO,
          type: "FILL_UP",
          strictMatch: data.strictMatch || false,
          llmEval: data.useHybridEvaluation || false,
          template: data.question, // Use question as template
          blanks:
            data.blanks?.map((blank: any) => ({
              id: blank.id,
              answers: blank.acceptedAnswers || [],
              position: blank.position || 0,
            })) || [],
        };

      case "descriptive":
        return {
          ...baseDTO,
          type: "DESCRIPTIVE",
          expectedAnswer: data.sampleAnswer || null,
          strictness: 0.7, // Default strictness
          guidelines: data.gradingCriteria || null,
        };

      case "match-following":
        return {
          ...baseDTO,
          type: "MATCH_THE_FOLLOWING",
          keys:
            data.matchItems?.map((item: any) => {
              const itemData: any = {
                leftPair: item.leftText,
                rightPair: item.rightText,
                id: item.id,
              };
              return itemData;
            }) || [],
        };

      case "true-false":
        return {
          ...baseDTO,
          type: "TRUEFALSE",
          answers: data.correctAnswer,
        };

      case "file-upload":
        return {
          ...baseDTO,
          type: "FILE_UPLOAD",
          // File upload specific fields would need to be added to backend DTO
        };

      default:
        return baseDTO;
    }
  }

  async createQuestion(
    questionData: CreateQuestionRequest,
    bankId: string,
  ): Promise<QuestionResponse> {
    try {
      const transformedData = this.transformQuestionData(questionData, false);

      const response = await axiosInstance.post(
        `/api/bank/${bankId}/questions`,
        transformedData,
      );

      // Since backend returns 201 with no body, we'll create a mock response
      return {
        id: `temp-${Date.now()}`, // Temporary ID until backend returns the actual ID
        type: questionData.type,
        content: questionData.data.question,
        marks: questionData.settings.marks,
        difficulty: questionData.settings.difficulty,
        bloomsTaxonomy: questionData.settings.bloomsTaxonomy,
        courseOutcome: questionData.settings.courseOutcome,
        topics: questionData.settings.topics.map((t) => t.value),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(
          errorData.message || errorData.error || "Failed to save question",
        );
      }
      throw new Error("Network error: Unable to save question");
    }
  }

  async getQuestion(id: string, bankId: string): Promise<QuestionResponse> {
    try {
      const response = await axiosInstance.get(
        `/api/bank/${bankId}/questions/${id}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(
          errorData.message || errorData.error || "Failed to fetch question",
        );
      }
      throw new Error("Network error: Unable to fetch question");
    }
  }

  async updateQuestion(
    id: string,
    questionData: CreateQuestionRequest,
    bankId: string,
  ): Promise<QuestionResponse> {
    try {
      const transformedData = this.transformQuestionData(questionData, true);

      const response = await axiosInstance.put(
        `/api/bank/${bankId}/questions/${id}`,
        transformedData,
      );

      // Backend returns 200 OK with no body on successful update
      return {
        id: id,
        type: questionData.type,
        content: questionData.data.question,
        marks: questionData.settings.marks,
        difficulty: questionData.settings.difficulty,
        bloomsTaxonomy: questionData.settings.bloomsTaxonomy,
        courseOutcome: questionData.settings.courseOutcome,
        topics: questionData.settings.topics.map((t) => t.value),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(
          errorData.message || errorData.error || "Failed to update question",
        );
      }
      throw new Error("Network error: Unable to update question");
    }
  }

  async deleteQuestion(
    id: string,
    bankId: string,
  ): Promise<{ message: string }> {
    try {
      await axiosInstance.delete(`/api/bank/${bankId}/questions/${id}`);
      return { message: "Question deleted successfully" };
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(
          errorData.message || errorData.error || "Failed to delete question",
        );
      }
      throw new Error("Network error: Unable to delete question");
    }
  }

  async getAllQuestions(bankId: string): Promise<QuestionResponse[]> {
    try {
      const response = await axiosInstance.get(`/api/bank/${bankId}/questions`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(
          errorData.message || errorData.error || "Failed to fetch questions",
        );
      }
      throw new Error("Network error: Unable to fetch questions");
    }
  }
}

export const questionsService = new QuestionsService();
