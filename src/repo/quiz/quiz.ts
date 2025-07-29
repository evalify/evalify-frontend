import axiosInstance from "@/lib/axios/axios-client";

// DTOs matching backend structure
export interface CreateQuizDTO {
  name: string;
  description?: string;
  instructions?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  durationInMinutes: number;
  fullScreen?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  linearQuiz?: boolean;
  calculator?: boolean;
  autoSubmit?: boolean;
  quizTags: string[];
  password?: string;
  courseIds: string[];
  studentIds: string[];
  labIds: string[];
  batchIds: string[];
}

export interface PatchQuizDTO {
  name?: string;
  description?: string;
  instructions?: string;
  startTime?: string;
  endTime?: string;
  durationInMinutes?: number;
  fullScreen?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  linearQuiz?: boolean;
  calculator?: boolean;
  autoSubmit?: boolean;
  publishResult?: boolean;
  publishQuiz?: boolean;
  password?: string;
  courseIds?: string[];
  batchIds?: string[];
  studentIds?: string[];
  labIds?: string[];
  quizTags?: string[];
}

export interface QuizResponse {
  quizId: string;
  message: string;
}

export interface QuizData {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  fullScreen: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  linearQuiz: boolean;
  calculator: boolean;
  autoSubmit: boolean;
  publishResult: boolean;
  publishQuiz: boolean;
  password?: string;
  courseIds: string[];
  batchIds: string[];
  studentIds: string[];
  labIds: string[];
  quizTags: string[];
  createdAt?: string;
  createdBy?: string;
}

export interface QuizUpdateResponse {
  message: string;
  quiz: QuizData;
}

class Quiz {
  static async getAllQuizzes() {
    const response = await axiosInstance.get("/api/quiz");
    return response.data;
  }

  static async getSharedQuizzes() {
    const response = await axiosInstance.get("/api/quiz/shared");
    return response.data;
  }

  static async createQuiz(quizData: CreateQuizDTO): Promise<QuizResponse> {
    const response = await axiosInstance.post("/api/quiz", quizData);
    return response.data;
  }


  static async getQuizById(quizId: string) {
    const response = await axiosInstance.get(`/api/quiz/${quizId}`);
    return response.data;
  }

  static async updateQuiz(
    quizId: string,
    quizData: PatchQuizDTO,
  ): Promise<QuizUpdateResponse> {
    const response = await axiosInstance.patch(`/api/quiz/${quizId}`, quizData);
    return response.data;
  }

  static async deleteQuiz(quizId: string): Promise<void> {
    await axiosInstance.delete(`/api/quiz/${quizId}`);
  }

  static async getQuizzesByCourseId(courseId: string) {
    const response = await axiosInstance.get(`/api/quiz/course/${courseId}`);
    return await response.data;
  }

  /**
   * Filter bank questions for adding to quiz
   * Transforms frontend filters to backend DTO format
   * "any" values become null (meaning all options)
   */
  static async filterBankQuestionsToQuiz(
    quizId: string,
    filters: QuestionFilters,
  ): Promise<BankQuestionsReturnDTO[]> {
    // Transform frontend filters to backend DTO
    const dto: AddQuestionsToQuizDTO = this.transformFiltersToDTO(filters);

    const response = await axiosInstance.post(
      `/api/quiz/${quizId}/question/filter`,
      dto,
    );

    return response.data;
  }

  /**
   * Transform frontend filter values to backend DTO
   * "any" values become null, specific values become arrays
   */
  private static transformFiltersToDTO(
    filters: QuestionFilters,
  ): AddQuestionsToQuizDTO {
    return {
      // Bank IDs - convert "any" to null, specific bank to array
      bankId: filters.bank === "any" ? null : [filters.bank],

      // Topic IDs - convert topic names to IDs
      // Note: You'll need to resolve topic names to IDs if using topic names in frontend
      // For now, assuming topic values are already IDs or can be used directly
      topicId: filters.topic === "any" ? null : [filters.topic],

      // Difficulty - convert string to enum array
      difficulty:
        filters.difficulty === "any"
          ? null
          : [this.mapDifficultyToEnum(filters.difficulty)],

      // Question Type - convert string to enum array
      questionType:
        filters.questionType === "any"
          ? null
          : [this.mapQuestionTypeToEnum(filters.questionType)],

      // Number of questions
      noOfQuestions: filters.numQuestions
        ? parseInt(filters.numQuestions)
        : null,
    };
  }

