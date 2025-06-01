"use client";

import React from "react";
import TopBar from "./top-bar";
import QuestionTypeSelector, { QuestionType } from "./question-type-selector";
import QuestionEditor, { QuestionData } from "./question-editor";
import QuestionSettings from "./question-settings";
import ValidationErrorModal from "./validation-error-modal";
import { validateQuestionData, ValidationError } from "./validation";

interface QuestionSettings {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  courseOutcome: string;
  topics: { value: string; label: string }[];
}

const QuestionCreationPage: React.FC = () => {
  // Question type state
  const [selectedType, setSelectedType] = React.useState<QuestionType>("mcq");

  // Question data state
  const [questionData, setQuestionData] = React.useState<QuestionData>({
    type: "mcq",
    question: "",
    explanation: "",
    showExplanation: false,
    allowMultipleCorrect: false,
    options: [],
  });

  // Question settings state
  const [questionSettings, setQuestionSettings] =
    React.useState<QuestionSettings>({
      marks: 1,
      difficulty: "medium",
      bloomsTaxonomy: "",
      courseOutcome: "",
      topics: [],
    });

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationError[]
  >([]);
  const [showValidationModal, setShowValidationModal] = React.useState(false);

  // Handle question type change
  const handleTypeSelect = (type: QuestionType) => {
    setSelectedType(type);
  };

  // Handle preview
  const handlePreview = () => {
    console.log("Preview question:", {
      type: selectedType,
      data: questionData,
      settings: questionSettings,
    });
    // TODO: Implement preview functionality
    alert("Preview functionality will be implemented soon!");
  }; // Handle save
  const handleSave = () => {
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

    console.log("Save question:", {
      type: selectedType,
      data: questionData,
      settings: questionSettings,
    });

    // TODO: Implement save functionality
    alert("Question saved successfully!");
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
    setQuestionSettings((prev) => ({ ...prev, difficulty }));
  };

  const handleBloomsTaxonomyChange = (bloomsTaxonomy: string) => {
    setQuestionSettings((prev) => ({ ...prev, bloomsTaxonomy }));
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
      <TopBar />
      {/* Question Type Selector */}
      <QuestionTypeSelector
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
        onPreview={handlePreview}
        onSave={handleSave}
      />{" "}
      {/* Main Content Area - Fixed Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Question Editor (fixed width) */}
        <div className="flex-1 min-w-0 p-6 overflow-auto bg-background">
          <QuestionEditor
            questionType={selectedType}
            questionData={questionData}
            onQuestionDataChange={setQuestionData}
          />
        </div>{" "}
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
