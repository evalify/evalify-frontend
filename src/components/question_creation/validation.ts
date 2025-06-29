import { QuestionData } from "./question-creation-types";

// Extract specific question data types from the discriminated union
type MCQData = Extract<QuestionData, { type: "mcq" }>;
type CodingData = Extract<QuestionData, { type: "coding" }>;
type MatchFollowingData = Extract<QuestionData, { type: "match-following" }>;
type FillupData = Extract<QuestionData, { type: "fillup" }>;
type DescriptiveData = Extract<QuestionData, { type: "descriptive" }>;
type TrueFalseData = Extract<QuestionData, { type: "true-false" }>;
type FileUploadData = Extract<QuestionData, { type: "file-upload" }>;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates question data based on question type
 * Required fields:
 * - All types: question text, marks (positive number)
 * - MCQ: at least 2 options, at least one correct answer, all options must have text
 * - Coding: function name, parameters, return type, at least one test case with valid input/output
 * - Match Following: at least 2 match items, all items must have both left and right text
 * - Fill in Blanks: question with blanks (___), at least one blank with acceptable answers
 * - Descriptive: question text only (sample answer, word limit, grading criteria are optional)
 * - True/False: question text, correct answer selected
 * - File Upload: question text, at least one allowed file type
 *
 * Optional fields for all types: explanation, taxonomy level, course outcome, topics
 */
