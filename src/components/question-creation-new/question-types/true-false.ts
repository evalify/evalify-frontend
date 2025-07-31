import { BaseQuestion } from "./base-question";

export interface TrueFalseQuestion extends BaseQuestion {
  correctAnswer: boolean;
}
