"use client";

import React from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrueFalseQuestionProps {
  question: string;
  correctAnswer: boolean | null;
  explanation?: string;
  showExplanation: boolean;
  onQuestionChange: (question: string) => void;
  onCorrectAnswerChange: (answer: boolean) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (show: boolean) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  correctAnswer,
  explanation = "",
  showExplanation,
  onQuestionChange,
  onCorrectAnswerChange,
  onExplanationChange,
  onShowExplanationChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Question Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question</CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question}
            onUpdate={onQuestionChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      {/* Answer Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Correct Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={correctAnswer === null ? "" : correctAnswer.toString()}
            onValueChange={(value) => onCorrectAnswerChange(value === "true")}
          >
            <div
              className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                correctAnswer === true
                  ? "border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-900/30"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value="true" id="true" />
              <Label
                htmlFor="true"
                className="text-base font-medium cursor-pointer"
              >
                True
              </Label>
            </div>
            <div
              className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                correctAnswer === false
                  ? "border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-900/30"
                  : "border-border"
              }`}
            >
              <RadioGroupItem value="false" id="false" />
              <Label
                htmlFor="false"
                className="text-base font-medium cursor-pointer"
              >
                False
              </Label>
            </div>
          </RadioGroup>

          <div className="text-sm text-muted-foreground mt-2">
            Select the correct answer for this statement
          </div>
        </CardContent>
      </Card>

      {/* Explanation Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Explanation (Optional)</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-explanation" className="text-sm">
              Include explanation
            </Label>
            <Switch
              id="show-explanation"
              checked={showExplanation}
              onCheckedChange={onShowExplanationChange}
            />
          </div>
        </CardHeader>
        {showExplanation && (
          <CardContent>
            <TiptapEditor
              initialContent={explanation}
              onUpdate={onExplanationChange}
              className="min-h-[150px]"
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default TrueFalseQuestion;
