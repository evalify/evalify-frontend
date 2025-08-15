/**
 * Quiz Context Provider - Main orchestrator for student quiz functionality
 * Integrates all managers, handlers, and state management
 */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import StudentQuiz from "@/repo/student/quiz/student-quiz";
import {
  QuizInterface,
  QuizAnswerData,
  QuizAnswerUpdate,
  QuizNavigationState,
  SectionNavigation,
  QuestionNavigation,
} from "./types/quiz-types";
import {
  QuizStateManager,
  QuizNavigationManager,
  QuestionTimeManager,
  QuizLogger,
} from "./managers/state-managers";
import {
  useFullScreenTracking,
  ViolationLog,
} from "./hooks/use-fullscreen-tracking";
import { QuizEventType } from "./interfaces/quiz-interfaces";

interface QuizContextType {
  // Quiz data
  quizData: QuizInterface | null;
  isLoading: boolean;
  error: string | null;

  // Navigation
  currentQuestionIndex: number;
  currentQuestionId: string;
  totalQuestions: number;
  canNavigateBack: boolean;
  canNavigateForward: boolean;
  goToNext: () => boolean;
  goToPrevious: () => boolean;
  goToQuestion: (index: number) => boolean;
  goToQuestionById: (questionId: string) => boolean;

  // Navigation state
  navigationState: QuizNavigationState;
  markForReview: (questionId: string) => void;
  unmarkForReview: (questionId: string) => void;
  toggleReviewMark: (questionId: string) => void;

  // Answers
  getCurrentAnswer: (questionId: string) => QuizAnswerData | null;
  setAnswer: (questionId: string, answer: QuizAnswerData) => void;
  hasAnswer: (questionId: string) => boolean;

  // Quiz actions
  submitQuiz: () => Promise<void>;
  isSubmitting: boolean;

  // Time tracking
  getCurrentTimeSpent: (questionId: string) => number;
  getTotalTimeSpent: () => number;
  getTimeRemaining: () => number;

  // Fullscreen & violations
  isFullScreen: boolean;
  violations: ViolationLog[];
  violationCount: number;
  clearViolations: () => void;
  requestFullScreen: () => Promise<void>;

  // User info
  userInfo: {
    name: string;
    profileId: string;
    image?: string;
  } | null;
}

const QuizContext = createContext<QuizContextType | null>(null);

interface QuizProviderProps {
  children: React.ReactNode;
  quizData: QuizInterface;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({
  children,
  quizData,
}) => {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reviewedQuestions, setReviewedQuestions] = useState<Set<string>>(
    new Set(),
  );

  // Initialize managers
  const [stateManager] = useState(
    () => new QuizStateManager(quizData.quizInfo.quizId),
  );
  const [navigationManager] = useState(
    () => new QuizNavigationManager(quizData),
  );
  const [timeManager] = useState(() => new QuestionTimeManager());

  // Create navigation state
  const createNavigationState = useCallback((): QuizNavigationState => {
    const sections: SectionNavigation[] = [];
    const sectionMap = new Map<string, SectionNavigation>();

    // Group questions by section
    quizData.questions.forEach((questionWrapper, index) => {
      const { questions: question, section } = questionWrapper.question;
      const questionType = questionWrapper.question.type;
      const sectionId = section.id;

      if (!sectionMap.has(sectionId)) {
        const newSection: SectionNavigation = {
          sectionId: section.id,
          sectionName: section.name,
          questions: [],
          totalQuestions: 0,
          answeredQuestions: 0,
          reviewedQuestions: 0,
        };
        sectionMap.set(sectionId, newSection);
        sections.push(newSection);
      }

      const sectionNav = sectionMap.get(sectionId)!;
      const questionId = question.questionId;
      const hasAnswer = stateManager.hasAnswer(questionId);
      const isMarkedForReview = reviewedQuestions.has(questionId);

      const questionNav: QuestionNavigation = {
        questionId,
        questionNumber: index + 1,
        questionType,
        sectionId,
        marks: question.marks,
        status: {
          questionId,
          isAnswered: hasAnswer,
          isReviewed: false,
          isMarkedForReview,
          hasValidAnswer: hasAnswer,
        },
      };

      sectionNav.questions.push(questionNav);
      sectionNav.totalQuestions++;
      if (hasAnswer) sectionNav.answeredQuestions++;
      if (isMarkedForReview) sectionNav.reviewedQuestions++;
    });

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const totalAnswered = quizData.questions.reduce(
      (count, q) =>
        count +
        (stateManager.hasAnswer(q.question.questions.questionId) ? 1 : 0),
      0,
    );

    return {
      sections,
      currentQuestionId: currentQuestion?.question.questions.questionId || "",
      currentSectionId: currentQuestion?.question.section.id || "",
      totalQuestions: quizData.questions.length,
      answeredQuestions: totalAnswered,
      reviewedQuestions: 0,
      markedForReview: reviewedQuestions.size,
    };
  }, [quizData, currentQuestionIndex, stateManager, reviewedQuestions]);

