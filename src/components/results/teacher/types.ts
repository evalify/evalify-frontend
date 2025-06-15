// Teacher-specific result types

export interface TeacherCourseOverview {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalStudents: number;
  totalTests: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  completionRate: number; // percentage of students who completed tests
  lastTestDate: string;
}

export interface TestOverview {
  testId: string;
  testName: string;
  courseName: string;
  courseCode: string;
  totalSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  medianScore: number;
  completionRate: number;
  createdAt: string;
  duration: number; // in minutes
}

export interface PerformanceDistribution {
  range: string; // e.g. "0-10", "11-20", etc.
  count: number;
  percentage: number;
  lowerBound?: number;
  color?: string;
}

export interface StudentTestResult {
  studentId: string;
  studentName: string;
  rollNumber: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeTaken: number; // in minutes
  completedAt: string;
  status: string;
  attemptCount: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  submittedAt: string;
}

export interface DetailedTestStatistics {
  testId: string;
  testName: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  totalQuestions: number;
  totalMarks: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  medianScore: number;
  standardDeviation: number;
  averageCompletionTime: number; // in minutes
  totalSubmissions: number;
  performanceDistribution: PerformanceDistribution[];
  studentResults: StudentTestResult[];
  questionStats: QuestionStat[];
}

export interface QuestionStat {
  questionId: string;
  questionNumber: number;
  questionText: string;
  questionType: string;
  difficulty: string;
  averageScore: number;
  correctPercentage: number;
  attemptedCount: number;
  skippedCount: number;
}
