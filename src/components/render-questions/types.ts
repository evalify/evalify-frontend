/**
 * Question types based on backend enum
 */
export enum QuestionTypes {
  MCQ = "MCQ",
  MMCQ = "MMCQ",
  TRUEFALSE = "TRUEFALSE",
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

/**
 * Topic interface as received from backend
 */
export interface Topic {
  id: string;
  name: string;
}

/**
 * Base question interface matching backend DTO structure exactly
 */
export interface BaseQuestion {
  question: string;
  questionId: string;
  hint?: string | null;
  marks: number;
  bloomsTaxonomy: string;
  co: number;
  difficulty: string;
  explanation?: string | null;
  type: string;
  topics: Topic[];
}

/**
 * MCQ Option interface matching backend structure
 */
export interface MCQOption {
  id: string | null;
  text: string;
  isCorrect: boolean;
}

/**
 * MCQ Question interface
 */
export interface MCQQuestion extends BaseQuestion {
  type: "MCQ";
  options: MCQOption[];
}

/**
 * MMCQ (Multiple MCQ) Question interface
 */
export interface MMCQQuestion extends BaseQuestion {
  type: "MMCQ";
  options: MCQOption[];
}

/**
 * True/False Question interface
 */
export interface TrueFalseQuestion extends BaseQuestion {
  type: "TRUEFALSE";
  answers: boolean;
}

/**
 * Blank interface for Fill Up questions matching new backend structure
 */
export interface Blank {
  id: number;
  type: "STRING" | "INTEGER";
  answers: string[];
  sno: number;
}

/**
 * Fill Up Question interface
 */
export interface FillUpQuestion extends BaseQuestion {
  type: "FILL_UP";
  blanks: Blank[];
  strictMatch?: boolean;
  llmEval?: boolean;
}

/**
 * Descriptive Question interface
 */
export interface DescriptiveQuestion extends BaseQuestion {
  type: "DESCRIPTIVE";
  expectedAnswer: string;
  strictness: number;
  guidelines: string;
}

/**
 * File Upload Question interface
 */
export interface FileUploadQuestion extends BaseQuestion {
  type: "FILE_UPLOAD";
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;
  allowedFileTypes?: string[];
  maxFileSize?: number;
}

/**
 * Key-Value pair for Match the Following questions
 */
export interface KeyValueItem {
  id: string;
  text: string;
}

/**
 * Key-Value structure for Match the Following questions
 */
export interface KeyValues {
  left: KeyValueItem[];
  right: KeyValueItem[];
}

/**
 * Match pair for storing correct answers
 */
export interface MatchPair {
  leftPair: string;
  rightPair: string[];
}

/**
 * Match the Following Question interface
 */
export interface MatchTheFollowingQuestion extends BaseQuestion {
  type: "MATCH_THE_FOLLOWING";
  keyValues: KeyValues;
  matchPair: MatchPair[] | null;
}

/**
 * Test case for coding questions
 */
export interface TestCase {
  code: string;
  tags: string;
  isMinimal: boolean;
  language: string;
}

/**
 * Coding Question interface
 */
export interface CodingQuestion extends BaseQuestion {
  type: "CODING";
  language: string[];
  driverCode: string;
  boilerCode: string;
  testcases: TestCase[];
}

/**
 * Union type for all supported questions
 */
export type Question =
  | MCQQuestion
  | MMCQQuestion
  | TrueFalseQuestion
  | FillUpQuestion
  | DescriptiveQuestion
  | FileUploadQuestion
  | MatchTheFollowingQuestion
  | CodingQuestion;

/**
 * Question with section info as received from backend
 */
export interface QuestionWithSection {
  question: Question;
  sectionId: string;
}

/**
 * Answer types for different question types
 */
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
  blanks: { [blankId: number]: string };
  correctBlanks?: { [blankId: number]: string[] };
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

export interface MatchTheFollowingAnswer {
  matches: { [leftPairId: string]: string[] };
  correctMatches?: { [leftPairId: string]: string[] };
  score?: number;
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
  testCase: TestCase;
  passed: boolean;
  output?: string;
  error?: string;
}

export type QuestionAnswer =
  | MCQAnswer
  | MMCQAnswer
  | TrueFalseAnswer
  | FillUpAnswer
  | DescriptiveAnswer
  | FileUploadAnswer
  | MatchTheFollowingAnswer
  | CodingAnswer;

/**
 * Component Configuration
 */
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

/**
 * Action handlers
 */
export interface QuestionActions {
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
  onEditMarks?: (questionId: string, newMarks: number) => void;
}

/**
 * Component Props
 */
export interface QuestionRendererProps {
  question: Question;
  config: QuestionConfig;
  actions?: QuestionActions;
  onAnswerChange?: (answer: QuestionAnswer) => void;
  questionNumber?: number;
  className?: string;
}
