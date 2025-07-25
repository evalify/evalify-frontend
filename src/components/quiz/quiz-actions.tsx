import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye } from "lucide-react";
import { useDeleteQuiz, useQuizzes } from "@/hooks/use-quiz-crud";
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
