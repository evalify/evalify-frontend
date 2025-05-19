"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useQuiz } from "./quiz-context"
import { Question, Section } from "@/components/quiz/types/types"
interface QuestionGridProps {
  sections: Section[]
  questions: Question[]
}

export default function QuestionGrid({ sections, questions }: QuestionGridProps) {
  const { questionStatus, currentQuestionId, currentSectionId, setCurrentQuestionId } = useQuiz();
  
  const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
  const [displaySectionIndex, setDisplaySectionIndex] = useState(currentSectionIndex >= 0 ? currentSectionIndex : 0);
  
  const handleNextSection = () => {
    if (displaySectionIndex < sections.length - 1) {
      setDisplaySectionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevSection = () => {
    if (displaySectionIndex > 0) {
      setDisplaySectionIndex(prev => prev - 1);
    }
  };
  
  const currentSection = sections[displaySectionIndex];
  const sectionQuestions = currentSection ? questions.filter(q => q.sectionId === currentSection.id) : [];

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          className={`flex items-center gap-1 text-gray-400 ${displaySectionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePrevSection}
          disabled={displaySectionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{sections[displaySectionIndex - 1]?.name || ''}</span>
        </button>
        <div className="text-white">
          {currentSection?.name}
        </div>
        <button 
          className={`flex items-center gap-1 text-gray-400 ${displaySectionIndex === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNextSection}
          disabled={displaySectionIndex === sections.length - 1}
        >
          <span>{sections[displaySectionIndex + 1]?.name || ''}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {sectionQuestions.map((q,index) => {
          const status = questionStatus[q.id] || 0;
          const isCurrent = q.id === currentQuestionId;
          
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionId(q.id)}
              className={cn(
                "h-12 w-full flex items-center justify-center rounded-md text-center",
                status === 0 && "border border-dashed border-gray-600",
                status === 1 && "bg-green-600",
                status === 2 && "bg-gray-600",
                status === 4 && "bg-yellow-600",
                isCurrent && "ring-2 ring-white"
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  )
}
