"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import QuestionFactory from "./question-factory";
import QuestionSettings from "./question-settings";
import QuestionTypeSelector, { QuestionType } from "./question-type-selector";
import { MCQ } from "./question-types/mcq";

interface QuestionCreationProps {
  onSave?: (question: MCQ) => void;
  onSaveAndBack?: () => void;
  isEditing?: boolean;
  questionId?: string;
  bankId?: string;
}

export default function QuestionCreation({
  onSave,
  onSaveAndBack,
  isEditing = false,
  questionId,
  //   bankId,
}: QuestionCreationProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>("MCQ");
  const [settings, setSettings] = useState({
    marks: 1,
    difficulty: "medium",
    bloomsTaxonomy: "remember",
    co: "CO1",
    negativeMarks: 1,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<MCQ | null>(null);

  const handleSave = async (question: MCQ) => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave({
          ...question,
          type: selectedType,
        });
        setHasChanges(false);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveFromHeader = async () => {
    if (currentQuestion && onSave) {
      await handleSave(currentQuestion);
    }
  };

  const handleQuestionChange = (question: MCQ) => {
    setCurrentQuestion(question);
    setHasChanges(true);
  };

  const handleSaveAndBack = () => {
    if (onSaveAndBack) {
      onSaveAndBack();
    }
  };

  const handleTypeSelect = (type: QuestionType) => {
    setSelectedType(type);
    setHasChanges(true);
  };

  const handleSettingsChange = (key: string, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const QuestionComponent = QuestionFactory(selectedType);

  // Check if the current question is valid for saving
  const canSave = currentQuestion
    ? Boolean(currentQuestion.question?.trim()) &&
      (selectedType === "MCQ"
        ? Boolean(currentQuestion.options?.some((opt) => opt.isCorrect))
        : true) // Add validation for other question types as needed
    : false;

  return (
    <div className="min-h-screen bg-background">
      <QuestionTypeSelector
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
        onSave={handleSaveFromHeader}
        onSaveAndBack={onSaveAndBack ? handleSaveAndBack : undefined}
        isLoading={isSaving}
        isEdit={isEditing}
        hasChanges={hasChanges}
        canSave={canSave}
      />

      <div className="container mx-auto p-6">
        {!QuestionComponent ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Question type &ldquo;{selectedType}&rdquo; is not yet
                      implemented.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <QuestionSettings
                marks={settings.marks}
                difficulty={settings.difficulty}
                bloomsTaxonomy={settings.bloomsTaxonomy}
                co={settings.co}
                negativeMarks={settings.negativeMarks}
                onMarksChange={(value) => handleSettingsChange("marks", value)}
                onDifficultyChange={(value) =>
                  handleSettingsChange("difficulty", value)
                }
                onBloomsTaxonomyChange={(value) =>
                  handleSettingsChange("bloomsTaxonomy", value)
                }
                onCourseOutcomeChange={(value) =>
                  handleSettingsChange("courseOutcome", value)
                }
                onNegativeMarksChange={(value) =>
                  handleSettingsChange("negativeMarks", value)
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {QuestionComponent && (
                <QuestionComponent
                  type={selectedType as "MCQ"}
                  onSave={handleQuestionChange}
                  isEditing={isEditing}
                  questionId={questionId}
                  settings={settings}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <QuestionSettings
                marks={settings.marks}
                difficulty={settings.difficulty}
                bloomsTaxonomy={settings.bloomsTaxonomy}
                co={settings.co}
                negativeMarks={settings.negativeMarks}
                onMarksChange={(value) => handleSettingsChange("marks", value)}
                onDifficultyChange={(value) =>
                  handleSettingsChange("difficulty", value)
                }
                onBloomsTaxonomyChange={(value) =>
                  handleSettingsChange("bloomsTaxonomy", value)
                }
                onCourseOutcomeChange={(value) =>
                  handleSettingsChange("courseOutcome", value)
                }
                onNegativeMarksChange={(value) =>
                  handleSettingsChange("negativeMarks", value)
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
