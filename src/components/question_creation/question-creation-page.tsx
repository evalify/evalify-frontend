"use client";

import React from "react";
import TopBar from "./top-bar";
import QuestionTypeSelector from "./question-type-selector";
import QuestionEditor from "./question-editor";
import QuestionSettings from "./question-settings";
import ValidationErrorModal from "./validation-error-modal";
import { validateQuestionData } from "./validation";
import { useToast } from "@/hooks/use-toast";
import { questionsService } from "@/app/api/services/questions";
import {
  QuestionType,
  QuestionData,
  QuestionCreationSettings,
  QuestionCreationPageProps,
  ValidationError,
  createDefaultQuestionData,
  createDefaultQuestionSettings,
} from "./question-creation-types";
import { Difficulty, Taxonomy } from "@/components/render-questions/types";

const QuestionCreationPage: React.FC<QuestionCreationPageProps> = ({
  isEdit = false,
  initialQuestionData,
  initialQuestionSettings,
  questionId,
}) => {
  // Initialize toast hook
  const { info, success, error } = useToast();

  // Initialize question type from initial data or default to "mcq"
  const [selectedType, setSelectedType] = React.useState<QuestionType>(
    initialQuestionData?.type || "mcq",
  );

  // Initialize question data from initial data or use defaults
  const [questionData, setQuestionData] = React.useState<QuestionData>(
    initialQuestionData || createDefaultQuestionData("mcq"),
  );

  // Initialize question settings from initial data or use defaults
  const [questionSettings, setQuestionSettings] =
    React.useState<QuestionCreationSettings>(
      initialQuestionSettings || createDefaultQuestionSettings(),
    );

  // Store initial state for change tracking
  const initialStateRef = React.useRef({
    type: selectedType,
    data: questionData,
    settings: questionSettings,
  });

  // Update initial state when props change
  React.useEffect(() => {
    if (isEdit && initialQuestionData && initialQuestionSettings) {
      const newInitialState = {
        type: initialQuestionData.type,
        data: initialQuestionData,
        settings: initialQuestionSettings,
      };
      initialStateRef.current = newInitialState;
      setSelectedType(initialQuestionData.type);
      setQuestionData(initialQuestionData);
      setQuestionSettings(initialQuestionSettings);
    }
  }, [isEdit, initialQuestionData, initialQuestionSettings]);

  // Track if there are changes
  const hasChanges = React.useMemo(() => {
    if (!isEdit) return false;

    const current = {
      type: selectedType,
      data: questionData,
      settings: questionSettings,
    };

    return JSON.stringify(current) !== JSON.stringify(initialStateRef.current);
  }, [isEdit, selectedType, questionData, questionSettings]);

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationError[]
  >([]);
  const [showValidationModal, setShowValidationModal] = React.useState(false); // Handle question type change
  const handleTypeSelect = (type: QuestionType) => {
    if (isEdit) {
      // In edit mode, don't allow type changes
      return;
    }
    setSelectedType(type);
    // Reset question data to default for the new type
    setQuestionData(createDefaultQuestionData(type));
  };

  // Handle preview
  const handlePreview = () => {
    console.log("Preview question:", {
      type: selectedType,
      data: questionData,
      settings: questionSettings,
    });
    // Show info toast instead of alert
    info("Preview functionality will be implemented soon!");
  };

  const resetForm = () => {
    setSelectedType("mcq");
    setQuestionData(createDefaultQuestionData("mcq"));
    setQuestionSettings(createDefaultQuestionSettings());
    setValidationErrors([]);
    setShowValidationModal(false);
  };
  // Handle save
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    // Comprehensive validation using the validation system
    const validationResult = validateQuestionData(
      questionData,
      questionSettings.marks,
    );

    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      setShowValidationModal(true);
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (isEdit && questionId) {
        // Update existing question
        response = await questionsService.updateQuestion(questionId, {
          type: selectedType,
          data: questionData,
          settings: questionSettings,
        });

        console.log("Question updated successfully:", response);

        // Show success toast
        success("Question updated successfully!", {
          description: `Question ID: ${response.id}`,
        });

        // Update initial state ref to reflect the new saved state
        initialStateRef.current = {
          type: selectedType,
          data: questionData,
          settings: questionSettings,
        };
      } else {
        // Create new question
        response = await questionsService.createQuestion({
          type: selectedType,
          data: questionData,
          settings: questionSettings,
        });

        console.log("Question saved successfully:", response);

        // Show success toast
        success("Question saved successfully!", {
          description: `Question ID: ${response.id}`,
        });

        // Reset the form after successful save (only for create mode)
        resetForm();
      }
    } catch (err) {
      console.error(`Error ${isEdit ? "updating" : "saving"} question:`, err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to ${isEdit ? "update" : "save"} question. Please try again.`;

      error(`Failed to ${isEdit ? "update" : "save"} question`, {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle validation modal close
  const handleValidationModalClose = () => {
    setShowValidationModal(false);
    setValidationErrors([]);
  };

  // Handle settings changes
  const handleMarksChange = (marks: number) => {
    setQuestionSettings((prev) => ({ ...prev, marks }));
  };

  const handleDifficultyChange = (difficulty: string) => {
    setQuestionSettings((prev) => ({
      ...prev,
      difficulty: difficulty as Difficulty,
    }));
  };

  const handleBloomsTaxonomyChange = (bloomsTaxonomy: string) => {
    setQuestionSettings((prev) => ({
      ...prev,
      bloomsTaxonomy: bloomsTaxonomy as Taxonomy | "",
    }));
  };

  const handleCourseOutcomeChange = (courseOutcome: string) => {
    setQuestionSettings((prev) => ({ ...prev, courseOutcome }));
  };

  const handleTopicsChange = (topics: { value: string; label: string }[]) => {
    setQuestionSettings((prev) => ({ ...prev, topics }));
  };
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <TopBar /> {/* Question Type Selector */}
      <QuestionTypeSelector
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
        onPreview={handlePreview}
        onSave={handleSave}
        isLoading={isLoading}
        isEdit={isEdit}
        hasChanges={hasChanges}
      />
      {/* Main Content Area - Fixed Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Question Editor (fixed width) */}
        <div className="flex-1 min-w-0 p-6 overflow-auto bg-background">
          <QuestionEditor
            questionType={selectedType}
            questionData={questionData}
            onQuestionDataChange={setQuestionData}
          />
        </div>
        {/* Right Panel - Question Settings (fixed width) */}
        <div className="w-96 border-l overflow-hidden">
          <QuestionSettings
            marks={questionSettings.marks}
            difficulty={questionSettings.difficulty}
            bloomsTaxonomy={questionSettings.bloomsTaxonomy}
            courseOutcome={questionSettings.courseOutcome}
            topics={questionSettings.topics}
            onMarksChange={handleMarksChange}
            onDifficultyChange={handleDifficultyChange}
            onBloomsTaxonomyChange={handleBloomsTaxonomyChange}
            onCourseOutcomeChange={handleCourseOutcomeChange}
            onTopicsChange={handleTopicsChange}
          />
        </div>
      </div>
      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationModal}
        onClose={handleValidationModalClose}
        errors={validationErrors}
        questionType={selectedType}
      />
    </div>
  );
};

export default QuestionCreationPage;
