import { QuestionSettings } from "../settings-types/settings-types";
import { FileUpload } from "./file-upload";
import { MCQ, MCQOption } from "./mcq";
import { DescriptiveQuestion } from "./descriptive-question";
import { FillUpQuestion } from "./fill-up";
import { CodingQuestion } from "./coding-questions";
import { MatchTheFollowing } from "./match-the-following";

export interface Topic {
  id: string;
  name: string;
}

export interface BaseQuestion
  extends QuestionSettings,
    Record<string, unknown> {
  type: string;
  question: string;
  explanation?: string;
  hint?: string;
  topics?: Topic[];
}

export interface UpdatePayload extends Record<string, unknown> {
  type?: string;
  question?: string;
  marks?: number;
  difficulty?: string;
  bloomsTaxonomy?: string;
  co?: number;
  negativeMarks?: number;
  topicIds?: string[];
  options?: MCQOption[];
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;
}

export type Question =
  | MCQ
  | FileUpload
  | DescriptiveQuestion
  | FillUpQuestion
  | MatchTheFollowing
  | CodingQuestion;
