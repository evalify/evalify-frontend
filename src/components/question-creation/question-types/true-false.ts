import { BaseQuestion } from "./base-question";

export interface TrueFalseQuestion extends BaseQuestion {
  type: "TRUEFALSE";
  answer: boolean;
}
