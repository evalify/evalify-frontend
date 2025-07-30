import { QuestionSettings } from "../settings-types/settings-types";
import { FileUpload } from "./file-upload";
import { MCQ } from "./mcq";

export interface BaseQuestion extends QuestionSettings {
  type: string;
  question: string;
  topicIds: string[];
  explanation?: string;
  hint?: string;
  marks: number;
}

export interface Question {
  question: MCQ | FileUpload;
}
