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

// Backend response interface for bank question details
export interface BankQuestionDTO {
  id: string;
  question: string;
  explanation: string | null;
  hint: string | null;
  marks: number;
  bloomsTaxonomy: string;
  co: number;
  negativeMark: number | null;
  difficulty: string;
  topics: Array<{ id: string; name: string }>;
  questionType: string;
  updatedAt: string;
  updatedBy: string | null;
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

// Backend DTO interfaces
interface BaseQuestionDTO {
  type: string;
  question: string;
  topicIds: string[];
  explanation: string | null;
  hint: string | null;
  marks: number;
  bloomsTaxonomy: string;
  co: number;
  negativeMark: number | null;
  difficulty: string;
}

interface MCQQuestionDTO extends BaseQuestionDTO {
  type: "MCQ" | "MMCQ";
  options: Array<{
    id?: string;
    text: string;
    isCorrect: boolean;
  }>;
}

interface CodingQuestionDTO extends BaseQuestionDTO {
  type: "CODING";
  driverCode: string | null;
  boilerCode: string | null;
  functionName: string | null;
  returnType: string | null;
  params: string | null;
  testcases: Array<{
    input: Record<string, string>;
    output: string;
    isHidden: boolean;
  }>;
  language: string[];
  answer: string | null;
}

interface FillupQuestionDTO extends BaseQuestionDTO {
  type: "FILL_UP";
  strictMatch: boolean;
  llmEval: boolean;
  template: string;
  blanks: Array<{
    id: string;
    answers: string[];
    position: number;
  }>;
}

interface DescriptiveQuestionDTO extends BaseQuestionDTO {
  type: "DESCRIPTIVE";
  expectedAnswer: string | null;
  strictness: number;
  guidelines: string | null;
}

interface MatchFollowingQuestionDTO extends BaseQuestionDTO {
  type: "MATCH_THE_FOLLOWING";
  keys: Array<{
    id: string;
    leftPair: string;
    rightPair: string;
  }>;
}

interface TrueFalseQuestionDTO extends BaseQuestionDTO {
  type: "TRUEFALSE";
  answers: boolean | null;
}

interface FileUploadQuestionDTO extends BaseQuestionDTO {
  type: "FILE_UPLOAD";
}

type QuestionDTO =
  | MCQQuestionDTO
  | CodingQuestionDTO
  | FillupQuestionDTO
  | DescriptiveQuestionDTO
  | MatchFollowingQuestionDTO
  | TrueFalseQuestionDTO
  | FileUploadQuestionDTO;

class QuestionsService {
  private isValidUUID(str: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  private transformQuestionData(
    request: CreateQuestionRequest,
    isUpdate: boolean = false,
  ): QuestionDTO {
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
      hint: null,
      marks: settings.marks,
      bloomsTaxonomy: taxonomyMap[settings.bloomsTaxonomy] || "UNDERSTAND",
      co,
      negativeMark: null,
      difficulty: difficultyMap[settings.difficulty] || "MEDIUM",
    };

    switch (data.type) {
      case "mcq":
        return {
          ...baseDTO,
          type: data.allowMultipleCorrect ? "MMCQ" : "MCQ",
          options: (data.options || []).map((option) => {
            const optionData: {
              id?: string;
              text: string;
              isCorrect: boolean;
            } = {
              text: option.text,
              isCorrect: option.isCorrect,
            };
            if (isUpdate && this.isValidUUID(option.id)) {
              optionData.id = option.id;
            }

            return optionData;
          }),
        };

      case "coding":
        return {
          ...baseDTO,
          type: "CODING",
          driverCode: null,
          boilerCode: data.starterCode || null,
          functionName: data.functionName || null,
          returnType: null,
          params: null,
          testcases:
            data.testCases?.map((tc) => ({
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
          template: data.question,
          blanks:
            data.blanks?.map((blank) => ({
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
          strictness: 0.7,
          guidelines: data.gradingCriteria || null,
        };

      case "match-following":
        return {
          ...baseDTO,
          type: "MATCH_THE_FOLLOWING",
          keys:
            data.matchItems?.map((item) => {
              return {
                leftPair: item.leftText,
                rightPair: item.rightText,
                id: item.id,
              };
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
        };

      default:
        // Default to MCQ if type is unknown
        return {
          ...baseDTO,
          type: "MCQ",
          options: [],
        };
    }
  }

  async createQuestion(
    questionData: CreateQuestionRequest,
    bankId: string,
  ): Promise<QuestionResponse> {
    try {
      const transformedData = this.transformQuestionData(questionData, false);

      await axiosInstance.post(
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
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: ApiError } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          throw new Error(
            errorData.message || errorData.error || "Failed to save question",
          );
        }
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
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: ApiError } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          throw new Error(
            errorData.message || errorData.error || "Failed to fetch question",
          );
        }
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

      await axiosInstance.put(
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
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: ApiError } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          throw new Error(
            errorData.message || errorData.error || "Failed to update question",
          );
        }
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
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: ApiError } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          throw new Error(
            errorData.message || errorData.error || "Failed to delete question",
          );
        }
      }
      throw new Error("Network error: Unable to delete question");
    }
  }

  async getAllQuestions(bankId: string): Promise<QuestionResponse[]> {
    try {
      const response = await axiosInstance.get(`/api/bank/${bankId}/questions`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: ApiError } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          throw new Error(
            errorData.message || errorData.error || "Failed to fetch questions",
          );
        }
      }
      throw new Error("Network error: Unable to fetch questions");
    }
  }