  const [navigationState, setNavigationState] = useState<QuizNavigationState>(
    createNavigationState,
  );

  // Update navigation state when dependencies change
  useEffect(() => {
    setNavigationState(createNavigationState());
  }, [createNavigationState]);

  // Current question ID helper
  const currentQuestionId =
    quizData.questions[currentQuestionIndex]?.question.questions.questionId ||
    "";

  // Fullscreen tracking with violation monitoring
  const {
    isFullScreen,
    violations: violationLogs,
    violationCount,
    clearViolations,
    requestFullScreen,
  } = useFullScreenTracking(
    quizData.quizInfo.fullScreen,
    quizData.quizInfo.quizId,
  );

  // Quiz submission mutation
  const submitMutation = useMutation({
    mutationFn: () => StudentQuiz.submitQuiz(quizData.quizInfo.quizId),
    onSuccess: () => {
      QuizLogger.getInstance().log({
        type: QuizEventType.QUIZ_SUBMITTED,
        timestamp: new Date(),
        quizId: quizData.quizInfo.quizId,
        userId: session?.user?.id,
      });
      // Clear local storage after successful submission
      stateManager.clearLocalStorage();
    },
    onError: (error) => {
      setError(`Failed to submit quiz: ${error}`);
    },
  });

  // Auto-save mutation for quiz updates
  const updateMutation = useMutation({
    mutationFn: (data: QuizAnswerUpdate) =>
      StudentQuiz.updateQuiz(quizData.quizInfo.quizId, data),
    onSuccess: () => {
      QuizLogger.getInstance().log({
        type: QuizEventType.AUTO_SAVE,
        timestamp: new Date(),
        quizId: quizData.quizInfo.quizId,
      });
    },
    onError: (error) => {
      console.error("Failed to auto-save quiz answer:", error);
    },
  });

  // Initialize quiz logging
  useEffect(() => {
    QuizLogger.getInstance().log({
      type: QuizEventType.QUIZ_STARTED,
      timestamp: new Date(),
      quizId: quizData.quizInfo.quizId,
      userId: session?.user?.id,
      data: {
        quizName: quizData.quizInfo.quizName,
        totalQuestions: quizData.questions.length,
      },
    });

    // Start tracking time for first question
    if (quizData.questions.length > 0) {
      const firstQuestionId =
        quizData.questions[0].question.questions.questionId;
      timeManager.startTracking(firstQuestionId);
    }
  }, [quizData, session?.user?.id, timeManager]);

  // Auto-submit functionality
  useEffect(() => {
    if (!quizData.quizInfo.autoSubmit) return;

    const endTime = new Date(quizData.quizStudentInfo.endTime);
    const now = new Date();
    const timeUntilEnd = endTime.getTime() - now.getTime();

    if (timeUntilEnd > 0) {
      const autoSubmitTimer = setTimeout(() => {
        submitMutation.mutate();
      }, timeUntilEnd);

      return () => clearTimeout(autoSubmitTimer);
    }
  }, [
    quizData.quizInfo.autoSubmit,
    quizData.quizStudentInfo.endTime,
    submitMutation,
  ]);

