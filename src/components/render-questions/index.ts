export { QuestionRenderer } from "./question-renderer";
export * from "./types";

// Individual renderers for custom usage
export { MCQRenderer } from "./question-types/mcq-renderer";
export { MMCQRenderer } from "./question-types/mmcq-renderer";
export { TrueFalseRenderer } from "./question-types/true-false-renderer";
export { MatchTheFollowingRenderer } from "./question-types/match-the-following-renderer";
export { DescriptiveRenderer } from "./question-types/descriptive-renderer";
export { CodingRenderer } from "./question-types/coding-renderer";
export { default as FillUpRenderer } from "./question-types/fill-up-renderer";
export { default as FileUploadRenderer } from "./question-types/file-upload-renderer";
