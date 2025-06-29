// Export all question creation components
export { default as QuestionCreationPage } from "./question-creation-page";
export { default as TopBar } from "./top-bar";
export { default as QuestionTypeSelector } from "./question-type-selector";
export { default as QuestionSettings } from "./question-settings";
export { default as QuestionEditor } from "./question-editor";

// Question type components
export { default as MCQQuestion } from "./question-types/mcq-question";
export { default as FillupQuestion } from "./question-types/fillup-question";
export { default as MatchFollowingQuestion } from "./question-types/match-following-question";
export { default as DescriptiveQuestion } from "./question-types/descriptive-question";
export { default as TrueFalseQuestion } from "./question-types/true-false-question";
export { default as CodingQuestion } from "./question-types/coding-question";
export { default as FileUploadQuestion } from "./question-types/file-upload-question";

// Export types
export type {
  QuestionType,
  QuestionData,
  QuestionCreationSettings,
  QuestionCreationPageProps,
  QuestionEditorProps,
  QuestionTypeSelectorProps,
  QuestionSettingsProps,
  ValidationError,
  ValidationResult,
  TopicOption,
} from "./question-creation-types";

export type {
  MCQOptionComponent,
  FillupBlankComponent,
  MatchItemComponent,
  TestCaseComponent,
} from "./question-editor";
