/**
 * Abstract interfaces and base classes for question rendering and handling
 * This provides a modular architecture for different question types
 */

import {
  QuizAnswerData,
  QuestionTimeTracker,
  Question,
  BlankId,
  MatchKeyValues,
} from "../types/quiz-types";
import React from "react";

/**
 * Interface for question renderer components
 */
export interface IQuestionRenderer {
  questionId: string;
  questionData: Question;
  currentAnswer: QuizAnswerData | null;
  onAnswerChange: (answer: QuizAnswerData) => void;
  isReadOnly?: boolean;
  className?: string;
}

/**
 * Interface for question handlers - manages business logic
 */
export interface IQuestionHandler {
  questionType: string;
  validate(answer: QuizAnswerData): boolean;
  formatAnswer(answer: QuizAnswerData): QuizAnswerData;
  getEmptyAnswer(): QuizAnswerData;
  isAnswerEmpty(answer: QuizAnswerData): boolean;
}

/**
 * Abstract base class for question handlers
 */
export abstract class BaseQuestionHandler implements IQuestionHandler {
  abstract questionType: string;

  abstract validate(answer: QuizAnswerData): boolean;
  abstract formatAnswer(answer: QuizAnswerData): QuizAnswerData;
  abstract getEmptyAnswer(): QuizAnswerData;
  abstract isAnswerEmpty(answer: QuizAnswerData): boolean;

  /**
   * Common validation helper
   */
  protected isValidString(value: unknown): boolean {
    return typeof value === "string" && value.trim().length > 0;
  }

  /**
   * Common validation for array answers
   */
  protected isValidArray(value: unknown): boolean {
    return Array.isArray(value) && value.length > 0;
  }

  /**
   * Common validation for boolean answers
   */
  protected isValidBoolean(value: unknown): boolean {
    return typeof value === "boolean";
  }
}

/**
 * Interface for question time management
 */
export interface IQuestionTimeManager {
  startTracking(questionId: string): void;
  stopTracking(questionId: string): number; // Returns time spent in milliseconds
  getCurrentTimeSpent(questionId: string): number;
  getTracker(questionId: string): QuestionTimeTracker | null;
  reset(): void;
}

/**
 * Interface for quiz state management
 */
export interface IQuizStateManager {
  getCurrentAnswer(questionId: string): QuizAnswerData | null;
  setAnswer(questionId: string, answer: QuizAnswerData): void;
  clearAnswer(questionId: string): void;
  hasAnswer(questionId: string): boolean;
  getAllAnswers(): Record<string, QuizAnswerData>;
  saveToLocalStorage(): void;
  loadFromLocalStorage(): void;
  clearLocalStorage(): void;
}

/**
 * Interface for quiz navigation
 */
export interface IQuizNavigationManager {
  currentQuestionIndex: number;
  totalQuestions: number;
  isLinearQuiz: boolean;
  canNavigateBack(): boolean;
  canNavigateForward(): boolean;
  goToNext(): boolean;
  goToPrevious(): boolean;
  goToQuestion(index: number): boolean;
  getNavigationState(): {
    current: number;
    total: number;
    canBack: boolean;
    canForward: boolean;
  };
}

/**
 * Quiz event types for logging and monitoring
 */
export enum QuizEventType {
  QUIZ_STARTED = "quiz_started",
  QUESTION_VIEWED = "question_viewed",
  ANSWER_CHANGED = "answer_changed",
  QUESTION_NAVIGATED = "question_navigated",
  QUIZ_SUBMITTED = "quiz_submitted",
  FULLSCREEN_ENTERED = "fullscreen_entered",
  FULLSCREEN_EXITED = "fullscreen_exited",
  VIOLATION_DETECTED = "violation_detected",
  AUTO_SAVE = "auto_save",
  MANUAL_SAVE = "manual_save",
}

/**
 * Quiz event data structure
 */
export interface QuizEvent {
  type: QuizEventType;
  timestamp: Date;
  quizId: string;
  questionId?: string;
  data?: Record<string, unknown>;
  userId?: string;
}

/**
 * Interface for quiz event logging
 */
export interface IQuizLogger {
  log(event: QuizEvent): void;
  getEvents(): QuizEvent[];
  clearEvents(): void;
  exportEvents(): string;
}

/**
 * Factory pattern interface for creating question renderers
 */
export interface IQuestionRendererFactory {
  createRenderer(
    questionType: string,
    props: IQuestionRenderer,
  ): React.ComponentType<IQuestionRenderer> | null;
  registerRenderer(
    questionType: string,
    component: React.ComponentType<IQuestionRenderer>,
  ): void;
  getSupportedTypes(): string[];
}

/**
 * Factory pattern interface for creating question handlers
 */
export interface IQuestionHandlerFactory {
  createHandler(
    questionType: string,
    data?: BlankId[] | MatchKeyValues,
  ): IQuestionHandler | null;
  registerHandler(questionType: string, handler: IQuestionHandler): void;
  getSupportedTypes(): string[];
}
