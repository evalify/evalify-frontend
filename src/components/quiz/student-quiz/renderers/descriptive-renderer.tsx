/**
 * Descriptive Question Renderer Component
 */

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DescriptiveQuestion } from "../types/quiz-types";

interface DescriptiveRendererProps {
  questionData: DescriptiveQuestion;
  currentAnswer: string | null;
  onAnswerChange: (answer: string) => void;
  isReadOnly?: boolean;
  className?: string;
}

export const DescriptiveRenderer: React.FC<DescriptiveRendererProps> = ({
  questionData,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  className = "",
}) => {
  const [localAnswer, setLocalAnswer] = useState(currentAnswer || "");

  // Debounce the answer change to avoid too frequent updates
  const debouncedOnAnswerChange = useCallback(
    (value: string) => {
      onAnswerChange(value);
    },
    [onAnswerChange],
  );

  const handleInputChange = (value: string) => {
    if (isReadOnly) return;

    setLocalAnswer(value);
    debouncedOnAnswerChange(value);
  };

  const wordCount = localAnswer
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = localAnswer.length;

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <div
              className="text-lg font-medium prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: questionData.question }}
            />
            {questionData.hint && (
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                <strong>Hint:</strong> {questionData.hint}
              </div>
            )}
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <Textarea
              value={localAnswer}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isReadOnly}
              className="min-h-32 resize-y"
              maxLength={5000} // Reasonable limit
            />

            {/* Character/Word Count */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span>{charCount}/5000 characters</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
