/**
 * State management classes for quiz functionality
 * Handles local storage, navigation, timing, and event logging
 */

import {
  IQuizStateManager,
  IQuizNavigationManager,
  IQuestionTimeManager,
  IQuizLogger,
  QuizEvent,
  QuizEventType,
} from "../interfaces/quiz-interfaces";
import {
  QuizAnswerData,
  QuizLocalStorage,
  QuizResponse,
  QuestionTimeTracker,
  QuizInterface,
} from "../types/quiz-types";

/**
 * Quiz state manager for handling answers and local storage
 */
export class QuizStateManager implements IQuizStateManager {
  private quizId: string;
  private responses: Map<string, QuizResponse> = new Map();
  private storageKey: string;

  constructor(quizId: string) {
    this.quizId = quizId;
    this.storageKey = `evalify_quiz_${quizId}`;
    this.loadFromLocalStorage();
  }

  getCurrentAnswer(questionId: string): QuizAnswerData | null {
    const response = this.responses.get(questionId);
    return response ? response.answer : null;
  }

  setAnswer(questionId: string, answer: QuizAnswerData): void {
    const existingResponse = this.responses.get(questionId);
    const now = new Date();

    const response: QuizResponse = {
      questionId,
      answer,
      timeSpent: existingResponse ? existingResponse.timeSpent : 0,
      lastUpdated: now,
    };

    this.responses.set(questionId, response);
    this.saveToLocalStorage();

    // Log the answer change
    QuizLogger.getInstance().log({
      type: QuizEventType.ANSWER_CHANGED,
      timestamp: now,
      quizId: this.quizId,
      questionId,
      data: { answer },
    });
  }

  clearAnswer(questionId: string): void {
    this.responses.delete(questionId);
    this.saveToLocalStorage();
  }

  hasAnswer(questionId: string): boolean {
    return this.responses.has(questionId);
  }

  getAllAnswers(): Record<string, QuizAnswerData> {
    const answers: Record<string, QuizAnswerData> = {};
    this.responses.forEach((response, questionId) => {
      answers[questionId] = response.answer;
    });
    return answers;
  }

  saveToLocalStorage(): void {
    try {
      const storageData: QuizLocalStorage = {
        quizId: this.quizId,
        responses: this.mapToObject(this.responses),
        currentQuestionIndex: 0, // Will be updated by navigation manager
        totalTimeSpent: 0, // Will be updated by time manager
        startTime: new Date(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(storageData));
    } catch (error) {
      console.error("Failed to save quiz state to localStorage:", error);
    }
  }

  loadFromLocalStorage(): void {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData: QuizLocalStorage = JSON.parse(storedData);
        this.responses = this.objectToMap(parsedData.responses);
      }
    } catch (error) {
      console.error("Failed to load quiz state from localStorage:", error);
      this.responses.clear();
    }
  }

  clearLocalStorage(): void {
    try {
      localStorage.removeItem(this.storageKey);
      this.responses.clear();
    } catch (error) {
      console.error("Failed to clear quiz state from localStorage:", error);
    }
  }

  private mapToObject(
    map: Map<string, QuizResponse>,
  ): Record<string, QuizResponse> {
    const obj: Record<string, QuizResponse> = {};
    map.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  private objectToMap(
    obj: Record<string, QuizResponse>,
  ): Map<string, QuizResponse> {
    const map = new Map<string, QuizResponse>();
    Object.entries(obj).forEach(([key, value]) => {
      map.set(key, value);
    });
    return map;
  }

  updateQuestionTime(questionId: string, timeSpent: number): void {
    const response = this.responses.get(questionId);
    if (response) {
      response.timeSpent = timeSpent;
      this.responses.set(questionId, response);
      this.saveToLocalStorage();
    }
  }
}

/**
 * Quiz navigation manager for handling question navigation
 */
export class QuizNavigationManager implements IQuizNavigationManager {
  currentQuestionIndex: number = 0;
  totalQuestions: number;
  isLinearQuiz: boolean;
  private quizId: string;

