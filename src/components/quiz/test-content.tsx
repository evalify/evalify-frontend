"use client"

import NavigationButtons from "./navigation-buttons"
import QuestionFactory from "./question-types/question-factory"
import { useQuiz } from "./quiz-context"
import { QuizData,} from "@/components/quiz/types/types"
interface TestContentProps {
  data: QuizData
}

export default function TestContent({ data }: TestContentProps) {
  const { currentQuestionId, currentSectionId, setCurrentQuestionId } = useQuiz();
  
  const currentQuestion = data.questions.find(q => q.id === currentQuestionId) || data.questions[0];
  const currentSection = data.sections.find(s => s.id === currentSectionId) || data.sections[0];
  
  const currentQuestionIndex = data.questions.findIndex(q => q.id === currentQuestionId);
  
  // Handle navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionId(data.questions[currentQuestionIndex - 1].id);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionId(data.questions[currentQuestionIndex + 1].id);
    }
  };
  
  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Section {currentSection?.id} of {data.sections.length} : {currentSection?.name}</h2>
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-bold">Question {currentQuestionIndex + 1} of {data.totalQuestions}</h3>
          <div className="flex gap-2">
            <div className="border border-gray-600 rounded px-4 py-2">{currentQuestion?.marks} Marks</div>
            <div className="border border-gray-600 rounded px-4 py-2">{currentQuestion?.type}</div>
          </div>
        </div>
      </div>

      <QuestionFactory question={currentQuestion} />

      <div className="mt-auto">
        <NavigationButtons 
          currentIndex={currentQuestionIndex} 
          totalQuestions={data.questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}
