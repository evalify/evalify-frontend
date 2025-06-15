// Re-export all components from the new structure
// Doing named exports to avoid name conflicts
export type {
  TestSummary,
  RecentTestResult,
  QuestionResult,
  DetailedTestResult,
  ResultsFilters,
} from "./common/types";
export { DetailedTestResultView } from "./common/detailed-test-result";

// Teacher exports
export type {
  TeacherCourseOverview,
  TestOverview,
  PerformanceDistribution,
  StudentTestResult,
  QuestionStat,
  DetailedTestStatistics,
} from "./teacher/types";
export {
  CoursesGrid,
  CourseTestsTable,
  CourseSummaryCard,
  QuestionStatsTable,
  RecentTestsCard as TeacherRecentTestsCard,
  StudentResultsTable,
  PerformanceDistributionChart,
} from "./teacher";

// Student exports
export type { StudentOverallResult, CourseResult } from "./student/types";
export {
  StudentOverviewCard,
  RecentTestsCard as StudentRecentTestsCard, // Restored export
  CourseResultsGrid,
  CourseCard,
  TestSummaries,
  PerformanceTrends,
} from "./student";
