"use client";

import React from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  FileText,
  Edit3,
  BookOpen,
  ClipboardList,
} from "lucide-react";

interface DescriptiveQuestionProps {
  question: string;
  sampleAnswer?: string;
  gradingCriteria?: string;
  explanation?: string;
  showExplanation: boolean;
  onQuestionChange: (question: string) => void;
  onSampleAnswerChange: (sampleAnswer: string) => void;
  onGradingCriteriaChange: (criteria: string) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (show: boolean) => void;
}

const DescriptiveQuestion: React.FC<DescriptiveQuestionProps> = ({
  question,
  sampleAnswer = "",
  gradingCriteria = "",
  explanation = "",
  showExplanation,
  onQuestionChange,
  onSampleAnswerChange,
  onGradingCriteriaChange,
  onExplanationChange,
  onShowExplanationChange,
}) => {
  const [showGradingCriteria, setShowGradingCriteria] = React.useState(false);

  const handleGenerateCriteria = () => {
    // TODO: Implement AI-powered criteria generation
    console.log("Generate criteria functionality not yet implemented");
  };

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

      {/* Sample Answer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Sample Answer
          </CardTitle>
        </CardHeader>
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
      </Card>

      {/* Grading Criteria */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Grading Criteria (Optional)
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateCriteria}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate Criteria
            </Button>
            <div className="flex items-center gap-2">
              <Label htmlFor="show-grading-criteria" className="text-sm">
                Include grading criteria
              </Label>
              <Switch
                id="show-grading-criteria"
                checked={showGradingCriteria}
                onCheckedChange={(checked) => {
                  setShowGradingCriteria(checked);
                }}
              />
            </div>
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

export default DescriptiveQuestion;
