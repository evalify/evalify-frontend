import { BaseQuestion } from "./base-question";

export interface TestCase {
  id: string;
  code: string;
  tags: "HIDDEN" | "SAMPLE";
  isMinimal: boolean;
  language: string;
}

export interface CodingQuestion extends BaseQuestion {
  language: string[];
  boilerCode?: string;
  driverCode?: string;
  answer: string;
  testcases: TestCase[];
}
