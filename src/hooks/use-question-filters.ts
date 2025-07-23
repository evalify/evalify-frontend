import { useState, useCallback } from "react";
import Quiz from "@/repo/quiz/quiz";
import { QuestionFilters, BankQuestionsReturnDTO } from "@/types/quiz-types";

export interface UseQuestionFiltersReturn {
  filteredQuestions: BankQuestionsReturnDTO[];
  loading: boolean;
  error: string | null;
  filterQuestions: (quizId: string, filters: QuestionFilters) => Promise<void>;
  clearFilters: () => void;
}

/**
 * Hook for filtering questions from question banks
 * Handles the API call to backend with proper "Any" -> null transformation
 */
export function useQuestionFilters(): UseQuestionFiltersReturn {
  const [filteredQuestions, setFilteredQuestions] = useState<
    BankQuestionsReturnDTO[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterQuestions = useCallback(
    async (quizId: string, filters: QuestionFilters) => {
      try {
        setLoading(true);
        setError(null);

        const questions = await Quiz.filterBankQuestionsToQuiz(quizId, filters);
        setFilteredQuestions(questions);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to filter questions";
        setError(errorMessage);
        console.error("Error filtering questions:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilteredQuestions([]);
    setError(null);
  }, []);

  return {
    filteredQuestions,
    loading,
    error,
    filterQuestions,
    clearFilters,
  };
}
