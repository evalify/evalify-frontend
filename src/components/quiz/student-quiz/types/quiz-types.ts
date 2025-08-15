/**
 * Comprehensive types for student quiz interface
 * Following the exact schema from the API response without transformations
 */

// Base quiz information
export interface QuizInfo {
  quizId: string;
  quizName: string;
  calculator: boolean;
  kioskMode: boolean;
  fullScreen: boolean;
  autoSubmit: boolean;
  linearQuiz: boolean;
}

// Question option structure
export interface QuestionOption {
  id: string;
  text: string;
}

// Fill-up blank structure
export interface BlankId {
  id: number;
  type: string;
  sno: number;
}

// Match the following structures
export interface MatchKeyValue {
  id: string;
  text: string;
}

export interface MatchKeyValues {
  left: MatchKeyValue[];
  right: MatchKeyValue[];
}

// Test case structure for coding questions
export interface TestCase {
  code: string;
  tags: string;
  isMinimal: boolean;
  language: string;
}

// Topic structure
export interface Topic {
  id: string;
  name: string;
}

// Base question structure
export interface BaseQuestion {
  questionId: string;
  question: string;
  hint: string | null;
  marks: number;
  bloomsTaxonomy: string;
  co: number;
  difficulty: string;
  topics: Topic[];
}

// Question type interfaces
export interface TrueFalseQuestion extends BaseQuestion {
  type: "TRUE_FALSE";
}

export interface MCQQuestion extends BaseQuestion {
  type: "MCQ";
  options: QuestionOption[];
}

export interface MMCQQuestion extends BaseQuestion {
  type: "MMCQ";
  options: QuestionOption[];
}

export interface DescriptiveQuestion extends BaseQuestion {
  type: "DESCRIPTIVE";
}

export interface FillUpQuestion extends BaseQuestion {
  type: "FILL_UP";
  blankIds: BlankId[];
}

export interface MatchQuestion extends BaseQuestion {
  type: "MATCH";
  keyValues: MatchKeyValues;
}

export interface CodingQuestion extends BaseQuestion {
  type: "CODING";
  driverCode: string;
  language: string[];
  testcases: TestCase[];
}

export interface FileUploadQuestion extends BaseQuestion {
  type: "FILE_UPLOAD";
}

// Union type for all question types
export type Question =
  | TrueFalseQuestion
  | MCQQuestion
  | MMCQQuestion
  | DescriptiveQuestion
  | FillUpQuestion
  | MatchQuestion
  | CodingQuestion
  | FileUploadQuestion;

// Section structure
export interface Section {
  id: string;
  name: string;
}

// Question wrapper structure
export interface QuestionWrapper {
  questions: Question;
  section: Section;
  type: string;
}

// Violation log structure
export interface ViolationLog {
  type: string;
  message: string;
  timestamp: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

// Quiz question structure
export interface QuizQuestion {
  question: QuestionWrapper;
  response: QuizAnswerData | null;
}

// Quiz student info
export interface QuizStudentInfo {
  duration: number;
  endTime: string;
  startTime: string;
  violations: ViolationLog[];
  isViolated: boolean;
}

// Main quiz interface (API response structure)
export interface QuizInterface {
  quizInfo: QuizInfo;
  quizTags: string[];
  questions: QuizQuestion[];
  message: string;
  quizStudentInfo: QuizStudentInfo;
}

// Answer types for different question types
export interface FillUpAnswer {
  id: string;
  answer: string | null;
}

export interface MatchAnswer {
  leftPairId: string;
  rightPairId: string;
}

// Union type for all answer data types
export type QuizAnswerData =
  | string // Coding, Descriptive, File upload
  | boolean // True/False
  | string // MCQ (UUID)
  | string[] // MMCQ (List of UUIDs)
  | FillUpAnswer[] // Fill up
  | MatchAnswer[]; // Match the following

// Quiz answer update structure for API
export interface QuizAnswerUpdate {
  questionId: string;
  duration: number; // Duration spent on this question in milliseconds
  answer: QuizAnswerData;
}

// Local storage structure for quiz responses
export interface QuizResponse {
  questionId: string;
  answer: QuizAnswerData;
  timeSpent: number;
  lastUpdated: Date;
}

export interface QuizLocalStorage {
  quizId: string;
  responses: Record<string, QuizResponse>;
  currentQuestionIndex: number;
  totalTimeSpent: number;
  startTime: Date;
}

// Question navigation state
export interface QuestionNavigationState {
  currentIndex: number;
  totalQuestions: number;
  canNavigateBack: boolean;
  canNavigateForward: boolean;
  isLinearQuiz: boolean;
}

// Quiz timer state
export interface QuizTimerState {
  timeRemaining: number;
  isActive: boolean;
  autoSubmit: boolean;
}

// Question time tracking
export interface QuestionTimeTracker {
  questionId: string;
  startTime: Date;
  timeSpent: number;
  isActive: boolean;
}

// Question status for navigation
export interface QuestionStatus {
  questionId: string;
  isAnswered: boolean;
  isReviewed: boolean;
  isMarkedForReview: boolean;
  hasValidAnswer: boolean;
}

// Section navigation structure
export interface SectionNavigation {
  sectionId: string;
  sectionName: string;
  questions: QuestionNavigation[];
  totalQuestions: number;
  answeredQuestions: number;
  reviewedQuestions: number;
}

// Question navigation structure
export interface QuestionNavigation {
  questionId: string;
  questionNumber: number;
  questionType: string;
  sectionId: string;
  marks: number;
  status: QuestionStatus;
}

// Quiz navigation state
export interface QuizNavigationState {
  sections: SectionNavigation[];
  currentQuestionId: string;
  currentSectionId: string;
  totalQuestions: number;
  answeredQuestions: number;
  reviewedQuestions: number;
  markedForReview: number;
}