  async getBankQuestionById(questionId: string): Promise<BankQuestionDTO> {
    try {
      const response = await axiosInstance.get(
        `/api/bank/questions/${questionId}`,
      );
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: ApiError } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          throw new Error(
            errorData.message ||
              errorData.error ||
              "Failed to fetch question details",
          );
        }
      }
      throw new Error("Network error: Unable to fetch question details");
    }
  }

  private transformBackendToFrontend(backendQuestion: BankQuestionDTO): {
    questionData: QuestionData;
    questionSettings: QuestionCreationSettings;
  } {
    const difficultyMap: Record<string, string> = {
      EASY: "easy",
      MEDIUM: "medium",
      HARD: "hard",
    };

    // Map taxonomy from backend enum to frontend
    const taxonomyMap: Record<string, string> = {
      REMEMBER: "remember",
      UNDERSTAND: "understand",
      APPLY: "apply",
      ANALYZE: "analyze",
      EVALUATE: "evaluate",
      CREATE: "create",
    };

    // Map question type from backend to frontend
    const typeMap: Record<string, string> = {
      MCQ: "mcq",
      MMCQ: "mcq",
      CODING: "coding",
      FILL_UP: "fillup",
      DESCRIPTIVE: "descriptive",
      MATCH_THE_FOLLOWING: "match-following",
      TRUE_FALSE: "true-false",
      FILE_UPLOAD: "file-upload",
    };

    const frontendType = typeMap[backendQuestion.questionType] || "mcq";

    // Base question data
    const baseQuestionData = {
      question: backendQuestion.question,
      explanation: backendQuestion.explanation || "",
      showExplanation: !!backendQuestion.explanation,
    };

    // Create question data based on type
    let questionData: QuestionData;
    switch (frontendType) {
      case "mcq":
        questionData = {
          ...baseQuestionData,
          type: "mcq",
          allowMultipleCorrect: backendQuestion.questionType === "MMCQ",
          options: [], // This would need to be fetched separately or included in the response
        };
        break;
      case "coding":
        questionData = {
          ...baseQuestionData,
          type: "coding",
          language: "",
          starterCode: "",
          testCases: [],
          timeLimit: 30,
          memoryLimit: 256,
          functionName: "",
        };
        break;
      case "fillup":
        questionData = {
          ...baseQuestionData,
          type: "fillup",
          blanks: [],
          strictMatch: false,
          useHybridEvaluation: false,
        };
        break;
      case "descriptive":
        questionData = {
          ...baseQuestionData,
          type: "descriptive",
          sampleAnswer: "",
          wordLimit: 500,
          gradingCriteria: "",
        };
        break;
      case "match-following":
        questionData = {
          ...baseQuestionData,
          type: "match-following",
          matchItems: [],
        };
        break;
      case "true-false":
        questionData = {
          ...baseQuestionData,
          type: "true-false",
          correctAnswer: null,
        };
        break;
      case "file-upload":
        questionData = {
          ...baseQuestionData,
          type: "file-upload",
          allowedFileTypes: [],
          maxFileSize: 10,
          maxFiles: 1,
        };
        break;
      default:
        questionData = {
          ...baseQuestionData,
          type: "mcq",
          allowMultipleCorrect: false,
          options: [],
        };
    }

    const questionSettings: QuestionCreationSettings = {
      marks: backendQuestion.marks,
      difficulty: difficultyMap[backendQuestion.difficulty] || "medium",
      bloomsTaxonomy:
        taxonomyMap[backendQuestion.bloomsTaxonomy] || "understand",
      courseOutcome: backendQuestion.co.toString(),
      topics: backendQuestion.topics.map((topic) => ({
        value: topic.id,
        label: topic.name,
      })),
    };

    return { questionData, questionSettings };
  }

  async getQuestionForEdit(questionId: string): Promise<{
    questionData: QuestionData;
    questionSettings: QuestionCreationSettings;
  }> {
    const backendQuestion = await this.getBankQuestionById(questionId);
    return this.transformBackendToFrontend(backendQuestion);
  }
}

export const questionsService = new QuestionsService();
