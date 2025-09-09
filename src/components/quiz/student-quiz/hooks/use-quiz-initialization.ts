/**
 * Custom hook for handling quiz initialization with existing responses
 * Provides utilities for managing quiz state restoration and response processing
 */

import { useCallback, useMemo } from "react";
import { QuizInterface } from "../types/quiz-types";
import {
    processQuizStartResponses,
    createResponseSummary,
} from "../utils/response-utils";

interface UseQuizInitializationProps {
    quizData: QuizInterface;
}

interface QuizInitializationState {
    hasExistingResponses: boolean;
    existingResponsesCount: number;
    totalTimeSpent: number;
    resumeFromQuestion: number;
    responsesByType: Record<string, number>;
}

export const useQuizInitialization = ({ quizData }: UseQuizInitializationProps) => {
    // Memoize quiz data to prevent unnecessary recalculations
    const stableQuizData = useMemo(() => quizData, [quizData]);

    // Process existing responses from quiz data
    const existingResponses = useMemo(() => {
        return processQuizStartResponses(stableQuizData);
    }, [stableQuizData]);

    // Create summary of existing responses
    const responseSummary = useMemo(() => {
        return createResponseSummary(existingResponses);
    }, [existingResponses]);

    // Get initialization state
    const initializationState: QuizInitializationState = useMemo(() => {
        const hasExisting = existingResponses.size > 0;

        // Find the first unanswered question to resume from
        let resumeIndex = 0;
        if (hasExisting) {
            for (let i = 0; i < quizData.questions.length; i++) {
                const questionId = quizData.questions[i].question.questions.questionId;
                if (!existingResponses.has(questionId)) {
                    resumeIndex = i;
                    break;
                }
            }
        }

        return {
            hasExistingResponses: hasExisting,
            existingResponsesCount: existingResponses.size,
            totalTimeSpent: responseSummary.totalTimeSpent,
            resumeFromQuestion: resumeIndex,
            responsesByType: responseSummary.questionTypes,
        };
    }, [existingResponses, responseSummary, quizData.questions]);

    // Get responses for a specific question
    const getResponseForQuestion = useCallback((questionId: string) => {
        return existingResponses.get(questionId) || null;
    }, [existingResponses]);

    // Check if a specific question has an existing response
    const hasResponseForQuestion = useCallback((questionId: string) => {
        return existingResponses.has(questionId);
    }, [existingResponses]);

    // Get all question IDs that have responses
    const getAnsweredQuestionIds = useCallback(() => {
        return Array.from(existingResponses.keys());
    }, [existingResponses]);

    // Get all question IDs that don't have responses
    const getUnansweredQuestionIds = useCallback(() => {
        const answeredIds = new Set(existingResponses.keys());
        return quizData.questions
            .map(q => q.question.questions.questionId)
            .filter(id => !answeredIds.has(id));
    }, [existingResponses, quizData.questions]);

    // Calculate progress percentage
    const getProgressPercentage = useCallback(() => {
        const totalQuestions = quizData.questions.length;
        const answeredQuestions = existingResponses.size;
        return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    }, [existingResponses.size, quizData.questions.length]);

    // Get detailed response information for debugging
    const getDetailedResponseInfo = useCallback(() => {
        const details: Array<{
            questionId: string;
            questionType: string;
            hasResponse: boolean;
            answerType: string | null;
            timeSpent: number;
        }> = [];

        stableQuizData.questions.forEach((questionItem) => {
            const questionId = questionItem.question.questions.questionId;
            const questionType = questionItem.question.type;
            const response = existingResponses.get(questionId);

            details.push({
                questionId,
                questionType,
                hasResponse: !!response,
                answerType: response ? typeof response.answer : null,
                timeSpent: response?.timeSpent || 0,
            });
        });

        return details;
    }, [stableQuizData.questions, existingResponses]);

    // Create restoration summary for logging
    const getRestorationSummary = useCallback(() => {
        return {
            quizId: stableQuizData.quizInfo.quizId,
            quizName: stableQuizData.quizInfo.quizName,
            totalQuestions: stableQuizData.questions.length,
            existingResponses: existingResponses.size,
            progressPercentage: getProgressPercentage(),
            totalTimeSpent: responseSummary.totalTimeSpent,
            resumeFromQuestion: initializationState.resumeFromQuestion,
            responseTypes: responseSummary.questionTypes,
            detailedInfo: getDetailedResponseInfo(),
        };
    }, [
        stableQuizData,
        existingResponses.size,
        responseSummary,
        initializationState.resumeFromQuestion,
        getProgressPercentage,
        getDetailedResponseInfo,
    ]);

    return {
        // State information
        initializationState,
        responseSummary,

        // Response data
        existingResponses,

        // Utility functions
        getResponseForQuestion,
        hasResponseForQuestion,
        getAnsweredQuestionIds,
        getUnansweredQuestionIds,
        getProgressPercentage,
        getDetailedResponseInfo,
        getRestorationSummary,

        // Helper functions for UI
        isQuizResumed: initializationState.hasExistingResponses,
        shouldShowResumeBanner: initializationState.hasExistingResponses && initializationState.existingResponsesCount > 0,
        canResumeFromSpecificQuestion: initializationState.resumeFromQuestion > 0,
    };
};