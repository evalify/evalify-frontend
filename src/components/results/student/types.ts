// Student-specific types

import type { RecentTestResult, TestSummary } from "../common/types";

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

export interface CourseResult {
  courseId: string;
  courseName: string;
  courseCode: string;
  totalTests: number;
  completedTests: number;
  averageScore: number;
  highestScore: number;
  lastTestDate: string;
  testResults: TestSummary[];
}
