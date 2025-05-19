"use client"

import { Info } from "lucide-react"
import { useQuiz } from "./quiz-context"
import { Question, Section } from "@/components/quiz/types/types"

export interface SectionProgressProps {
  sections: Section[]
  questions: Question[]
}

export default function SectionProgress({ sections, questions }: SectionProgressProps) {
  const { questionStatus, currentSectionId } = useQuiz();
  
  const sectionsWithProgress = sections.map(section => {
    const sectionQuestions = questions.filter(q => q.sectionId === section.id);
    
    // Count completed questions from questionStatus (status === 1 means attempted)
    const completedInSection = sectionQuestions.filter(q => questionStatus[q.id] === 1).length;
    
    return {
      ...section,
      completed: completedInSection,
      current: section.id === currentSectionId
    };
  });

  return (
    <div className="space-y-4">
      {sectionsWithProgress.map((section) => (
        <div key={section.id} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm">{section.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{section.totalQuestions} questions</span>
              <button className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <Info className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(section.completed / section.totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
