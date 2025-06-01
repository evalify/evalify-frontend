"use client";

import React from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DescriptiveQuestionProps {
  question: string;
  sampleAnswer?: string;
  wordLimit?: number;
  gradingCriteria?: string;
  explanation?: string;
  showExplanation: boolean;
  onQuestionChange: (question: string) => void;
  onSampleAnswerChange: (sampleAnswer: string) => void;
  onWordLimitChange: (wordLimit: number | undefined) => void;
  onGradingCriteriaChange: (criteria: string) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (show: boolean) => void;
}

const DescriptiveQuestion: React.FC<DescriptiveQuestionProps> = ({
  question,
  sampleAnswer = "",
  wordLimit,
  gradingCriteria = "",
  explanation = "",
  showExplanation,
  onQuestionChange,
  onSampleAnswerChange,
  onWordLimitChange,
  onGradingCriteriaChange,
  onExplanationChange,
  onShowExplanationChange,
}) => {
  const [showSampleAnswer, setShowSampleAnswer] = React.useState(false);
  const [showGradingCriteria, setShowGradingCriteria] = React.useState(false);
  const [enableWordLimit, setEnableWordLimit] = React.useState(!!wordLimit);

  const wordLimitOptions = [
    { value: 50, label: "50 words" },
    { value: 100, label: "100 words" },
    { value: 200, label: "200 words" },
    { value: 300, label: "300 words" },
    { value: 500, label: "500 words" },
    { value: 1000, label: "1000 words" },
  ];

  const handleWordLimitToggle = (enabled: boolean) => {
    setEnableWordLimit(enabled);
    if (!enabled) {
      onWordLimitChange(undefined);
    } else if (!wordLimit) {
      onWordLimitChange(200); // Default to 200 words
    }
  };

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

      {/* Answer Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Answer Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Word Limit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Word Limit</Label>
              <Switch
                checked={enableWordLimit}
                onCheckedChange={handleWordLimitToggle}
              />
            </div>

            {enableWordLimit && (
              <Select
                value={wordLimit?.toString() || "200"}
                onValueChange={(value) => onWordLimitChange(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select word limit" />
                </SelectTrigger>
                <SelectContent>
                  {wordLimitOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sample Answer */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Sample Answer (Optional)</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-sample-answer" className="text-sm">
              Include sample answer
            </Label>
            <Switch
              id="show-sample-answer"
              checked={showSampleAnswer}
              onCheckedChange={setShowSampleAnswer}
            />
          </div>
        </CardHeader>
        {showSampleAnswer && (
          <CardContent>
            <TiptapEditor
              initialContent={sampleAnswer}
              onUpdate={onSampleAnswerChange}
              className="min-h-[200px]"
            />
            <div className="text-sm text-muted-foreground mt-2">
              Provide a model answer for reference during evaluation
            </div>
          </CardContent>
        )}
      </Card>

      {/* Grading Criteria */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Grading Criteria (Optional)</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-grading-criteria" className="text-sm">
              Include grading criteria
            </Label>
            <Switch
              id="show-grading-criteria"
              checked={showGradingCriteria}
              onCheckedChange={setShowGradingCriteria}
            />
          </div>
        </CardHeader>
        {showGradingCriteria && (
          <CardContent>
            <TiptapEditor
              initialContent={gradingCriteria}
              onUpdate={onGradingCriteriaChange}
              className="min-h-[150px]"
            />
            <div className="text-sm text-muted-foreground mt-2">
              Define the criteria and rubric for evaluating answers
            </div>
          </CardContent>
        )}
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

export default DescriptiveQuestion;