export function validateQuestionData(
  questionData: QuestionData,
  marks?: number,
): ValidationResult {
  const errors: ValidationError[] = [];

  // Common validation: question text is required
  if (!questionData.question || questionData.question.trim() === "") {
    errors.push({
      field: "question",
      message: "Question text is required",
    });
  }

  // Common validation: marks validation
  if (marks !== undefined) {
    if (marks <= 0) {
      errors.push({
        field: "marks",
        message: "Marks must be a positive number greater than 0",
      });
    }
    if (!Number.isInteger(marks)) {
      errors.push({
        field: "marks",
        message: "Marks must be a whole number",
      });
    }
  }

  // Type-specific validation
  switch (questionData.type) {
    case "mcq":
      validateMCQQuestion(questionData, errors);
      break;

    case "coding":
      validateCodingQuestion(questionData, errors);
      break;

    case "match-following":
      validateMatchFollowingQuestion(questionData, errors);
      break;

    case "fillup":
      validateFillupQuestion(questionData, errors);
      break;

    case "descriptive":
      validateDescriptiveQuestion(questionData, errors);
      break;

    case "true-false":
      validateTrueFalseQuestion(questionData, errors);
      break;

    case "file-upload":
      validateFileUploadQuestion(questionData, errors);
      break;

    default:
      errors.push({
        field: "type",
        message: "Invalid question type",
      });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateMCQQuestion(
  questionData: MCQData,
  errors: ValidationError[],
): void {
  const options = questionData.options || [];

  // Must have at least 2 options
  if (options.length < 2) {
    errors.push({
      field: "options",
      message: "MCQ must have at least 2 options",
    });
  }
  // All options must have text
  const emptyOptions = options.filter(
    (opt) => !opt.text || opt.text.trim() === "",
  );
  if (emptyOptions.length > 0) {
    errors.push({
      field: "options",
      message: "All options must have text",
    });
  }

  // At least one option must be marked as correct
  const correctOptions = options.filter((opt) => opt.isCorrect);
  if (correctOptions.length === 0) {
    errors.push({
      field: "options",
      message: "At least one option must be marked as correct",
    });
  }

  // If multiple correct answers are not allowed, only one should be correct
  if (!questionData.allowMultipleCorrect && correctOptions.length > 1) {
    errors.push({
      field: "options",
      message:
        "Only one option can be correct when multiple correct answers are not allowed",
    });
  }
}

function validateCodingQuestion(
  questionData: CodingData,
  errors: ValidationError[],
): void {
  // Function name validation
  const functionName = questionData.functionName;
  if (!functionName || functionName.trim() === "") {
    errors.push({
      field: "functionName",
      message: "Function name is required for coding questions",
    });
  } else {
    // Validate function name format (should be a valid identifier)
    const functionNamePattern = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    if (!functionNamePattern.test(functionName.trim())) {
      errors.push({
        field: "functionName",
        message:
          "Function name must be a valid identifier (letters, numbers, underscore, starting with letter or underscore)",
      });
    }
  }

  // Test cases validation - must have at least one test case
  const testCases = questionData.testCases || [];
  if (testCases.length === 0) {
    errors.push({
      field: "testCases",
      message: "At least one test case is required",
    });
  } else {
    testCases.forEach((testCase, index: number) => {
      // Check if expected output is provided
      if (!testCase.expected || String(testCase.expected).trim() === "") {
        errors.push({
          field: "testCases",
          message: `Test case ${index + 1} expected output is required`,
        });
      }

      // Check if input is provided
      if (
        !testCase.input ||
        (Array.isArray(testCase.input) && testCase.input.length === 0)
      ) {
        errors.push({
          field: "testCases",
          message: `Test case ${index + 1} must have input parameters`,
        });
      } else if (Array.isArray(testCase.input)) {
        // Check if all input values are provided
        const emptyInputs = testCase.input.filter(
          (value) => !value || String(value).trim() === "",
        );
        if (emptyInputs.length > 0) {
          errors.push({
            field: "testCases",
            message: `Test case ${index + 1} has empty input parameters`,
          });
        }
      }
    });
  }

  // Language validation
  if (!questionData.language || questionData.language.length === 0) {
    errors.push({
      field: "language",
      message: "At least one programming language is required",
    });
  }
}

function validateMatchFollowingQuestion(
  questionData: MatchFollowingData,
  errors: ValidationError[],
): void {
  const matchItems = questionData.matchItems || [];

  // Must have at least 2 match items
  if (matchItems.length < 2) {
    errors.push({
      field: "matchItems",
      message: "Match the Following must have at least 2 items",
    });
  }

  // All match items must have both left and right text
  matchItems.forEach((item, index: number) => {
    if (!item.leftPair || item.leftPair.trim() === "") {
      errors.push({
        field: "matchItems",
        message: `Match item ${index + 1} left text is required`,
      });
    }
    if (!item.rightPair || item.rightPair.trim() === "") {
      errors.push({
        field: "matchItems",
        message: `Match item ${index + 1} right text is required`,
      });
    }
  });
}

function validateFillupQuestion(
  questionData: FillupData,
  errors: ValidationError[],
): void {
  const question = questionData.question || "";
  const blanks = questionData.blanks || [];

  // Check if question contains blanks (exactly three consecutive underscores)
  const blankPattern = /(?<!_)_{3}(?!_)/g;
  const blankMatches = question.match(blankPattern);

  if (!blankMatches || blankMatches.length === 0) {
    errors.push({
      field: "question",
      message:
        "Fill in the Blanks question must contain blanks marked with three underscores (___)",
    });
  } else if (blankMatches.length !== blanks.length) {
    errors.push({
      field: "blanks",
      message: `Number of blanks in question (${blankMatches.length}) doesn't match the number of blank definitions (${blanks.length})`,
    });
  }

  // Must have at least one blank with acceptable answers
  if (blanks.length === 0) {
    errors.push({
      field: "blanks",
      message: "At least one blank with acceptable answers is required",
    });
  } else {
    blanks.forEach((blank, index: number) => {
      const acceptedAnswers = blank.answers || [];
      if (acceptedAnswers.length === 0) {
        errors.push({
          field: "blanks",
          message: `Blank ${index + 1} must have at least one acceptable answer`,
        });
      } else {
        // Check if all answers have text
        const emptyAnswers = acceptedAnswers.filter(
          (answer: string) => !answer || answer.trim() === "",
        );
        if (emptyAnswers.length > 0) {
          errors.push({
            field: "blanks",
            message: `Blank ${index + 1} has empty acceptable answers`,
          });
        }
      }
    });
  }
}

function validateDescriptiveQuestion(
  questionData: DescriptiveData,
  errors: ValidationError[],
): void {
  // Only question text is required for descriptive questions
  // Sample answer, word limit, and grading criteria are optional

  // Optional: validate word limit if provided
  if (questionData.wordLimit !== undefined && questionData.wordLimit <= 0) {
    errors.push({
      field: "wordLimit",
      message: "Word limit must be a positive number",
    });
  }
}

function validateTrueFalseQuestion(
  questionData: TrueFalseData,
  errors: ValidationError[],
): void {
  // Must have a correct answer selected
  if (
    questionData.correctAnswer === null ||
    questionData.correctAnswer === undefined
  ) {
    errors.push({
      field: "correctAnswer",
      message: "Correct answer (True or False) must be selected",
    });
  }
}

function validateFileUploadQuestion(
  questionData: FileUploadData,
  errors: ValidationError[],
): void {
  const allowedFileTypes = questionData.allowedFileTypes || [];

  // Must have at least one allowed file type
  if (allowedFileTypes.length === 0) {
    errors.push({
      field: "allowedFileTypes",
      message: "At least one allowed file type is required",
    });
  }

  // Validate max file size
  if (!questionData.maxFileSize || questionData.maxFileSize <= 0) {
    errors.push({
      field: "maxFileSize",
      message: "Maximum file size must be specified and greater than 0",
    });
  }

  // Validate max files
  if (!questionData.maxFiles || questionData.maxFiles <= 0) {
    errors.push({
      field: "maxFiles",
      message: "Maximum number of files must be specified and greater than 0",
    });
  }
}
