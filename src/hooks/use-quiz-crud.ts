import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Quiz, { CreateQuizDTO, PatchQuizDTO } from "@/repo/quiz/quiz";

// Query keys
export const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (filters: string) => [...quizKeys.lists(), { filters }] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  byCourse: (courseId: string) =>
    [...quizKeys.all, "course", courseId] as const,
};

// Get all quizzes
export function useQuizzes() {
  return useQuery({
    queryKey: quizKeys.lists(),
    queryFn: Quiz.getAllQuizzes,
  });
}

// Get quiz by ID
export function useQuiz(quizId: string, enabled = true) {
  return useQuery({
    queryKey: quizKeys.detail(quizId),
    queryFn: () => Quiz.getQuizById(quizId),
    enabled: enabled && !!quizId,
  });
}

// Get quizzes by course ID
export function useQuizzesByCourse(courseId: string, enabled = true) {
  return useQuery({
    queryKey: quizKeys.byCourse(courseId),
    queryFn: () => Quiz.getQuizzesByCourseId(courseId),
    enabled: enabled && !!courseId,
  });
}

// Create quiz
export function useCreateQuiz() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (quizData: CreateQuizDTO) => Quiz.createQuiz(quizData),
    onSuccess: (data) => {
      // Invalidate and refetch quiz list
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });

      success("Quiz created successfully!", {
        description: `Quiz has been created with ID: ${data.quizId}`,
        duration: 4000,
      });
    },
    onError: (err: Error) => {
      let errorMessage = "There was an error creating your quiz.";
      if (err && typeof err === "object" && "message" in err) {
        errorMessage = err.message;
      }
      error("Failed to create quiz. Please try again.", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
}

// Update quiz
export function useUpdateQuiz() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({
      quizId,
      quizData,
    }: {
      quizId: string;
      quizData: PatchQuizDTO;
    }) => Quiz.updateQuiz(quizId, quizData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch quiz list
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      // Invalidate and refetch specific quiz
      queryClient.invalidateQueries({
        queryKey: quizKeys.detail(variables.quizId),
      });

      success("Quiz updated successfully!", {
        description: "Your quiz changes have been saved.",
        duration: 4000,
      });
    },
    onError: (err: Error) => {
      let errorMessage = "There was an error updating your quiz.";
      if (err && typeof err === "object" && "message" in err) {
        errorMessage = err.message;
      }
      error("Failed to update quiz. Please try again.", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
}

// Delete quiz
export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (quizId: string) => Quiz.deleteQuiz(quizId),
    onSuccess: (_, quizId) => {
      // Invalidate and refetch quiz list
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      // Remove the specific quiz from cache
      queryClient.removeQueries({ queryKey: quizKeys.detail(quizId) });

      success("Quiz deleted successfully!", {
        description: "The quiz has been permanently removed.",
        duration: 4000,
      });
    },
    onError: (err: Error) => {
      let errorMessage = "There was an error deleting your quiz.";
      if (err && typeof err === "object" && "message" in err) {
        errorMessage = err.message;
      }
      error("Failed to delete quiz. Please try again.", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
}
