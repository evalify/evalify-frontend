import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Quiz from "@/repo/quiz/quiz";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Query keys for quiz operations
const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (filters: string) => [...quizKeys.lists(), { filters }] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  byCourse: (courseId: string) =>
    [...quizKeys.all, "course", courseId] as const,
};

// Custom hooks for quiz operations
function useDeleteQuiz() {
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

function useQuizzes() {
  return useQuery({
    queryKey: quizKeys.lists(),
    queryFn: Quiz.getAllQuizzes,
  });
}

interface QuizActionsProps {
  quizId: string;
  quizName: string;
  onEdit?: (quizId: string) => void;
  onView?: (quizId: string) => void;
}

export function QuizActions({
  quizId,
  quizName,
  onEdit,
  onView,
}: QuizActionsProps) {
  const deleteQuizMutation = useDeleteQuiz();

  const handleDelete = () => {
    deleteQuizMutation.mutate(quizId);
  };

  return (
    <div className="flex items-center gap-2">
      {onView && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(quizId)}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      )}

      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(quizId)}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            disabled={deleteQuizMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz &quot;{quizName}&quot; and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteQuizMutation.isPending}
            >
              {deleteQuizMutation.isPending ? "Deleting..." : "Delete Quiz"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Example usage component showing how to list quizzes with CRUD operations
export function QuizList() {
  const { data: quizzes, isLoading, error } = useQuizzes();

  if (isLoading) {
    return <div>Loading quizzes...</div>;
  }

  if (error) {
    return <div>Error loading quizzes: {error.message}</div>;
  }

  const handleEdit = (quizId: string) => {
    // Navigate to edit page or open edit modal
    console.log("Edit quiz:", quizId);
  };

  const handleView = (quizId: string) => {
    // Navigate to quiz view page
    console.log("View quiz:", quizId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Quiz List</h2>
      <div className="grid gap-4">
        {quizzes?.map(
          (quiz: { id: string; name: string; description: string }) => (
            <div
              key={quiz.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{quiz.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
              </div>
              <QuizActions
                quizId={quiz.id}
                quizName={quiz.name}
                onEdit={handleEdit}
                onView={handleView}
              />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
