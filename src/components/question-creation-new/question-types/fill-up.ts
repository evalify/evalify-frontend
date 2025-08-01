import { BaseQuestion } from "./base-question";

export interface Blanks {
  id: string;
  answers: string[];
  type: string;
}

export interface FillUpQuestion extends BaseQuestion {
  blanks: Blanks[];
  strictMatch: boolean;
  llmEval: boolean;
}
