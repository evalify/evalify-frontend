"use client";

import { useQuiz } from "./quiz-context";
import { Question, Section } from "@/components/quiz/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface SectionProgressProps {
  sections: Section[];
  questions: Question[];
}

export default function SectionProgress({
  sections,
  questions,
}: SectionProgressProps) {
  const {
    questionStatus,
    currentSectionId,
    setCurrentSectionId,
    setCurrentQuestionId,
  } = useQuiz();

  const sectionsWithProgress = sections.map((section) => {
    const sectionQuestions = questions.filter(
      (q) => q.sectionId === section.id,
    );

    // Count completed questions from questionStatus (status === 1 means attempted)
    const completedInSection = sectionQuestions.filter(
      (q) => questionStatus[q.id] === 1,
    ).length;

    return {
      ...section,
      completed: completedInSection,
      current: section.id === currentSectionId,
      questions: sectionQuestions, // Store the section's questions for navigation
    };
  });

  // Handle click on a section
  const handleSectionClick = (
    section: Section & {
      questions: Question[];
      completed: number;
      current: boolean;
    },
  ) => {
    // Set the current section ID
    setCurrentSectionId(section.id);

    // Navigate to the first question in that section
    if (section.questions && section.questions.length > 0) {
      setCurrentQuestionId(section.questions[0].id);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {sectionsWithProgress.map((section) => (
          <div
            key={section.id}
            className={`space-y-1 cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors `}
            onClick={() => handleSectionClick(section)}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{section.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {section.totalQuestions} questions
                </Badge>
                {section.current && (
                  <Badge variant="default" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${(section.completed / section.totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
