import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Quiz from "./quiz";
import { BankQuestionDTO } from "@/repo/question-queries/questions";

/**
 * Hook to fetch a specific quiz question by ID for editing
 * This uses a different endpoint than the bank question endpoint
 * specifically for quiz questions that need to be edited
 */
export const useGetQuizQuestionById = (quizId: string, questionId: string) => {
  return useQuery<BankQuestionDTO>({
    queryKey: ["quizQuestion", quizId, questionId],
    queryFn: () => Quiz.getQuizQuestionById(quizId, questionId),
    enabled: !!quizId && !!questionId,
  });
};

/**
 * Hook to fetch all questions for a quiz
 */
export const useGetQuizQuestions = (quizId: string) => {
  return useQuery({
    queryKey: ["quizQuestions", quizId],
    queryFn: () => Quiz.getQuizQuestions(quizId),
    enabled: !!quizId,
  });
};

/**
 * Hook to create a new quiz question
 */
export const useCreateQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionData,
    }: {
      quizId: string;
      questionData: object;
    }) => Quiz.createQuizQuestion(quizId, questionData),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ["quizQuestions", quizId] });
    },
  });
};

/**
 * Hook to update a quiz question
 */
export const useUpdateQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionId,
      questionData,
    }: {
      quizId: string;
      questionId: string;
      questionData: object;
    }) => Quiz.updateQuizQuestion(quizId, questionId, questionData),
    onSuccess: (_, { quizId, questionId }) => {
      queryClient.invalidateQueries({ queryKey: ["quizQuestions", quizId] });
      queryClient.invalidateQueries({
        queryKey: ["quizQuestion", quizId, questionId],
      });
    },
  });
};

/**
 * Hook to delete a quiz question
 */
export const useDeleteQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      questionId,
    }: {
      quizId: string;
      questionId: string;
    }) => Quiz.deleteQuizQuestion(quizId, questionId),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ["quizQuestions", quizId] });
    },
  });
};
