import { BaseQuestion } from "./base-question";

export enum BlankValueType {
  LOWERCASE = "LOWERCASE",
  UPPERCASE = "UPPERCASE",
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  STRING = "STRING",
}

export interface Blanks {
  id: string;
  answers: (string | number)[];
  type: BlankValueType;
}

export interface FillUpQuestion extends BaseQuestion {
  blanks: Blanks[];
  strictMatch: boolean;
  llmEval: boolean;
}
