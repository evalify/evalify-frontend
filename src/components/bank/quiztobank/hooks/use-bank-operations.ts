import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Bank, { BankQuestion as RepoBankQuestion } from "@/repo/bank/bank";
import {
  PaginatedBankResponse,
  BankTopic,
  AddBankQuestionToQuizRequest,
  QuizQuestionAddResponse,
  ApiErrorResponse,
} from "@/components/bank/types/bank-types";
import { QuestionTypes, Difficulty } from "@/components/render-questions/types";

// Hook for fetching all banks
export function useBanks(params?: URLSearchParams) {
  return useQuery<PaginatedBankResponse>({
    queryKey: ["banks", params?.toString()],
    queryFn: () => Bank.getAllBanks(params),
  });
}

// Hook for fetching bank topics
export function useBankTopics(bankId: string) {
  return useQuery<BankTopic[]>({
    queryKey: ["bankTopics", bankId],
    queryFn: () => Bank.getBankTopics(bankId),
    enabled: !!bankId,
  });
}

// Hook for fetching filtered questions
export function useFilteredQuestions() {
  const { error: showError } = useToast();

  return useMutation<
    RepoBankQuestion[],
    Error,
    {
      bankId: string[];
      noOfQuestions: number;
      difficulty: Difficulty[];
      sectionId: string;
      quizId?: string;
      topicIds?: string[];
      questionType?: QuestionTypes[];
      signal?: AbortSignal;
    }
  >({
    mutationFn: async ({
      bankId,
      noOfQuestions,
      difficulty,
      sectionId,
      quizId,
      topicIds,
      questionType,
      signal,
    }) => {
      return Bank.getFilteredQuestions(
        bankId,
        noOfQuestions,
        difficulty,
        sectionId,
        quizId,
        topicIds,
        questionType,
        signal,
      );
    },
    onError: (error: Error) => {
      // Handle axios cancellation
      if (error.name === "CanceledError") {
        return; // Don't show error for cancelled requests
      }

      const apiError = error as unknown as ApiErrorResponse;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to fetch questions";

      showError(errorMessage);
    },
  });
}

// Hook for adding questions to quiz
export function useAddQuestionsToQuiz() {
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    QuizQuestionAddResponse,
    Error,
    { quizId: string; request: AddBankQuestionToQuizRequest }
  >({
    mutationFn: ({ quizId, request }) =>
      Bank.addBankQuestionToQuiz(quizId, request),
    onSuccess: (response) => {
      success(
        `Successfully added ${response.addedQuestionsCount} unique questions to the quiz`,
      );
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["quiz", "questions"] });
    },
    onError: (error: Error) => {
      const apiError = error as unknown as ApiErrorResponse;
      const errorMessage =
        apiError.response?.data?.message ||
        error.message ||
        "Failed to add questions to quiz";

      showError(`Failed to add questions: ${errorMessage}`);
    },
  });
}
