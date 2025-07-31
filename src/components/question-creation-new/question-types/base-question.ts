import { QuestionSettings } from "../settings-types/settings-types";
import { FileUpload } from "./file-upload";
import { MCQ } from "./mcq";
import { DescriptiveQuestion } from "./descriptive-question";
import { FillUpQuestion } from "./fill-up";
import { CodingQuestion } from "./coding-questions";

export interface Topic {
  id: string;
  name: string;
}

export interface BaseQuestion extends QuestionSettings {
  type: string;
  question: string;
  explanation?: string;
  hint?: string;
  topics?: Topic[];
}

export type Question =
  | MCQ
  | FileUpload
  | DescriptiveQuestion
  | FillUpQuestion
  | CodingQuestion;
