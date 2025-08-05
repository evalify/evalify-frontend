import { QuestionTypes, Difficulty } from "@/components/render-questions/types";
import { BankQuestion as RepoBankQuestion } from "@/repo/bank/bank";

// User types for banks
export interface BankUser {
  id: string;
  name: string;
  email: string;
}

// Bank schema with proper typing
export interface Bank {
  id: string;
  name: string;
  courseCode: string;
  semester: string;
  questions: number;
  topics: number;
  created_at: string;
  access: BankUser[];
}

// Bank topic interface
export interface BankTopic {
  id: string;
  name: string;
}

// API response types
export interface PaginatedBankResponse {
  content: Bank[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Bank question interface with proper typing
export interface BankQuestion {
  id?: string; // Optional to match repository
  questionId?: string; // Backend uses both id and questionId
  question: string;
  type: string; // Keep as string to match repository
  marks?: number;
  difficulty?: string;
  created_at?: string;
  topics?: BankTopic[];
  explanation?: string | null;
  hint?: string | null;
  bloomsTaxonomy?: string;
  co?: number;
  negativeMark?: number | null;

  // MCQ/MMCQ specific fields
  options?: Array<{
    id: string | null;
    text: string;
    isCorrect: boolean;
  }>;

  // TRUE/FALSE specific fields
  answers?: boolean;

  // CODING specific fields
  functionName?: string;
  returnType?: string;
  params?: Array<{
    param: string;
    type: string;
  }>;
  language?: string[];
  driverCode?: string;
  boilerCode?: string;
  testcases?: Array<{
    input: unknown[];
    expected: unknown;
    tags?: string;
    isMinimal?: boolean;
    language?: string;
  }>;
  answer?: string | null;

  // FILL_UP specific fields
  strictMatch?: boolean;
  llmEval?: boolean | null;
  template?: string;
  blanks?: Array<{
    id: string;
    answers: string[];
  }>;

  // DESCRIPTIVE specific fields
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;

  // MATCH_THE_FOLLOWING specific fields
  keys?: Array<{
    id?: string;
    leftPair: string;
    rightPair: string;
  }>;
}

// Filter types for quiz bank
export interface FilterCriteria {
  topic: string; // 'any' or topic ID
  difficulty: Difficulty | "any";
  questionType: QuestionTypes | "any";
  noOfQuestions: number;
}

export interface FilterEntity extends FilterCriteria {
  id: string;
  questions: RepoBankQuestion[]; // Use repo BankQuestion type
  isLoading: boolean;
}

// API DTOs
export interface AddQuestionsToQuizRequest {
  topicId?: string[] | null;
  bankId?: string[] | null;
  difficulty?: Difficulty[] | null;
  questionType?: QuestionTypes[] | null;
  noOfQuestions?: number | null;
}

export interface AddBankQuestionToQuizRequest {
  sectionId: string;
  bankQuestionId: string[];
}

export interface QuizQuestionAddResponse {
  message: string;
  addedQuestionsCount: number;
  totalQuestions: number;
}

// Copy/Move operations
export interface CopyBankQuestionRequest {
  bankId: string;
  questionIds: string[];
  move: boolean;
  createNewTopic: boolean;
}

// Shared users
export interface SharedUser {
  user: BankUser;
  tag: string;
}

export interface SharedUsersResponse {
  sharedUsers: SharedUser[];
}

// Search and sort types
export type ViewMode = "cards" | "table";
export type SortField =
  | "name"
  | "courseCode"
  | "semester"
  | "questions"
  | "topics"
  | "created_at";
export type SortOrder = "asc" | "desc";

// Component state types
export interface BankSelectionState {
  searchTerm: string;
  viewMode: ViewMode;
  sortField: SortField;
  sortOrder: SortOrder;
  semesterFilter: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}
