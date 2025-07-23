// Quiz-related type definitions
import { Difficulty, QuestionTypes } from "@/components/render-questions/types";

// DTO to match your backend AddQuestionsToQuizDTO
export interface AddQuestionsToQuizDTO {
  topicId?: string[] | null;
  bankId?: string[] | null;
  difficulty?: Difficulty[] | null;
  questionType?: QuestionTypes[] | null;
  noOfQuestions?: number | null;
}

// Frontend filter state (uses "any" strings)
export interface QuestionFilters {
  bank: string;
  topic: string;
  difficulty: string;
  questionType: string;
  courseOutcome: string;
  bloomsTaxonomy: string;
  marks: string;
  numQuestions: string;
}

// Response from backend filterBankQuestionsToQuiz
export interface BankQuestionsReturnDTO {
  id: string;
  question: string;
  explanation?: string | null;
  hint?: string | null;
  marks: number;
  bloomsTaxonomy: string;
  co: number;
  negativeMark?: number | null;
  difficulty: string;
  topics?: Array<{ id: string; name: string }>;
  questionType: string;
  type: string;
  // Add other fields as needed based on your backend response
}
