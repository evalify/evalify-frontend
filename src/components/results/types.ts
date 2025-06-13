// Types for the results system

export interface StudentOverallResult {
  studentId: string;
  studentName: string;
  totalTests: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalTimeTaken: number; // in minutes
  recentTests: RecentTestResult[];
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

export interface CourseResult {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalTests: number;
  completedTests: number;
  averageScore: number;
  highestScore: number;
  lastTestDate: string;
  tests: TestSummary[];
}

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

export interface DetailedTestResult {
  testId: string;
  testName: string;
  courseName: string;
  courseCode: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeTaken: number;
  totalTime: number; // allocated time
  completedAt: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuestionResult[];
  summary: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unanswered: number;
    timePerQuestion: number; // average time per question
  };
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

export interface ResultsFilters {
  courseId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: "all" | "completed" | "in-progress";
  sortBy?: "date" | "score" | "name";
  sortOrder?: "asc" | "desc";
}
