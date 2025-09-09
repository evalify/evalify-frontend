import axiosInstance from "@/lib/axios/axios-client";

/**
 * Base interface for quiz answer updates
 */
export interface BaseQuizAnswerUpdate {
  questionId: string;
  duration: number; // Duration spent on this question in milliseconds
}

/**
 * Specific answer update interfaces for different question types
 */
export interface StringAnswerUpdate extends BaseQuizAnswerUpdate {
  stringAnswer: string; // For Coding, Descriptive, File upload
}

export interface BooleanAnswerUpdate extends BaseQuizAnswerUpdate {
  booleanAnswer: boolean; // For True/False
}

export interface UuidAnswerUpdate extends BaseQuizAnswerUpdate {
  uuidAnswer: string; // For MCQ (single selection)
}

export interface ListUuidAnswerUpdate extends BaseQuizAnswerUpdate {
  listUUIDAnswer: string[]; // For MMCQ (multiple selections)
}

export interface FillUpAnswerUpdate extends BaseQuizAnswerUpdate {
  fillupAnswer: FillUpAnswer[]; // For Fill up questions
}

export interface MatchAnswerUpdate extends BaseQuizAnswerUpdate {
  matchAnswer: MatchAnswer[]; // For Match the following
}

/**
 * Union type for all possible answer update types
 */
export type QuizAnswerUpdate =
  | StringAnswerUpdate
  | BooleanAnswerUpdate
  | UuidAnswerUpdate
  | ListUuidAnswerUpdate
  | FillUpAnswerUpdate
  | MatchAnswerUpdate;

/**
 * Legacy support - maintain backward compatibility
 * @deprecated Use specific answer update types instead
 */
export interface LegacyQuizAnswerUpdate {
  questionId: string;
  duration: number;
  answer: QuizAnswerData;
}

export type QuizAnswerData =
  | string // Coding, Descriptive, File upload
  | boolean // True/False
  | string // MCQ (UUID)
  | string[] // MMCQ (List of UUIDs)
  | FillUpAnswer[] // Fill up
  | MatchAnswer[]; // Match the following

export interface FillUpAnswer {
  id: string;
  answer: string | null;
}

export interface MatchAnswer {
  leftPairId: string;
  rightPairId: string;
}

class StudentQuiz {
  /**
   * Get all student quizzes with optional status filter
   * @param status - Optional status filter for quizzes
   * @returns Promise with quiz list data
   */
  static async getAllStudentQuizzes(status?: string) {
    const params = status && status !== "all" ? { status } : {};
    const result = await axiosInstance.get("/api/students/quiz", { params });
    return await result.data;
  }

  /**
   * Start a quiz session
   * @param quizId - The ID of the quiz to start
   * @param password - Optional password for protected quizzes
   * @returns Promise with quiz session data
   */
  static async startQuiz(quizId: string, password?: string) {
    const result = await axiosInstance.post(`/api/quiz/${quizId}/start`, {
      password: password || "",
    });
    return await result.data;
  }

  /**
   * Update quiz answer with proper typing for different question types
   * @param quizId - The ID of the quiz
   * @param data - Answer update data with proper typing
   * @returns Promise with update response
   */
  static async updateQuiz(quizId: string, data: QuizAnswerUpdate) {
    const result = await axiosInstance.patch(
      `/api/quiz/${quizId}/update?save=false`,
      [data],
    );
    return await result.data;
  }

  /**
   * Legacy update method for backward compatibility
   * @deprecated Use updateQuiz with proper typing instead
   * @param quizId - The ID of the quiz
   * @param data - Legacy answer update data
   * @returns Promise with update response
   */
  static async updateQuizLegacy(quizId: string, data: LegacyQuizAnswerUpdate) {
    const result = await axiosInstance.patch(
      `/api/quiz/${quizId}/update`,
      data,
    );
    return await result.data;
  }

  /**
   * Submit the quiz for final evaluation
   * @param quizId - The ID of the quiz to submit
   * @returns Promise with submission response
   */
  static async submitQuiz(quizId: string) {
    const result = await axiosInstance.patch(`/api/quiz/${quizId}/submit`);
    return await result.data;
  }

  /**
   * Type-safe helper methods for different question types
   */

  /**
   * Update string-based answers (Coding, Descriptive, File upload)
   * @param quizId - Quiz ID
   * @param questionId - Question ID
   * @param answer - String answer
   * @param duration - Time spent on question
   */
  static async updateStringAnswer(
    quizId: string,
    questionId: string,
    answer: string,
    duration: number
  ) {
    const data: StringAnswerUpdate = {
      questionId,
      duration,
      stringAnswer: answer,
    };
    return this.updateQuiz(quizId, data);
  }

  /**
   * Update boolean answers (True/False)
   * @param quizId - Quiz ID
   * @param questionId - Question ID
   * @param answer - Boolean answer
   * @param duration - Time spent on question
   */
  static async updateBooleanAnswer(
    quizId: string,
    questionId: string,
    answer: boolean,
    duration: number
  ) {
    const data: BooleanAnswerUpdate = {
      questionId,
      duration,
      booleanAnswer: answer,
    };
    return this.updateQuiz(quizId, data);
  }

  /**
   * Update single choice answers (MCQ)
   * @param quizId - Quiz ID
   * @param questionId - Question ID
   * @param answer - Selected option UUID
   * @param duration - Time spent on question
   */
  static async updateSingleChoiceAnswer(
    quizId: string,
    questionId: string,
    answer: string,
    duration: number
  ) {
    const data: UuidAnswerUpdate = {
      questionId,
      duration,
      uuidAnswer: answer,
    };
    return this.updateQuiz(quizId, data);
  }

  /**
   * Update multiple choice answers (MMCQ)
   * @param quizId - Quiz ID
   * @param questionId - Question ID
   * @param answers - Array of selected option UUIDs
   * @param duration - Time spent on question
   */
  static async updateMultipleChoiceAnswer(
    quizId: string,
    questionId: string,
    answers: string[],
    duration: number
  ) {
    const data: ListUuidAnswerUpdate = {
      questionId,
      duration,
      listUUIDAnswer: answers,
    };
    return this.updateQuiz(quizId, data);
  }

  /**
   * Update fill-up answers
   * @param quizId - Quiz ID
   * @param questionId - Question ID
   * @param answers - Array of fill-up answers
   * @param duration - Time spent on question
   */
  static async updateFillUpAnswer(
    quizId: string,
    questionId: string,
    answers: FillUpAnswer[],
    duration: number
  ) {
    const data: FillUpAnswerUpdate = {
      questionId,
      duration,
      fillupAnswer: answers,
    };
    return this.updateQuiz(quizId, data);
  }

  /**
   * Update match-the-following answers
   * @param quizId - Quiz ID
   * @param questionId - Question ID
   * @param answers - Array of match pairs
   * @param duration - Time spent on question
   */
  static async updateMatchAnswer(
    quizId: string,
    questionId: string,
    answers: MatchAnswer[],
    duration: number
  ) {
    const data: MatchAnswerUpdate = {
      questionId,
      duration,
      matchAnswer: answers,
    };
    return this.updateQuiz(quizId, data);
  }
}
export default StudentQuiz;
