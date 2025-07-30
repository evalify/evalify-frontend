import { BaseQuestion } from "./base-question";

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQ extends BaseQuestion {
  options: MCQOption[];
}
