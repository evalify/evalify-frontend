import { BaseQuestion } from "./base-question";

export interface DescriptiveQuestion extends BaseQuestion {
  expectedAnswer: string;
  strictness: number;
  guidelines?: string;
}