  constructor(quizData: QuizInterface) {
    this.totalQuestions = quizData.questions.length;
    this.isLinearQuiz = quizData.quizInfo.linearQuiz;
    this.quizId = quizData.quizInfo.quizId;
  }

  canNavigateBack(): boolean {
    if (this.isLinearQuiz) return false;
    return this.currentQuestionIndex > 0;
  }

  canNavigateForward(): boolean {
    return this.currentQuestionIndex < this.totalQuestions - 1;
  }

  goToNext(): boolean {
    if (this.canNavigateForward()) {
      this.currentQuestionIndex++;
      this.logNavigation("next");
      return true;
    }
    return false;
  }

  goToPrevious(): boolean {
    if (this.canNavigateBack()) {
      this.currentQuestionIndex--;
      this.logNavigation("previous");
      return true;
    }
    return false;
  }

  goToQuestion(index: number): boolean {
    if (this.isLinearQuiz && index !== this.currentQuestionIndex + 1) {
      return false; // In linear quiz, can only go to next question
    }

    if (index >= 0 && index < this.totalQuestions) {
      this.currentQuestionIndex = index;
      this.logNavigation("direct", index);
      return true;
    }
    return false;
  }

  getNavigationState() {
    return {
      current: this.currentQuestionIndex,
      total: this.totalQuestions,
      canBack: this.canNavigateBack(),
      canForward: this.canNavigateForward(),
    };
  }

  private logNavigation(type: string, targetIndex?: number): void {
    QuizLogger.getInstance().log({
      type: QuizEventType.QUESTION_NAVIGATED,
      timestamp: new Date(),
      quizId: this.quizId,
      data: {
        type,
        from: this.currentQuestionIndex,
        to: targetIndex ?? this.currentQuestionIndex,
      },
    });
  }
}

/**
 * Question time manager for tracking time spent on each question
 */
export class QuestionTimeManager implements IQuestionTimeManager {
  private trackers: Map<string, QuestionTimeTracker> = new Map();

  startTracking(questionId: string): void {
    const tracker: QuestionTimeTracker = {
      questionId,
      startTime: new Date(),
      timeSpent: 0,
      isActive: true,
    };
    this.trackers.set(questionId, tracker);
  }

  stopTracking(questionId: string): number {
    const tracker = this.trackers.get(questionId);
    if (tracker && tracker.isActive) {
      const now = new Date();
      const sessionTime = now.getTime() - tracker.startTime.getTime();
      tracker.timeSpent += sessionTime;
      tracker.isActive = false;
      return tracker.timeSpent;
    }
    return 0;
  }

  getCurrentTimeSpent(questionId: string): number {
    const tracker = this.trackers.get(questionId);
    if (!tracker) return 0;

    let totalTime = tracker.timeSpent;
    if (tracker.isActive) {
      const now = new Date();
      const currentSessionTime = now.getTime() - tracker.startTime.getTime();
      totalTime += currentSessionTime;
    }
    return totalTime;
  }

  getTracker(questionId: string): QuestionTimeTracker | null {
    return this.trackers.get(questionId) || null;
  }

  reset(): void {
    this.trackers.clear();
  }
}

/**
 * Quiz event logger for monitoring and debugging
 */
export class QuizLogger implements IQuizLogger {
  private static instance: QuizLogger;
  private events: QuizEvent[] = [];
  private maxEvents: number = 1000; // Limit to prevent memory issues

  private constructor() {}

  static getInstance(): QuizLogger {
    if (!QuizLogger.instance) {
      QuizLogger.instance = new QuizLogger();
    }
    return QuizLogger.instance;
  }

  log(event: QuizEvent): void {
    this.events.push(event);

    // Limit the number of events stored
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Console log important events in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Quiz Event] ${event.type}:`, event);
    }
  }

  getEvents(): QuizEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }

  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  getEventsByType(type: QuizEventType): QuizEvent[] {
    return this.events.filter((event) => event.type === type);
  }

  getEventsForQuestion(questionId: string): QuizEvent[] {
    return this.events.filter((event) => event.questionId === questionId);
  }
}