  // Navigation functions
  const goToNext = useCallback(() => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (currentQuestion) {
      const timeSpent = timeManager.stopTracking(
        currentQuestion.question.questions.questionId,
      );
      stateManager.updateQuestionTime(
        currentQuestion.question.questions.questionId,
        timeSpent,
      );
    }

    const success = navigationManager.goToNext();
    if (success) {
      setCurrentQuestionIndex(navigationManager.currentQuestionIndex);

      // Start tracking time for new question
      const newQuestion =
        quizData.questions[navigationManager.currentQuestionIndex];
      if (newQuestion) {
        timeManager.startTracking(newQuestion.question.questions.questionId);

        QuizLogger.getInstance().log({
          type: QuizEventType.QUESTION_VIEWED,
          timestamp: new Date(),
          quizId: quizData.quizInfo.quizId,
          questionId: newQuestion.question.questions.questionId,
        });
      }
    }
    return success;
  }, [
    currentQuestionIndex,
    quizData,
    navigationManager,
    timeManager,
    stateManager,
  ]);

  const goToPrevious = useCallback(() => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (currentQuestion) {
      const timeSpent = timeManager.stopTracking(
        currentQuestion.question.questions.questionId,
      );
      stateManager.updateQuestionTime(
        currentQuestion.question.questions.questionId,
        timeSpent,
      );
    }

    const success = navigationManager.goToPrevious();
    if (success) {
      setCurrentQuestionIndex(navigationManager.currentQuestionIndex);

      // Start tracking time for new question
      const newQuestion =
        quizData.questions[navigationManager.currentQuestionIndex];
      if (newQuestion) {
        timeManager.startTracking(newQuestion.question.questions.questionId);

        QuizLogger.getInstance().log({
          type: QuizEventType.QUESTION_VIEWED,
          timestamp: new Date(),
          quizId: quizData.quizInfo.quizId,
          questionId: newQuestion.question.questions.questionId,
        });
      }
    }
    return success;
  }, [
    currentQuestionIndex,
    quizData,
    navigationManager,
    timeManager,
    stateManager,
  ]);

  const goToQuestion = useCallback(
    (index: number) => {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      if (currentQuestion) {
        const timeSpent = timeManager.stopTracking(
          currentQuestion.question.questions.questionId,
        );
        stateManager.updateQuestionTime(
          currentQuestion.question.questions.questionId,
          timeSpent,
        );
      }

      const success = navigationManager.goToQuestion(index);
      if (success) {
        setCurrentQuestionIndex(navigationManager.currentQuestionIndex);

        // Start tracking time for new question
        const newQuestion =
          quizData.questions[navigationManager.currentQuestionIndex];
        if (newQuestion) {
          timeManager.startTracking(newQuestion.question.questions.questionId);

          QuizLogger.getInstance().log({
            type: QuizEventType.QUESTION_VIEWED,
            timestamp: new Date(),
            quizId: quizData.quizInfo.quizId,
            questionId: newQuestion.question.questions.questionId,
          });
        }
      }
      return success;
    },
    [
      currentQuestionIndex,
      quizData,
      navigationManager,
      timeManager,
      stateManager,
    ],
  );

  // Navigate to question by ID
  const goToQuestionById = useCallback(
    (questionId: string) => {
      const questionIndex = quizData.questions.findIndex(
        (q) => q.question.questions.questionId === questionId,
      );
      if (questionIndex !== -1) {
        return goToQuestion(questionIndex);
      }
      return false;
    },
    [quizData.questions, goToQuestion],
  );

  // Review management
  const markForReview = useCallback((questionId: string) => {
    setReviewedQuestions((prev) => new Set([...prev, questionId]));
  }, []);

  const unmarkForReview = useCallback((questionId: string) => {
    setReviewedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  }, []);

  const toggleReviewMark = useCallback((questionId: string) => {
    setReviewedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  // Answer management
  const setAnswer = useCallback(
    (questionId: string, answer: QuizAnswerData) => {
      stateManager.setAnswer(questionId, answer);

      // Auto-save the answer
      const timeSpent = timeManager.getCurrentTimeSpent(questionId);
      const updateData: QuizAnswerUpdate = {
        questionId,
        duration: timeSpent,
        answer,
      };

      updateMutation.mutate(updateData);
    },
    [stateManager, timeManager, updateMutation],
  );

  const getCurrentAnswer = useCallback(
    (questionId: string) => {
      return stateManager.getCurrentAnswer(questionId);
    },
    [stateManager],
  );

  const hasAnswer = useCallback(
    (questionId: string) => {
      return stateManager.hasAnswer(questionId);
    },
    [stateManager],
  );

  // Time calculations
  const getCurrentTimeSpent = useCallback(
    (questionId: string) => {
      return timeManager.getCurrentTimeSpent(questionId);
    },
    [timeManager],
  );

  const getTotalTimeSpent = useCallback(() => {
    const startTime = new Date(quizData.quizStudentInfo.startTime);
    const now = new Date();
    return now.getTime() - startTime.getTime();
  }, [quizData.quizStudentInfo.startTime]);

  const getTimeRemaining = useCallback(() => {
    const endTime = new Date(quizData.quizStudentInfo.endTime);
    const now = new Date();
    return Math.max(0, endTime.getTime() - now.getTime());
  }, [quizData.quizStudentInfo.endTime]);

  // User info
  const userInfo = session?.user
    ? {
        name: session.user.name || "",
        profileId: session.user.email || "",
        image: session.user.image || undefined,
      }
    : null;

  const contextValue: QuizContextType = {
    quizData,
    isLoading: false,
    error,
    currentQuestionIndex,
    currentQuestionId,
    totalQuestions: quizData.questions.length,
    canNavigateBack: navigationManager.canNavigateBack(),
    canNavigateForward: navigationManager.canNavigateForward(),
    goToNext,
    goToPrevious,
    goToQuestion,
    goToQuestionById,
    navigationState,
    markForReview,
    unmarkForReview,
    toggleReviewMark,
    getCurrentAnswer,
    setAnswer,
    hasAnswer,
    submitQuiz: () => submitMutation.mutateAsync(),
    isSubmitting: submitMutation.isPending,
    getCurrentTimeSpent,
    getTotalTimeSpent,
    getTimeRemaining,
    isFullScreen,
    violations: violationLogs,
    violationCount,
    clearViolations,
    requestFullScreen,
    userInfo,
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
