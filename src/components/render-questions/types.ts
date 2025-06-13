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

// Base Question Interface
export interface BaseQuestion {
  id: string;
  question: string;
  explanation?: string;
  hint?: string;
  marks: number;
  bloomsTaxonomy: Taxonomy;
  co: number;
  negativeMark?: number;
  difficulty: Difficulty;
  bank?: {
    id: string;
    name: string;
  };
  topics?: {
    id: string;
    name: string;
  }[];
}

// MCQ Option Interface
export interface MCQOption {
  id: string;
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
  strictMatch: boolean;
  llmEval: boolean;
  template?: string;
  blanks: Blank[];
}

export interface MatchPair {
  id: string;
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
  name: string;
  type: string;
  description?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
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
  mode: "display" | "student" | "edit";
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
}

export interface MMCQAnswer {
  selectedOptions: string[];
}

export interface TrueFalseAnswer {
  answer: boolean;
}

export interface FillUpAnswer {
  blanks: { [blankId: string]: string };
}

export interface MatchTheFollowingAnswer {
  matches: { [leftId: string]: string };
}

export interface DescriptiveAnswer {
  text: string;
}

export interface FileUploadAnswer {
  files: File[];
}

export interface CodingAnswer {
  code: string;
  language: string;
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
