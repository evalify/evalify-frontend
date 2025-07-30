import { BaseQuestion } from "./base-question";

export interface CodingQuestion extends BaseQuestion {
  language: string;
  starterCode?: string;
  expectedOutput?: string;
  testCases?: {
    input: string;
    expectedOutput: string;
  }[];
}
