import { MCQ } from "@/components/question-creation-new/question-types/mcq";
import { DescriptiveQuestion } from "@/components/question-creation-new/question-types/descriptive-question";
import { QuestionSettings } from "@/components/question-creation-new/settings-types/settings-types";
import { QuestionType } from "@/components/question-creation-new/question-type-selector";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateMCQQuestion(
  questionData: MCQ | null,
  settings: QuestionSettings,
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!questionData) {
    errors.push({
      field: "question",
      message: "Question data is required",
    });
    return { isValid: false, errors };
  }

  if (!questionData.question?.trim()) {
    errors.push({
      field: "question",
      message: "Question text cannot be empty",
    });
  }

  if (!questionData.options || questionData.options.length < 2) {
    errors.push({
      field: "options",
      message: "At least 2 options are required",
    });
  }

  if (
    questionData.options &&
    !questionData.options.some((opt) => opt.isCorrect)
  ) {
    errors.push({
      field: "options",
      message: "At least one option must be marked as correct",
    });
  }

  if (questionData.type === "MCQ" && questionData.options) {
    const correctOptions = questionData.options.filter((opt) => opt.isCorrect);
    if (correctOptions.length > 1) {
      errors.push({
        field: "options",
        message: "MCQ questions can only have one correct answer",
      });
    }
  }

  if (!settings.marks || settings.marks <= 0) {
    errors.push({
      field: "marks",
      message: "Marks must be greater than 0",
    });
  }

  if (!settings.difficulty?.trim()) {
    errors.push({
      field: "difficulty",
      message: "Difficulty level is required",
    });
  }

  if (!settings.bloomsTaxonomy?.trim()) {
    errors.push({
      field: "bloomsTaxonomy",
      message: "Bloom's taxonomy is required",
    });
  }

  if (!settings.co || settings.co <= 0) {
    errors.push({
      field: "co",
      message: "Course outcome is required",
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateDescriptiveQuestion(
  questionData: DescriptiveQuestion | null,
  settings: QuestionSettings,
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!questionData) {
    errors.push({
      field: "question",
      message: "Question data is required",
    });
    return { isValid: false, errors };
  }

  if (!questionData.question?.trim()) {
    errors.push({
      field: "question",
      message: "Question text cannot be empty",
    });
  }

  if (!questionData.expectedAnswer?.trim()) {
    errors.push({
      field: "expectedAnswer",
      message: "Expected answer cannot be empty",
    });
  }

  if (!settings.marks || settings.marks <= 0) {
    errors.push({
      field: "marks",
      message: "Marks must be greater than 0",
    });
  }

  if (!settings.difficulty?.trim()) {
    errors.push({
      field: "difficulty",
      message: "Difficulty level is required",
    });
  }

  if (!settings.bloomsTaxonomy?.trim()) {
    errors.push({
      field: "bloomsTaxonomy",
      message: "Bloom's taxonomy is required",
    });
  }

  if (!settings.co || settings.co <= 0) {
    errors.push({
      field: "co",
      message: "Course outcome is required",
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateQuestion(
  questionData: MCQ | DescriptiveQuestion | null,
  questionType: QuestionType,
  settings: QuestionSettings,
): ValidationResult {
  switch (questionType) {
    case "MCQ":
    case "MMCQ":
      return validateMCQQuestion(questionData as MCQ, settings);
    case "DESCRIPTIVE":
      return validateDescriptiveQuestion(
        questionData as DescriptiveQuestion,
        settings,
      );
    default:
      return { isValid: true, errors: [] };
  }
}
