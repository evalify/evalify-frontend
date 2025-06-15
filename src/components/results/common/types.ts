// Common types for the results system - shared between student and teacher components

export interface TestSummary {
  testId: string;
  testName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeTaken: number;
  completedAt: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  correctAnswers: number;
  status: "completed" | "in-progress" | "not-started";
}

export interface RecentTestResult {
  testId: string;
  testName: string;
  courseName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeTaken: number; // in minutes
  completedAt: string;
  status: "completed" | "in-progress" | "not-started";
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  questionType: "mcq" | "fillup" | "true-false" | "descriptive" | "coding";
  marks: number;
  studentAnswer: string | string[] | boolean | Record<string, unknown>;
  correctAnswer: string | string[] | boolean | Record<string, unknown>;
  isCorrect: boolean;
  timeTaken: number;
  explanation?: string;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
}

export interface DetailedTestResult {
  testId: string;
  testName: string;
  courseName: string;
  courseId: string;
  courseCode: string;
  completedAt: string;
  timeSpent: number;
  score: number;
  maxScore: number;
  percentage: number;
  questionCount: number;
  correctCount: number;
  questions: QuestionResult[];
  passingScore?: number;
}

export interface ResultsFilters {
  courseId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  scoreRange?: {
    min: number;
    max: number;
  };
  status?: "completed" | "in-progress" | "not-started";
}
