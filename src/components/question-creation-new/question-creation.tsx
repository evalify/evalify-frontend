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
import {
  MCQ,
  MCQOption,
} from "@/components/question-creation-new/question-types/mcq";
import { DescriptiveQuestion } from "@/components/question-creation-new/question-types/descriptive-question";
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

interface UpdatePayload extends Record<string, unknown> {
  type?: string;
  question?: string;
  marks?: number;
  difficulty?: string;
  bloomsTaxonomy?: string;
  co?: number;
  negativeMarks?: number;
  topicIds?: string[];
  options?: MCQOption[];
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;
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
  const [originalData, setOriginalData] = useState<{
    type: QuestionType;
    question: string;
    settings: QuestionSettingsType;
    options?: MCQOption[];
    expectedAnswer?: string;
    strictness?: number;
    guidelines?: string;
  } | null>(null);

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

      const settingsData = {
        marks: questionData.marks || 1,
        difficulty: questionData.difficulty || "medium",
        bloomsTaxonomy: questionData.bloomsTaxonomy || "remember",
        co:
          typeof questionData.co === "string"
            ? parseInt(questionData.co.replace("CO", "")) || 1
            : questionData.co || 1,
        negativeMarks: questionData.negativeMarks || 1,
        topicIds: questionTopics,
      };

      setSettings((prev) => ({
        ...prev,
        ...settingsData,
      }));
      setOriginalData({
        type: questionData.type as QuestionType,
        question: questionData.question || "",
        settings: settingsData,
        options: questionData.options || [],
        expectedAnswer: questionData.expectedAnswer || "",
        strictness: questionData.strictness || 50,
        guidelines: questionData.guidelines || "",
      });

      if (questionTopics.length > 0) {
        updateUrlWithTopics(questionTopics);
      }
    }
  }, [questionData, isEditing, updateUrlWithTopics]);

  const buildUpdatePayload = () => {
    if (!originalData || !currentQuestion) return {};

    const payload: UpdatePayload = {};
    const currentType = currentQuestion.type || selectedType;
    if (currentType !== originalData.type) {
      payload.type = currentType;
    }

    if (currentQuestion.question !== originalData.question) {
      payload.question = currentQuestion.question;
    }

    if (settings.marks !== originalData.settings.marks) {
      payload.marks = settings.marks;
    }
    if (settings.difficulty !== originalData.settings.difficulty) {
      payload.difficulty = settings.difficulty;
    }
    if (settings.bloomsTaxonomy !== originalData.settings.bloomsTaxonomy) {
      payload.bloomsTaxonomy = settings.bloomsTaxonomy;
    }
    if (settings.co !== originalData.settings.co) {
      payload.co = settings.co;
    }
    if (settings.negativeMarks !== originalData.settings.negativeMarks) {
      payload.negativeMarks = settings.negativeMarks;
    }
    const originalTopicIds = originalData.settings.topicIds.sort();
    const currentTopicIds = settings.topicIds.sort();
    if (JSON.stringify(originalTopicIds) !== JSON.stringify(currentTopicIds)) {
      payload.topicIds = settings.topicIds;
    }
    if (currentType === "MCQ" || currentType === "MMCQ") {
      const currentOptions = (currentQuestion as MCQ).options || [];
      const originalOptions = originalData.options || [];

      if (JSON.stringify(currentOptions) !== JSON.stringify(originalOptions)) {
        payload.options = currentOptions;
      }
    }

    if (currentType === "DESCRIPTIVE") {
      const descriptiveQuestion = currentQuestion as DescriptiveQuestion;
      const originalDescriptive = originalData;

      if (
        descriptiveQuestion.expectedAnswer !==
        originalDescriptive.expectedAnswer
      ) {
        payload.expectedAnswer = descriptiveQuestion.expectedAnswer;
      }
      if (descriptiveQuestion.strictness !== originalDescriptive.strictness) {
        payload.strictness = descriptiveQuestion.strictness;
      }
      if (descriptiveQuestion.guidelines !== originalDescriptive.guidelines) {
        payload.guidelines = descriptiveQuestion.guidelines;
      }
    }

    return payload;
  };

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
        const updatePayload = buildUpdatePayload();

        if (Object.keys(updatePayload).length === 0) {
          success("No changes to save");
          setIsSaving(false);
          return;
        }

        await Bank.updateBankQuestion(bankId, questionId, updatePayload);
        success("Question updated successfully");
      } else {
        const baseQuestionRequest = {
          type: currentQuestion.type || selectedType,
          question: currentQuestion.question,
          topicIds: settings.topicIds,
          marks: settings.marks,
          difficulty: settings.difficulty,
          bloomsTaxonomy: settings.bloomsTaxonomy,
          co: settings.co,
          negativeMarks: settings.negativeMarks,
        };

        let questionRequest;
        if (selectedType === "MCQ" || selectedType === "MMCQ") {
          questionRequest = {
            ...baseQuestionRequest,
            options: (currentQuestion as MCQ).options || [],
          };
        } else if (selectedType === "DESCRIPTIVE") {
          const descriptiveQuestion = currentQuestion as DescriptiveQuestion;
          questionRequest = {
            ...baseQuestionRequest,
            expectedAnswer: descriptiveQuestion.expectedAnswer,
            strictness: descriptiveQuestion.strictness,
            guidelines: descriptiveQuestion.guidelines,
          };
        } else {
          questionRequest = baseQuestionRequest;
        }

        await Bank.addQuestionToBank(bankId, questionRequest);
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
