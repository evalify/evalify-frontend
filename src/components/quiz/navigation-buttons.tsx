import { ArrowRight } from "lucide-react";
import { useQuiz } from "./quiz-context";
import { Button } from "../ui/button";

interface NavigationButtonsProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function NavigationButtons({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
}: NavigationButtonsProps) {
  const { currentQuestionId, markQuestionForReview } = useQuiz();
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleMarkForReview = () => {
    markQuestionForReview(currentQuestionId);
    if (!isLastQuestion) {
      onNext();
    }
  };

  return (
    <div className="flex justify-between mt-4 w-full">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="h-9 px-3 text-sm"
      >
        Previous
      </Button>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-9 px-3 text-sm bg-yellow-500/90 hover:bg-yellow-600 text-white dark:bg-yellow-600/90 dark:hover:bg-yellow-700"
          onClick={handleMarkForReview}
        >
          Mark & Next
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onNext}
          disabled={isLastQuestion}
          className="flex h-9 items-center gap-1 px-3 text-sm"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
