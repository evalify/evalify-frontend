"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionFactory from "@/components/question-creation/question-factory";
import QuestionSettings from "@/components/question-creation/question-settings";
import QuestionTypeSelector, {
  QuestionType,
} from "@/components/question-creation/question-type-selector";
import {
  Question,
  Topic,
} from "@/components/question-creation/question-types/base-question";
import { MCQ } from "@/components/question-creation/question-types/mcq";
import { DescriptiveQuestion } from "@/components/question-creation/question-types/descriptive-question";
import { TrueFalseQuestion } from "@/components/question-creation/question-types/true-false";
import { FillUpQuestion } from "@/components/question-creation/question-types/fill-up";
import { validateQuestion } from "@/components/question-creation/validation/validation-factory";
import { ValidationError } from "@/components/question-creation/validation/validation-factory";
import { QuestionSettings as QuestionSettingsType } from "@/components/question-creation/settings-types/settings-types";
import { useToast } from "@/hooks/use-toast";
import { questionsService } from "@/repo/question-queries/questions";
import ValidationModal from "@/components/question-creation/validation-modal";
import { QuestionCreationSkeleton } from "@/components/question-creation/fallbacks";
import { QuestionCreationError } from "@/components/question-creation/fallbacks";
import Bank from "@/repo/bank/bank";
import Quiz from "@/repo/quiz/quiz";

interface QuestionComponentProps {
  type: QuestionType;
  onSave: (question: Question) => void;
  isEditing: boolean;
  questionId?: string;
  questionData?: Question;
  settings: QuestionSettingsType;
}

interface QuestionCreationConfig {
  isQuiz: boolean;
  quizId?: string;
  sectionId?: string;
  courseId?: string;
  bankId?: string;
}

interface QuestionCreationProps {
  onSaveAndBack?: () => void;
  onSaveAndNew?: () => void;
  isEditing?: boolean;
  questionId?: string;
  bankId?: string;
  config?: QuestionCreationConfig;
}

