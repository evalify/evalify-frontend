// Question Types based on documentation
export enum QuestionTypes {
  MCQ = "MCQ",
  MMCQ = "MMCQ",
  TRUE_FALSE = "TRUE_FALSE",
  FILL_UP = "FILL_UP",
  MATCH_THE_FOLLOWING = "MATCH_THE_FOLLOWING",
  DESCRIPTIVE = "DESCRIPTIVE",
  FILE_UPLOAD = "FILE_UPLOAD",
  CODING = "CODING",
}

export enum Taxonomy {
  REMEMBER = "REMEMBER",
  UNDERSTAND = "UNDERSTAND",
  APPLY = "APPLY",
  ANALYSE = "ANALYSE",
  EVALUATE = "EVALUATE",
  CREATE = "CREATE",
}

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

// Base Question Interface - using backend format directly
export interface BaseQuestion {
  id?: string; // Optional for backend compatibility
  question: string;
  explanation?: string | null;
  hintText?: string | null; // Backend format
  markValue: number; // Backend format
  taxonomy: string; // Backend format
  coValue: number; // Backend format
  negativeMark?: number;
  difficultyLevel: string; // Backend format
  bank?: {
    id: string;
    name: string;
  };
  topics?: {
    id: string;
    name: string;
  }[];
}

// MCQ Option Interface - backend format
export interface MCQOption {
  id?: string | null; // Backend might send null
  text: string;
  isCorrect: boolean;
}

// Specific Question Types
export interface MCQQuestion extends BaseQuestion {
  type: QuestionTypes.MCQ;
  options: MCQOption[];
}

export interface MMCQQuestion extends BaseQuestion {
  type: QuestionTypes.MMCQ;
  options: MCQOption[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: QuestionTypes.TRUE_FALSE;
  answer: boolean;
}

export interface Blank {
  id: string;
  answers: string[];
}

export interface FillUpQuestion extends BaseQuestion {
  type: QuestionTypes.FILL_UP;
  strictMatch?: boolean;
  llmEval?: boolean | null;
  template?: string;
  blanks: Blank[];
}

export interface MatchPair {
  id?: string;
  leftPair: string;
  rightPair: string;
}

export interface MatchTheFollowingQuestion extends BaseQuestion {
  type: QuestionTypes.MATCH_THE_FOLLOWING;
  keys: MatchPair[];
}

export interface DescriptiveQuestion extends BaseQuestion {
  type: QuestionTypes.DESCRIPTIVE;
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;
}

export interface FileUploadQuestion extends BaseQuestion {
  type: QuestionTypes.FILE_UPLOAD;
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;
}

export interface FunctionParam {
  param: string; // Backend format
  type: string;
  description?: string;
}

export interface TestCase {
  id?: string;
  input: unknown[]; // Backend format
  expected: unknown; // Backend format
  isHidden?: boolean;
  points?: number;
}

export interface CodingQuestion extends BaseQuestion {
  type: QuestionTypes.CODING;
  driverCode?: string;
  boilerCode?: string;
  functionName?: string;
  returnType?: string;
  params?: FunctionParam[];
  testcases?: TestCase[];
  language?: string[];
  answer?: string;
}

// Union type for all questions
export type Question =
  | MCQQuestion
  | MMCQQuestion
  | TrueFalseQuestion
  | FillUpQuestion
  | MatchTheFollowingQuestion
  | DescriptiveQuestion
  | FileUploadQuestion
  | CodingQuestion;

// Component Configuration
export interface QuestionConfig {
  mode: "display" | "student" | "edit" | "review";
  showActions?: boolean;
  showExplanation?: boolean;
  showHint?: boolean;
  showMarks?: boolean;
  showTopics?: boolean;
  showDifficulty?: boolean;
  showBloomsTaxonomy?: boolean;
  shuffleOptions?: boolean;
  readOnly?: boolean;
  compact?: boolean;
  // For student mode - show user answers and correct answers
  userAnswers?: QuestionAnswer;
  showCorrectAnswers?: boolean;
  showUserAnswers?: boolean;
  showScore?: boolean;
  highlightCorrectness?: boolean; // Highlight correct/incorrect answers
}

// Action handlers
export interface QuestionActions {
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
  onEditMarks?: (questionId: string, newMarks: number) => void;
  onDuplicate?: (questionId: string) => void;
}

// Component Props
export interface QuestionRendererProps {
  question: Question;
  config: QuestionConfig;
  actions?: QuestionActions;
  onAnswerChange?: (answer: QuestionAnswer) => void;
  questionNumber?: number;
  className?: string;
}

// Answer types for different question types
export interface MCQAnswer {
  selectedOption: string;
  isCorrect?: boolean;
  score?: number;
}

export interface MMCQAnswer {
  selectedOptions: string[];
  correctOptions?: string[];
  score?: number;
}

export interface TrueFalseAnswer {
  answer: boolean;
  isCorrect?: boolean;
  score?: number;
}

export interface FillUpAnswer {
  blanks: { [blankId: string]: string };
  correctBlanks?: { [blankId: string]: string[] };
  score?: number;
}

export interface MatchTheFollowingAnswer {
  matches: { [leftId: string]: string };
  correctMatches?: { [leftId: string]: string };
  score?: number;
}

export interface DescriptiveAnswer {
  text: string;
  score?: number;
  feedback?: string;
}

export interface FileUploadAnswer {
  files: File[];
  score?: number;
  feedback?: string;
}

export interface CodingAnswer {
  code: string;
  language: string;
  score?: number;
  testResults?: {
    passed: number;
    total: number;
    details?: TestResult[];
  };
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: unknown[];
  expected: unknown;
  actual?: unknown;
  error?: string;
}

export type QuestionAnswer =
  | MCQAnswer
  | MMCQAnswer
  | TrueFalseAnswer
  | FillUpAnswer
  | MatchTheFollowingAnswer
  | DescriptiveAnswer
  | FileUploadAnswer
  | CodingAnswer;
