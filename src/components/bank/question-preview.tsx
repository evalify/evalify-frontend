"use client";

import { Question } from "@/lib/types";
import { QuestionCard } from "@/components/bank/question-card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuestionPreviewProps {
  questions: Question[];
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function QuestionPreview({
  questions = [],
  selectable = true,
  selectedIds = [],
  onSelectionChange,
}: QuestionPreviewProps) {
  // Use the selectedIds from props instead of internal state
  const selectedQuestionIds = selectedIds;

  // Handle question selection
  const toggleQuestionSelection = (questionId: string) => {
    if (!onSelectionChange) return;

    const newSelectedIds = selectedQuestionIds.includes(questionId)
      ? selectedQuestionIds.filter((id) => id !== questionId)
      : [...selectedQuestionIds, questionId];

    onSelectionChange(newSelectedIds);
  };

  if (questions.length === 0) {
    return (
      <Alert className="bg-card border-border border-l-4 border-l-yellow-600">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-muted-foreground">
          No questions available. Apply filters to preview questions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          selectable={selectable}
          isSelected={selectedQuestionIds.includes(question.id)}
          onSelect={() => toggleQuestionSelection(question.id)}
        />
      ))}
    </div>
  );
}
