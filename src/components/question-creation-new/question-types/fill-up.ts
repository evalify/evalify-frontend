import { BaseQuestion } from "./base-question";

export interface Blanks {
  id: number;
  answers: string[];
}

export interface FillUpQuestion extends BaseQuestion {
  blanks: Blanks[];
  strictMatch: boolean;
  llmEval: boolean;
}
