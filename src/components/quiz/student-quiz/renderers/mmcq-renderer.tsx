/**
 * Multiple Select Question Renderer Component
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MMCQQuestion } from "../types/quiz-types";

interface MMCQRendererProps {
  questionData: MMCQQuestion;
  currentAnswer: string[] | null;
  onAnswerChange: (answer: string[]) => void;
  isReadOnly?: boolean;
  className?: string;
}

export const MMCQRenderer: React.FC<MMCQRendererProps> = ({
  questionData,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  className = "",
}) => {
  const selectedAnswers = currentAnswer || [];

  const handleAnswerToggle = (optionId: string, checked: boolean) => {
    if (isReadOnly) return;

    let newAnswers: string[];
    if (checked) {
      newAnswers = [...selectedAnswers, optionId];
    } else {
      newAnswers = selectedAnswers.filter((id) => id !== optionId);
    }
    onAnswerChange(newAnswers);
  };

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
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Select all that apply
            </div>
            {questionData.hint && (
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                <strong>Hint:</strong> {questionData.hint}
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {questionData.options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <Checkbox
                  id={option.id}
                  checked={selectedAnswers.includes(option.id)}
                  onCheckedChange={(checked) =>
                    handleAnswerToggle(option.id, checked as boolean)
                  }
                  disabled={isReadOnly}
                  className="mt-1"
                />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer text-sm leading-relaxed"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-muted-foreground min-w-6">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: option.text }}
                    />
                  </div>
                </Label>
              </div>
            ))}
          </div>

          {/* Selection Summary */}
          <div className="flex justify-start items-center">
            <div className="text-sm text-muted-foreground">
              {selectedAnswers.length > 0
                ? `${selectedAnswers.length} option${selectedAnswers.length === 1 ? "" : "s"} selected`
                : "No options selected"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
