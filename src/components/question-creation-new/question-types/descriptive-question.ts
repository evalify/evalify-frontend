import { BaseQuestion } from "./base-question";

export interface DescriptiveQuestion extends BaseQuestion {
  expectedAnswer: string;
  guidelines: string;
  strictness: number;
}