export default function QuestionCreation({
  onSaveAndBack,
  onSaveAndNew,
  isEditing = false,
  questionId,
  bankId,
  config = { isQuiz: false, bankId },
}: QuestionCreationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedType, setSelectedType] = useState<QuestionType>("MCQ");
  const [settings, setSettings] = useState<QuestionSettingsType>({
    isQuiz: config.isQuiz,
    marks: 1,
    difficulty: "MEDIUM",
    bloomsTaxonomy: "REMEMBER",
    co: 1,
    negativeMark: 1,
    topicIds: config.isQuiz ? [] : [], // For quiz, topics are handled differently
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const { success, error } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Endpoints configuration based on isQuiz flag
  const endpoints = {
    bank: {
      create: (bankId: string, questionData: Record<string, unknown>) =>
        Bank.addQuestionToBank(bankId, questionData),
      edit: (
        bankId: string,
        questionId: string,
        questionData: Record<string, unknown>,
      ) => Bank.updateBankQuestion(bankId, questionId, questionData),
      get: (questionId: string) =>
        questionsService.getBankQuestionById(questionId),
    },
    quiz: {
      create: (quizId: string, questionData: Record<string, unknown>) =>
        Quiz.createQuizQuestion(quizId, {
          ...questionData,
          sectionId: config.sectionId,
        }),
      edit: (
        quizId: string,
        questionId: string,
        questionData: Record<string, unknown>,
      ) => Quiz.updateQuizQuestion(quizId, questionId, questionData),
      get: (quizId: string, questionId: string) =>
        Quiz.getQuizQuestionById(quizId, questionId),
    },
  };

  const {
    data: questionData,
    error: fetchError,
    isLoading,
  } = useQuery({
    queryKey: config.isQuiz
      ? ["quiz-question", config.quizId, questionId]
      : ["question", questionId],
    queryFn: () => {
      if (!questionId) {
        throw new Error("Question ID is required for fetching question data.");
      }

      if (config.isQuiz) {
        if (!config.quizId) {
          throw new Error(
            "Quiz ID is required for fetching quiz question data.",
          );
        }
        return endpoints.quiz.get(config.quizId, questionId);
      } else {
        return endpoints.bank.get(questionId);
      }
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
    if (!isEditing && !config.isQuiz) {
      // Only handle topics from URL for bank questions
      const topicsFromUrl = searchParams.getAll("topics");
      if (topicsFromUrl.length > 0) {
        setSettings((prev) => ({
          ...prev,
          topicIds: topicsFromUrl,
        }));
      }
    }
  }, [searchParams, isEditing, config.isQuiz, updateUrlWithTopics]);

  useEffect(() => {
    if (questionData && isEditing) {
      if (questionData.type) {
        setSelectedType(questionData.type as QuestionType);
      }

      // Only handle topics for bank questions
      const questionTopics = !config.isQuiz
        ? questionData.topics?.map((topic: Topic) => topic.id) || []
        : [];

      setSettings((prev) => ({
        ...prev,
        marks: questionData.marks || prev.marks,
        difficulty: questionData.difficulty || prev.difficulty,
        bloomsTaxonomy: questionData.bloomsTaxonomy || prev.bloomsTaxonomy,
        co: questionData.co || prev.co,
        negativeMark: questionData.negativeMark || prev.negativeMark,
        topicIds: questionTopics,
      }));

      // Only update URL with topics for bank questions
      if (questionTopics.length > 0 && !config.isQuiz) {
        updateUrlWithTopics(questionTopics);
      }
    }
  }, [questionData, isEditing, config.isQuiz, updateUrlWithTopics]);

  const handleSave = async (shouldCreateNew = false) => {
    if (!currentQuestion) {
      error("Question data is missing");
      return;
    }

    // Validate required IDs based on config
    if (config.isQuiz && !config.quizId) {
      error("Quiz ID is required for quiz questions");
      return;
    }

    if (!config.isQuiz && !config.bankId && !bankId) {
      error("Bank ID is required for bank questions");
      return;
    }

    const validation = validateQuestion(
      currentQuestion as MCQ | DescriptiveQuestion | FillUpQuestion,
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
      if (config.isQuiz) {
        // Handle quiz questions
        if (isEditing && questionId) {
          await endpoints.quiz.edit(
            config.quizId!,
            questionId,
            currentQuestion as Record<string, unknown>,
          );
          success("Quiz question updated successfully");
        } else {
          await endpoints.quiz.create(
            config.quizId!,
            currentQuestion as Record<string, unknown>,
          );
          success("Quiz question saved successfully");
        }
      } else {
        // Handle bank questions
        const targetBankId = config.bankId || bankId;
        if (isEditing && questionId) {
          await endpoints.bank.edit(
            targetBankId!,
            questionId,
            currentQuestion as Record<string, unknown>,
          );
          success("Question updated successfully");
        } else {
          await endpoints.bank.create(
            targetBankId!,
            currentQuestion as Record<string, unknown>,
          );
          success("Question saved successfully");
        }
      }

      setHasChanges(false);

      // Handle post-save actions
      if (shouldCreateNew && !isEditing) {
        // Reset form for new question
        setCurrentQuestion(null);
        setSelectedType("MCQ");
        setHasChanges(false);

        // Wait a bit for the UI to update, then call the callback
        setTimeout(() => {
          if (onSaveAndNew) {
            onSaveAndNew();
          }
        }, 100);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      const actionType = config.isQuiz
        ? isEditing
          ? "update quiz question"
          : "save quiz question"
        : isEditing
          ? "update question"
          : "save question";
      error(errorMessage || `Failed to ${actionType}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFromHeader = async () => {
    await handleSave();
  };

  const handleSaveAndNew = async () => {
    await handleSave(true);
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

    // Only update URL with topics for bank questions
    if (key === "topicIds" && Array.isArray(value) && !config.isQuiz) {
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
        onSaveAndNew={!isEditing ? handleSaveAndNew : undefined}
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
                    <p className="text-muted-foreground">Coming Soon</p>
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
                negativeMark={settings.negativeMark}
                topicIds={settings.topicIds}
                bankId={bankId}
                showTopics={!config.isQuiz}
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
                  handleSettingsChange("negativeMark", value)
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
                negativeMark={settings.negativeMark}
                topicIds={settings.topicIds}
                bankId={bankId}
                showTopics={!config.isQuiz}
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
                  handleSettingsChange("negativeMark", value)
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
