/**
 * Custom hook for handling quiz answer updates with proper typing
 * Provides type-safe methods for updating different question types
 */

import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import StudentQuiz, {
    QuizAnswerUpdate,
    FillUpAnswer,
    MatchAnswer,
} from "@/repo/student/quiz/student-quiz";
import { useToast } from "@/hooks/use-toast";
import { QuizAnswerData } from "../types/quiz-types";

interface UseQuizAnswerUpdateProps {
    quizId: string;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

interface UpdateAnswerParams {
    questionId: string;
    questionType: string;
    duration: number;
}

export const useQuizAnswerUpdate = ({
    quizId,
    onSuccess,
    onError,
}: UseQuizAnswerUpdateProps) => {
    const { error: showError } = useToast();

    // Main mutation for updating quiz answers
    const updateMutation = useMutation({
        mutationFn: (data: QuizAnswerUpdate) => StudentQuiz.updateQuiz(quizId, data),
        onSuccess: () => {
            onSuccess?.();
        },
        onError: (error) => {
            console.error("Failed to update quiz answer:", error);
            showError("Failed to save your answer. Please try again.");
            onError?.(error);
        },
    });

    // Type-safe update methods for different question types

    /**
     * Update string-based answers (Descriptive, Coding, File Upload)
     */
    const updateStringAnswer = useCallback(
        (params: UpdateAnswerParams, answer: string) => {
            const data = createTypedAnswerUpdate(
                params.questionId,
                answer,
                params.duration,
                params.questionType
            );
            updateMutation.mutate(data);
        },
        [updateMutation]
    );

    /**
     * Update boolean answers (True/False)
     */
    const updateBooleanAnswer = useCallback(
        (params: UpdateAnswerParams, answer: boolean) => {
            const data = createTypedAnswerUpdate(
                params.questionId,
                answer,
                params.duration,
                params.questionType
            );
            updateMutation.mutate(data);
        },
        [updateMutation]
    );

    /**
     * Update single choice answers (MCQ)
     */
    const updateSingleChoiceAnswer = useCallback(
        (params: UpdateAnswerParams, selectedOptionId: string) => {
            const data = createTypedAnswerUpdate(
                params.questionId,
                selectedOptionId,
                params.duration,
                params.questionType
            );
            updateMutation.mutate(data);
        },
        [updateMutation]
    );

    /**
     * Update multiple choice answers (MMCQ)
     */
    const updateMultipleChoiceAnswer = useCallback(
        (params: UpdateAnswerParams, selectedOptionIds: string[]) => {
            const data = createTypedAnswerUpdate(
                params.questionId,
                selectedOptionIds,
                params.duration,
                params.questionType
            );
            updateMutation.mutate(data);
        },
        [updateMutation]
    );

    /**
     * Update fill-up answers
     */
    const updateFillUpAnswer = useCallback(
        (params: UpdateAnswerParams, answers: FillUpAnswer[]) => {
            const data = createTypedAnswerUpdate(
                params.questionId,
                answers,
                params.duration,
                params.questionType
            );
            updateMutation.mutate(data);
        },
        [updateMutation]
    );

    /**
     * Update match-the-following answers
     */
    const updateMatchAnswer = useCallback(
        (params: UpdateAnswerParams, matches: MatchAnswer[]) => {
            const data = createTypedAnswerUpdate(
                params.questionId,
                matches,
                params.duration,
                params.questionType
            );
            updateMutation.mutate(data);
        },
        [updateMutation]
    );

    /**
     * Generic update method that automatically determines the correct format
     */
    const updateAnswer = useCallback(
        (params: UpdateAnswerParams, answer: QuizAnswerData) => {
            const data = createTypedAnswerUpdate(
                params.questionId,
                answer,
                params.duration,
                params.questionType
            );
            updateMutation.mutate(data);
        },
        [updateMutation]
    );

    return {
        // Mutation state
        isUpdating: updateMutation.isPending,
        error: updateMutation.error,
        isError: updateMutation.isError,
        isSuccess: updateMutation.isSuccess,

        // Type-safe update methods
        updateStringAnswer,
        updateBooleanAnswer,
        updateSingleChoiceAnswer,
        updateMultipleChoiceAnswer,
        updateFillUpAnswer,
        updateMatchAnswer,
        updateAnswer,

        // Reset mutation state
        reset: updateMutation.reset,
    };
};