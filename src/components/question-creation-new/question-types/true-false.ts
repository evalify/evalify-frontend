import { BaseQuestion } from "./base-question";

export interface TrueFalseQuestion extends BaseQuestion {
  answer: boolean;
}
