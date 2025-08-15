/**
 * True/False Question Renderer Component
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TrueFalseQuestion } from "../types/quiz-types";

interface TrueFalseRendererProps {
  questionData: TrueFalseQuestion;
  currentAnswer: boolean | null;
  onAnswerChange: (answer: boolean) => void;
  isReadOnly?: boolean;
  className?: string;
}

export const TrueFalseRenderer: React.FC<TrueFalseRendererProps> = ({
  questionData,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  className = "",
}) => {
  const handleAnswerSelect = (value: string) => {
    if (!isReadOnly) {
      onAnswerChange(value === "true");
    }
  };

  const getCurrentValue = () => {
    if (currentAnswer === null || currentAnswer === undefined) return "";
    return currentAnswer ? "true" : "false";
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
            {questionData.hint && (
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                <strong>Hint:</strong> {questionData.hint}
              </div>
            )}
          </div>

          {/* Answer Options */}
          <RadioGroup
            value={getCurrentValue()}
            onValueChange={handleAnswerSelect}
            disabled={isReadOnly}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <RadioGroupItem value="true" id="true-option" className="mt-1" />
              <Label
                htmlFor="true-option"
                className="flex-1 cursor-pointer text-sm leading-relaxed"
              >
                <div className="flex items-start gap-2">
                  <span className="font-medium text-muted-foreground min-w-6">
                    A.
                  </span>
                  <div className="prose prose-sm max-w-none">True</div>
                </div>
              </Label>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <RadioGroupItem
                value="false"
                id="false-option"
                className="mt-1"
              />
              <Label
                htmlFor="false-option"
                className="flex-1 cursor-pointer text-sm leading-relaxed"
              >
                <div className="flex items-start gap-2">
                  <span className="font-medium text-muted-foreground min-w-6">
                    B.
                  </span>
                  <div className="prose prose-sm max-w-none">False</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
