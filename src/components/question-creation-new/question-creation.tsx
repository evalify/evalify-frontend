"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionFactory from "@/components/question-creation-new/question-factory";
import QuestionSettings from "@/components/question-creation-new/question-settings";
import QuestionTypeSelector, {
  QuestionType,
} from "@/components/question-creation-new/question-type-selector";
import {
  Question,
  Topic,
} from "@/components/question-creation-new/question-types/base-question";
import { MCQ } from "@/components/question-creation-new/question-types/mcq";
import { DescriptiveQuestion } from "@/components/question-creation-new/question-types/descriptive-question";
import { TrueFalseQuestion } from "@/components/question-creation-new/question-types/true-false";
import { validateQuestion } from "@/components/question-creation-new/validation/validation-factory";
import { ValidationError } from "@/components/question-creation-new/validation/validation-factory";
import { QuestionSettings as QuestionSettingsType } from "@/components/question-creation-new/settings-types/settings-types";
import { useToast } from "@/hooks/use-toast";
import { questionsService } from "@/repo/question-queries/questions";
import ValidationModal from "@/components/question-creation-new/validation-modal";
import { QuestionCreationSkeleton } from "@/components/question-creation-new/fallbacks";
import { QuestionCreationError } from "@/components/question-creation-new/fallbacks";
import Bank from "@/repo/bank/bank";

interface QuestionComponentProps {
  type: QuestionType;
  onSave: (question: Question) => void;
  isEditing: boolean;
  questionId?: string;
  questionData?: Question;
  settings: QuestionSettingsType;
}

interface QuestionCreationProps {
  onSaveAndBack?: () => void;
  isEditing?: boolean;
  questionId?: string;
  bankId?: string;
}

export default function QuestionCreation({
  onSaveAndBack,
  isEditing = false,
  questionId,
  bankId,
}: QuestionCreationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedType, setSelectedType] = useState<QuestionType>("MCQ");
  const [settings, setSettings] = useState<QuestionSettingsType>({
    marks: 1,
    difficulty: "MEDIUM",
    bloomsTaxonomy: "REMEMBER",
    co: 1,
    negativeMarks: 1,
    topicIds: [],
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const { success, error } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const {
    data: questionData,
    error: fetchError,
    isLoading,
  } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => {
      if (!questionId) {
        throw new Error("Question ID is required for fetching question data.");
      }
      return questionsService.getBankQuestionById(questionId);
    },
    enabled: isEditing && !!questionId,
  });

  const onSave = (question: Question) => {
    setCurrentQuestion(question);
    setHasChanges(true);
  };

  const updateUrlWithTopics = useCallback(
    (topicIds: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (topicIds.length > 0) {
        params.delete("topics");
        topicIds.forEach((id) => params.append("topics", id));
      } else {
        params.delete("topics");
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router],
  );

  useEffect(() => {
    if (!isEditing) {
      const topicsFromUrl = searchParams.getAll("topics");
      if (topicsFromUrl.length > 0) {
        setSettings((prev) => ({
          ...prev,
          topicIds: topicsFromUrl,
        }));
      }
    }
  }, [searchParams, isEditing, updateUrlWithTopics]);

  useEffect(() => {
    if (questionData && isEditing) {
      if (questionData.type) {
        setSelectedType(questionData.type as QuestionType);
      }

      const questionTopics =
        questionData.topics?.map((topic: Topic) => topic.id) || [];

      setSettings((prev) => ({
        ...prev,
        marks: questionData.marks || prev.marks,
        difficulty: questionData.difficulty || prev.difficulty,
        bloomsTaxonomy: questionData.bloomsTaxonomy || prev.bloomsTaxonomy,
        co: questionData.co || prev.co,
        negativeMarks: questionData.negativeMarks || prev.negativeMarks,
        topicIds: questionTopics,
      }));

      if (questionTopics.length > 0) {
        updateUrlWithTopics(questionTopics);
      }
    }
  }, [questionData, isEditing, updateUrlWithTopics]);

  const handleSave = async () => {
    if (!currentQuestion || !bankId) {
      error("Question data or bank ID is missing");
      return;
    }

    const validation = validateQuestion(
      currentQuestion as MCQ | DescriptiveQuestion,
      selectedType,
      settings,
    );

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setShowValidationModal(true);
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && questionId) {
        await Bank.updateBankQuestion(bankId, questionId, currentQuestion);
        success("Question updated successfully");
      } else {
        await Bank.addQuestionToBank(bankId, currentQuestion);
        success("Question saved successfully");
      }

      setHasChanges(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      error(
        errorMessage || `Failed to ${isEditing ? "update" : "save"} question`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFromHeader = async () => {
    await handleSave();
  };

  const handleQuestionChange = (question: Question) => {
    onSave(question);
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

  const handleSettingsChange = (
    key: keyof QuestionSettingsType,
    value: string | number | string[],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);

    if (key === "topicIds" && Array.isArray(value)) {
      updateUrlWithTopics(value);
    }
  };

  const QuestionComponent = QuestionFactory(
    selectedType,
  ) as React.ComponentType<QuestionComponentProps> | null;

  const canSave = currentQuestion
    ? Boolean(currentQuestion.question?.trim()) &&
      (selectedType === "MCQ" || selectedType === "MMCQ"
        ? Boolean(
            (currentQuestion as MCQ).options?.some((opt) => opt.isCorrect),
          )
        : selectedType === "TRUEFALSE"
          ? (currentQuestion as TrueFalseQuestion).answer !== null &&
            (currentQuestion as TrueFalseQuestion).answer !== undefined
          : selectedType === "DESCRIPTIVE"
            ? Boolean(
                (currentQuestion as DescriptiveQuestion).expectedAnswer?.trim(),
              )
            : true)
    : false;

  if (isLoading && isEditing) {
    return <QuestionCreationSkeleton />;
  }

  if (fetchError && isEditing) {
    return <QuestionCreationError message={fetchError.message} />;
  }

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
                topicIds={settings.topicIds}
                bankId={bankId}
                onMarksChange={(value) => handleSettingsChange("marks", value)}
                onDifficultyChange={(value) =>
                  handleSettingsChange("difficulty", value)
                }
                onBloomsTaxonomyChange={(value) =>
                  handleSettingsChange("bloomsTaxonomy", value)
                }
                onCourseOutcomeChange={(value) =>
                  handleSettingsChange("co", value)
                }
                onNegativeMarksChange={(value) =>
                  handleSettingsChange("negativeMarks", value)
                }
                onTopicsChange={(value) =>
                  handleSettingsChange("topicIds", value)
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {QuestionComponent && (
                <QuestionComponent
                  type={selectedType}
                  onSave={handleQuestionChange}
                  isEditing={isEditing}
                  questionId={questionId}
                  questionData={questionData}
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
                topicIds={settings.topicIds}
                bankId={bankId}
                onMarksChange={(value) => handleSettingsChange("marks", value)}
                onDifficultyChange={(value) =>
                  handleSettingsChange("difficulty", value)
                }
                onBloomsTaxonomyChange={(value) =>
                  handleSettingsChange("bloomsTaxonomy", value)
                }
                onCourseOutcomeChange={(value) =>
                  handleSettingsChange("co", value)
                }
                onNegativeMarksChange={(value) =>
                  handleSettingsChange("negativeMarks", value)
                }
                onTopicsChange={(value) =>
                  handleSettingsChange("topicIds", value)
                }
              />
            </div>
          </div>
        )}
      </div>

      <ValidationModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        errors={validationErrors}
      />
    </div>
  );
}
