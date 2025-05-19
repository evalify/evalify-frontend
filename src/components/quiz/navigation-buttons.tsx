import { ArrowRight } from "lucide-react"
import { useQuiz } from "./quiz-context"
interface NavigationButtonsProps {
  currentIndex: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
}

export default function NavigationButtons({ currentIndex, totalQuestions, onPrevious, onNext }: NavigationButtonsProps) {
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
    <div className="flex justify-between mt-6">
      <button 
        className={`bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg ${isFirstQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onPrevious}
        disabled={isFirstQuestion}
      >
        Previous
      </button>

      <button 
        className="bg-yellow-800 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-lg"
        onClick={handleMarkForReview}
      >
        Mark for review & Next
      </button>

      <button 
        className={`bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg flex items-center gap-2 ${isLastQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onNext}
        disabled={isLastQuestion}
      >
        Next
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}
