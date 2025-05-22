"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"
import { useQuiz } from "./quiz-context";
import { Question, Section } from "@/components/quiz/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface QuestionGridProps {
  sections: Section[];
  questions: Question[];
  quizId?: string;
  onQuestionChange?: (questionId: string | number) => void;
}

export default function QuestionGrid({
  sections,
  questions,
  // quizId,
  onQuestionChange,
}: QuestionGridProps) {
  const {
    questionStatus,
    currentQuestionId,
    currentSectionId,
    setCurrentQuestionId,
    setCurrentSectionId,
  } = useQuiz();

  // Type for section and question
  type SectionType = Section;
  type QuestionType = Question;

  const currentSectionIndex = sections.findIndex(
    (s: SectionType) => s.id === currentSectionId,
  );
  const [displaySectionIndex, setDisplaySectionIndex] = useState<number>(
    currentSectionIndex >= 0 ? currentSectionIndex : 0,
  );

  // Update displaySectionIndex when currentSectionId changes
  useEffect(() => {
    const newIndex = sections.findIndex(
      (s: SectionType) => s.id === currentSectionId,
    );
    if (newIndex >= 0) {
      setDisplaySectionIndex(newIndex);
    }
  }, [currentSectionId, sections]);

  const handleNextSection = () => {
    if (displaySectionIndex < sections.length - 1) {
      const nextIndex = displaySectionIndex + 1;
      setDisplaySectionIndex(nextIndex);

      // Also update the current section in the quiz context
      setCurrentSectionId(sections[nextIndex].id);

      // Select the first question of the next section
      const nextSectionQuestions = questions.filter(
        (q: QuestionType) => q.sectionId === sections[nextIndex].id,
      );
      if (nextSectionQuestions.length > 0) {
        setCurrentQuestionId(nextSectionQuestions[0].id);
        if (onQuestionChange) onQuestionChange(nextSectionQuestions[0].id);
      }
    }
  };

  const handlePrevSection = () => {
    if (displaySectionIndex > 0) {
      const prevIndex = displaySectionIndex - 1;
      setDisplaySectionIndex(prevIndex);

      // Also update the current section in the quiz context
      setCurrentSectionId(sections[prevIndex].id);

      // Select the first question of the previous section
      const prevSectionQuestions = questions.filter(
        (q: QuestionType) => q.sectionId === sections[prevIndex].id,
      );
      if (prevSectionQuestions.length > 0) {
        setCurrentQuestionId(prevSectionQuestions[0].id);
        if (onQuestionChange) onQuestionChange(prevSectionQuestions[0].id);
      }
    }
  };

  const currentSection = sections[displaySectionIndex];
  const sectionQuestions = currentSection
    ? questions.filter((q: QuestionType) => q.sectionId === currentSection.id)
    : [];

  return (
    <Card className="mt-3 border-muted/30">
      <CardHeader className="p-2 flex flex-row justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="flex h-8 items-center gap-1 p-1 text-muted-foreground hover:bg-background"
          onClick={handlePrevSection}
          disabled={displaySectionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-xs">
            {sections[displaySectionIndex - 1]?.name || ""}
          </span>
        </Button>
        <div className="text-sm font-medium text-foreground">
          {currentSection?.name}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex h-8 items-center gap-1 p-1 text-muted-foreground hover:bg-background"
          onClick={handleNextSection}
          disabled={displaySectionIndex === sections.length - 1}
        >
          <span className="text-xs">
            {sections[displaySectionIndex + 1]?.name || ""}
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-2">
        <div className="grid grid-cols-5 gap-1 items-center justify-items-center">
          {sectionQuestions.map((q: QuestionType, index: number) => {
            const status = questionStatus[q.id] || 0;
            const isCurrent = q.id === currentQuestionId;
            return (
              <Button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionId(q.id);
                  if (onQuestionChange) onQuestionChange(q.id);
                }}
                variant={
                  status === 1
                    ? "default"
                    : status === 2
                      ? "secondary"
                      : status === 4
                        ? "destructive"
                        : "outline"
                }
                size="sm"
                className={cn(
                  "h-13 w-13 p-0 text-sm font-medium aspect-square",
                  status === 1 &&
                    "bg-green-600/90 text-white hover:bg-green-700 dark:bg-green-700/90 dark:hover:bg-green-700",
                  status === 2 &&
                    "bg-gray-500/80 text-white hover:bg-gray-600 dark:bg-gray-600/80 dark:hover:bg-gray-700",
                  status === 4 &&
                    "bg-yellow-500/90 text-white hover:bg-yellow-600 dark:bg-yellow-600/90 dark:hover:bg-yellow-700",
                  status === 0 &&
                    "border-gray-300 text-muted-foreground dark:border-gray-600",
                  isCurrent && "ring-2 ring-primary",
                )}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