  /**
   * Transform filters with topic name resolution
   * Call this version if you need to resolve topic names to IDs
   */
  static async transformFiltersWithTopicResolution(
    filters: QuestionFilters,
    bankTopics: { id: string; name: string }[],
  ): Promise<AddQuestionsToQuizDTO> {
    // Resolve topic name to ID
    let topicIds: string[] | null = null;
    if (filters.topic !== "any") {
      const topic = bankTopics.find(
        (t) => t.name.toLowerCase() === filters.topic.toLowerCase(),
      );
      if (topic) {
        topicIds = [topic.id];
      }
    }

    return {
      bankId: filters.bank === "any" ? null : [filters.bank],
      topicId: topicIds,
      difficulty:
        filters.difficulty === "any"
          ? null
          : [this.mapDifficultyToEnum(filters.difficulty)],
      questionType:
        filters.questionType === "any"
          ? null
          : [this.mapQuestionTypeToEnum(filters.questionType)],
      noOfQuestions: filters.numQuestions
        ? parseInt(filters.numQuestions)
        : null,
    };
  }

  /**
   * Map frontend difficulty strings to backend enum
   */
  private static mapDifficultyToEnum(difficulty: string): Difficulty {
    const difficultyMap: Record<string, Difficulty> = {
      easy: Difficulty.EASY,
      medium: Difficulty.MEDIUM,
      hard: Difficulty.HARD,
    };

    return difficultyMap[difficulty.toLowerCase()] || Difficulty.MEDIUM;
  }

  /**
   * Map frontend question type strings to backend enum
   */
  private static mapQuestionTypeToEnum(questionType: string): QuestionTypes {
    const typeMap: Record<string, QuestionTypes> = {
      mcq: QuestionTypes.MCQ,
      mmcq: QuestionTypes.MMCQ,
      truefalse: QuestionTypes.TRUEFALSE,
      "true-false": QuestionTypes.TRUEFALSE,
      coding: QuestionTypes.CODING,
      fillup: QuestionTypes.FILL_UP,
      "fill-up": QuestionTypes.FILL_UP,
      descriptive: QuestionTypes.DESCRIPTIVE,
      essay: QuestionTypes.DESCRIPTIVE, // Map essay to descriptive
      "match-following": QuestionTypes.MATCH_THE_FOLLOWING,
      "file-upload": QuestionTypes.FILE_UPLOAD,
    };

    return typeMap[questionType.toLowerCase()] || QuestionTypes.MCQ;
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

  /* Quiz Questions */
  static async createQuizQuestion(quizId: string, questionData: object) {
    const response = await axiosInstance.post(
      `/api/quiz/${quizId}/question`,
      questionData,
    );
    return await response.data;
  }

  static async updateQuizQuestion(
    quizId: string,
    questionId: string,
    questionData: object,
  ) {
    const response = await axiosInstance.patch(
      `/api/quiz/${quizId}/question/${questionId}`,
      questionData,
    );
    return await response.data;
  }

  static async deleteQuizQuestion(quizId: string, questionId: string) {
    const response = await axiosInstance.delete(
      `/api/quiz/${quizId}/question/${questionId}`,
    );
    return await response.data;
  }

  static async getQuizQuestionById(quizId: string, questionId: string) {
    const response = await axiosInstance.get(
      `/api/quiz/${quizId}/questions/${questionId}`,
    );
    return await response.data;
  }

  static async shareQuiz(quizId: string, userIds: string[]) {
    const response = await axiosInstance.post(`/api/quiz/${quizId}/share`, {
      userID: userIds,
    });
    return response.data;
  }

  static async unshareQuiz(quizId: string, userIds: string[]) {
    const response = await axiosInstance.delete(`/api/quiz/${quizId}/share`, {
      data: { userID: userIds },
    });
    return response.data;
  }

  static async getQuizUsers(quizId: string) {
    const response = await axiosInstance.get(`/api/quiz/${quizId}/share`);
    return response.data;
  }
}
export default Quiz;
