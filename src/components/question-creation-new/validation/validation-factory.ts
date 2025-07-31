import { MCQ } from "@/components/question-creation-new/question-types/mcq";
import { DescriptiveQuestion } from "@/components/question-creation-new/question-types/descriptive-question";
import { MatchTheFollowing } from "@/components/question-creation-new/question-types/match-the-following";
import { Question } from "@/components/question-creation-new/question-types/base-question";
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

// Common validation functions
function validateCommonQuestion(
  questionData: Question | null,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!questionData) {
    errors.push({
      field: "question",
      message: "Question data is required",
    });
    return errors;
  }

  if (!questionData.question?.trim()) {
    errors.push({
      field: "question",
      message: "Question text cannot be empty",
    });
  }

  return errors;
}

function validateCommonSettings(settings: QuestionSettings): ValidationError[] {
  const errors: ValidationError[] = [];

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

  if (!settings.topicIds || settings.topicIds.length === 0) {
    errors.push({
      field: "topicIds",
      message: "At least one topic must be selected",
    });
  }

  return errors;
}

export function validateMCQQuestion(
  questionData: MCQ | null,
  settings: QuestionSettings,
): ValidationResult {
  const errors: ValidationError[] = [];

  // Common validation
  errors.push(...validateCommonQuestion(questionData));
  errors.push(...validateCommonSettings(settings));

  // Early return if basic validation fails
  if (!questionData) {
    return { isValid: false, errors };
  }

  // MCQ-specific validation
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

  return { isValid: errors.length === 0, errors };
}

export function validateDescriptiveQuestion(
  questionData: DescriptiveQuestion | null,
  settings: QuestionSettings,
): ValidationResult {
  const errors: ValidationError[] = [];

  // Common validation
  errors.push(...validateCommonQuestion(questionData));
  errors.push(...validateCommonSettings(settings));

  // Early return if basic validation fails
  if (!questionData) {
    return { isValid: false, errors };
  }

  // Descriptive-specific validation
  if (!questionData.expectedAnswer?.trim()) {
    errors.push({
      field: "expectedAnswer",
      message: "Expected answer cannot be empty",
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateMatchTheFollowingQuestion(
  questionData: MatchTheFollowing | null,
  settings: QuestionSettings,
): ValidationResult {
  const errors: ValidationError[] = [];

  // Common validation
  errors.push(...validateCommonQuestion(questionData));
  errors.push(...validateCommonSettings(settings));

  // Early return if basic validation fails
  if (!questionData) {
    return { isValid: false, errors };
  }

  // Match-the-following specific validation
  if (!questionData.keys || questionData.keys.length < 2) {
    errors.push({
      field: "keys",
      message: "At least 2 left items are required",
    });
  }

  if (!questionData.values || questionData.values.length < 2) {
    errors.push({
      field: "values",
      message: "At least 2 right items are required",
    });
  }

  // Check if left items have text
  if (
    questionData.keys &&
    questionData.keys.some((item) => !item.text.trim())
  ) {
    errors.push({
      field: "keys",
      message: "All left items must have text",
    });
  }

  // Check if right items have text
  if (
    questionData.values &&
    questionData.values.some((item) => !item.text.trim())
  ) {
    errors.push({
      field: "values",
      message: "All right items must have text",
    });
  }

  // Check if there are any matches defined
  if (!questionData.matchPair || questionData.matchPair.length === 0) {
    errors.push({
      field: "matchPair",
      message: "At least one match pair is required",
    });
  }

  // Check if each left item has at least one match
  if (questionData.keys && questionData.matchPair) {
    questionData.keys.forEach((leftItem) => {
      const hasMatch = questionData.matchPair.some(
        (pair) => pair.leftPair === leftItem.id && pair.rightPair.length > 0,
      );
      if (!hasMatch) {
        const leftItemText = leftItem.text.replace(/<[^>]*>/g, "").trim();
        const displayText =
          leftItemText.length > 30
            ? leftItemText.substring(0, 30) + "..."
            : leftItemText;
        errors.push({
          field: "matchPair",
          message: `Left item "${displayText}" must have at least one match`,
        });
      }
    });
  }

  // Check if all match pairs have valid references
  if (questionData.matchPair) {
    questionData.matchPair.forEach((pair, index) => {
      const leftExists = questionData.keys.some(
        (key) => key.id === pair.leftPair,
      );
      if (!leftExists) {
        errors.push({
          field: "matchPair",
          message: `Match pair ${index + 1} has invalid left item reference`,
        });
      }

      if (!pair.rightPair || pair.rightPair.length === 0) {
        errors.push({
          field: "matchPair",
          message: `Match pair ${index + 1} must have at least one right item`,
        });
      }

      pair.rightPair.forEach((rightId) => {
        const rightExists = questionData.values.some(
          (value) => value.id === rightId,
        );
        if (!rightExists) {
          errors.push({
            field: "matchPair",
            message: `Match pair ${index + 1} has invalid right item reference`,
          });
        }
      });
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateQuestion(
  questionData: Question | null,
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
    case "MATCH_THE_FOLLOWING":
      return validateMatchTheFollowingQuestion(
        questionData as MatchTheFollowing,
        settings,
      );
    default:
      return { isValid: true, errors: [] };
  }
}
