"use client";

import React from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ToggleLeft, Edit3 } from "lucide-react";

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
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Question
          </CardTitle>
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
          <CardTitle className="text-lg flex items-center gap-2">
            <ToggleLeft className="h-5 w-5 text-primary" />
            Correct Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            role="radiogroup"
            aria-label="True or False answer selection"
            className="flex gap-4"
          >
            <div
              tabIndex={correctAnswer === true ? 0 : -1}
              className={`flex-1 flex items-center justify-center p-4 border rounded-lg transition-colors cursor-pointer ${
                correctAnswer === true
                  ? "border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-900/30"
                  : "border-border hover:border-primary/30"
              }`}
              onClick={() => onCorrectAnswerChange(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCorrectAnswerChange(true);
                }
              }}
            >
              <Label className="text-lg font-medium cursor-pointer">True</Label>
            </div>
            <div
              tabIndex={correctAnswer === false ? 0 : -1}
              className={`flex-1 flex items-center justify-center p-4 border rounded-lg transition-colors cursor-pointer ${
                correctAnswer === false
                  ? "border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-900/30"
                  : "border-border hover:border-primary/30"
              }`}
              onClick={() => onCorrectAnswerChange(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCorrectAnswerChange(false);
                }
              }}
            >
              <Label className="text-lg font-medium cursor-pointer">
                False
              </Label>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mt-4 text-center">
            Click on the correct answer for this statement
          </div>
        </CardContent>
      </Card>

      {/* Explanation Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Explanation (Optional)
          </CardTitle>
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
