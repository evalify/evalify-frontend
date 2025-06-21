"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopBar from "@/components/question_creation/top-bar";
import {
  TeacherCourseOverview,
  TestOverview,
  DetailedTestStatistics,
} from "@/components/results/teacher/types";
import { MockTeacherResultsAPI } from "@/lib/results-api";
import {
  CoursesGrid,
  RecentTestsCard,
  CourseTestsTable,
  PerformanceDistributionChart,
  StudentResultsTable,
  QuestionStatsTable,
  SortOption,
  SortDropdown,
} from "@/components/results/teacher";
import { DetailedTestResultView } from "@/components/results/common/detailed-test-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  Users,
  Award,
  BookOpen,
  Clock,
  FileBarChart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function TeacherResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<
    "overview" | "course" | "test" | "student-detail"
  >("overview");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  const [coursesList, setCoursesList] = useState<TeacherCourseOverview[]>([]);
  const [recentTests, setRecentTests] = useState<TestOverview[]>([]);
  const [courseTests, setCourseTests] = useState<TestOverview[]>([]);
  const [testStatistics, setTestStatistics] =
    useState<DetailedTestStatistics | null>(null);
  const [courseSortOption, setCourseSortOption] =
    useState<SortOption>("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data (courses and recent tests)
  const loadInitialData = React.useCallback(async () => {
    const mockTeacherId = "teacher-1"; // In a real app, get from auth context

    setLoading(true);
    setError(null);

    try {
      // Load both teacher courses and recent tests in parallel
      const [courses, tests] = await Promise.all([
        MockTeacherResultsAPI.getTeacherCourses(mockTeacherId),
        MockTeacherResultsAPI.getRecentTests(mockTeacherId, 3),
      ]);

      setCoursesList(courses);
      setRecentTests(tests);
    } catch (err) {
      console.error("Failed to load teacher results data:", err);
      setError("Failed to load results. Please try again.");
      toast.error("Failed to load results data", {
        description: "Failed to load results. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load course tests when a course is selected
  const loadCourseTests = React.useCallback(async (courseId: string) => {
    setLoading(true);

    try {
      const tests = await MockTeacherResultsAPI.getCourseTests(courseId);
      setCourseTests(tests);
    } catch (err) {
      console.error("Failed to load course tests:", err);
      setError("Failed to load course tests. Please try again.");
      toast.error("Failed to load course tests", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load test statistics when a test is selected
  const loadTestStatistics = React.useCallback(async (testId: string) => {
    setLoading(true);

    try {
      const stats = await MockTeacherResultsAPI.getTestStatistics(testId);
      setTestStatistics(stats);
    } catch (err) {
      console.error("Failed to load test statistics:", err);
      setError("Failed to load test statistics. Please try again.");
      toast.error("Failed to load test statistics", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle navigation from URL parameters
  useEffect(() => {
    const view = searchParams.get("view");
    const courseId = searchParams.get("courseId");
    const testId = searchParams.get("testId");

    if (view === "test" && testId) {
      setCurrentView("test");
      setSelectedTestId(testId);
      loadTestStatistics(testId);
    } else if (view === "course" && courseId) {
      setCurrentView("course");
      setSelectedCourseId(courseId);
      loadCourseTests(courseId);
    } else {
      setCurrentView("overview");
      setSelectedCourseId(null);
      setSelectedTestId(null);
    }
  }, [searchParams, loadCourseTests, loadTestStatistics]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Navigation handlers
  const handleViewCourse = (courseId: string) => {
    router.push(`/teacher-results?view=course&courseId=${courseId}`);
  };

  const handleViewTest = (testId: string) => {
    router.push(`/teacher-results?view=test&testId=${testId}`);
  };
  const handleBack = () => {
    if (currentView === "student-detail") {
      setCurrentView("test");
      setSelectedStudentId(null);
    } else if (currentView === "test" && selectedCourseId) {
      router.push(`/teacher-results?view=course&courseId=${selectedCourseId}`);
    } else {
      router.push("/teacher-results");
    }
  };
  const handleViewStudentResult = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentView("student-detail");
  };

  // Find selected course
  const selectedCourse = coursesList.find(
    (course) => course.courseId === selectedCourseId,
  );
  // Use the selected test ID in a meaningful way - creating document title
  // and displaying test ID for debugging purposes when in test view
  useEffect(() => {
    // Update document title based on the current view
    if (currentView === "test" && selectedTestId && testStatistics) {
      document.title = `Test: ${testStatistics.testName} | Teacher Results`;
      console.log(`Viewing test with ID: ${selectedTestId}`);
    } else if (currentView === "course" && selectedCourse) {
      document.title = `Course: ${selectedCourse.courseName} | Teacher Results`;
    } else {
      document.title = "Teacher Results Dashboard";
    }

    return () => {
      document.title = "Evalify";
    };
  }, [currentView, selectedTestId, selectedCourse, testStatistics]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Results
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={loadInitialData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <TopBar />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Page */}
        {currentView === "overview" && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileBarChart className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">Test Results & Analytics</h1>
              </div>
              <p className="text-muted-foreground ml-12">
                Monitor student performance and test statistics across all your
                courses
              </p>
              <div className="mt-4 h-1 w-24 bg-primary rounded-full ml-12"></div>
            </div>
            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Students
                    </p>
                    <p className="text-2xl font-semibold">
                      {coursesList.reduce(
                        (sum, course) => sum + course.totalStudents,
                        0,
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Courses
                    </p>
                    <p className="text-2xl font-semibold">
                      {coursesList.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-full">
                    <Award className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg Course Score
                    </p>
                    <p className="text-2xl font-semibold">
                      {coursesList.length > 0
                        ? (
                            coursesList.reduce(
                              (sum, course) => sum + course.averageScore,
                              0,
                            ) / coursesList.length
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-purple-500/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Recent Tests
                    </p>
                    <p className="text-2xl font-semibold">
                      {recentTests.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Recent Tests */}
            <div className="mb-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Recent Tests</h2>
              </div>
              <p className="text-sm text-muted-foreground ml-7 mb-4">
                Recently administered tests across all courses
              </p>
            </div>
            <RecentTestsCard tests={recentTests} onViewTest={handleViewTest} />
            {/* All Courses */}
            <div className="mt-8 mb-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Your Courses</h2>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    Sort by:
                  </span>
                  <SortDropdown
                    value={courseSortOption || "latest"}
                    onChange={(value) => setCourseSortOption(value)}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground ml-7 mb-4">
                Performance analytics for all your courses
              </p>
            </div>
            <CoursesGrid
              courses={coursesList}
              onViewCourse={handleViewCourse}
              sortBy={courseSortOption}
            />
          </>
        )}

        {/* Course Page */}
        {currentView === "course" && selectedCourse && (
          <>
            <div>
              <Button
                variant="ghost"
                className="mb-4 pl-1 flex items-center gap-1"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" /> Back to Overview
              </Button>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {selectedCourse.courseName}
                </h1>
                <p className="text-muted-foreground">
                  {selectedCourse.courseCode} • Performance Analytics
                </p>
                <div className="mt-4 h-1 w-24 bg-primary rounded-full"></div>
              </div>
            </div>
            {/* Course Summary Card */}
            <Card className="mb-6 border border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-2">
                <CardTitle>Course Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-10 w-10 text-blue-600 p-1.5 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-300" />
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="text-xl font-semibold">
                        {selectedCourse.totalStudents}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-10 w-10 text-emerald-600 p-1.5 bg-emerald-100 rounded-full dark:bg-emerald-900/30 dark:text-emerald-300" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tests</p>
                      <p className="text-xl font-semibold">
                        {selectedCourse.totalTests}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-10 w-10 text-amber-600 p-1.5 bg-amber-100 rounded-full dark:bg-amber-900/30 dark:text-amber-300" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Average Score
                      </p>
                      <p className="text-xl font-semibold">
                        {selectedCourse.averageScore.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-10 w-10 text-purple-600 p-1.5 bg-purple-100 rounded-full dark:bg-purple-900/30 dark:text-purple-300" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Completion Rate
                      </p>
                      <p className="text-xl font-semibold">
                        {selectedCourse.completionRate}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Course Tests */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-0">Test History</h2>
                  <p className="text-sm text-muted-foreground">
                    All tests administered for this course
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <CourseTestsTable
                  tests={courseTests}
                  onViewTest={handleViewTest}
                />
              </div>
            </div>
          </>
        )}

        {/* Test Details Page */}
        {currentView === "test" && testStatistics && (
          <>
            <div>
              <Button
                variant="ghost"
                className="mb-4 pl-1 flex items-center gap-1"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" /> Back to Course
              </Button>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {testStatistics.testName}
                </h1>
                <p className="text-muted-foreground">
                  {testStatistics.courseName} ({testStatistics.courseCode}) •
                  Test Analytics
                </p>
                <div className="mt-4 h-1 w-24 bg-primary rounded-full"></div>
              </div>
            </div>
            {/* Test Summary */}
            <Card className="mb-6 border border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-2">
                <CardTitle>Test Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Award className="h-10 w-10 text-amber-600 p-1.5 bg-amber-100 rounded-full dark:bg-amber-900/30 dark:text-amber-300" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Average Score
                      </p>
                      <p className="text-xl font-semibold">
                        {testStatistics.averageScore.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-10 w-10 text-blue-600 p-1.5 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-300" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Submissions
                      </p>
                      <p className="text-xl font-semibold">
                        {testStatistics.totalSubmissions}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileBarChart className="h-10 w-10 text-emerald-600 p-1.5 bg-emerald-100 rounded-full dark:bg-emerald-900/30 dark:text-emerald-300" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        High / Low
                      </p>
                      <p className="text-xl font-semibold">
                        {testStatistics.highestScore}% /
                        {testStatistics.lowestScore}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-10 w-10 text-purple-600 p-1.5 bg-purple-100 rounded-full dark:bg-purple-900/30 dark:text-purple-300" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Median Score
                      </p>
                      <p className="text-xl font-semibold">
                        {testStatistics.medianScore}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Performance Distribution Chart */}
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Score Distribution</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Student performance across different score ranges
              </p>
            </div>
            <PerformanceDistributionChart statistics={testStatistics} />
            <Separator className="my-8" />
            {/* Student Results Table */}
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Student Performance</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Individual student scores and statistics
              </p>
            </div>
            <StudentResultsTable
              statistics={testStatistics}
              onViewStudentResult={handleViewStudentResult}
            />
            <Separator className="my-8" />
            {/* Question Stats Table */}
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Question Analysis</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Performance metrics for each question on the test
              </p>
            </div>
            <QuestionStatsTable statistics={testStatistics} />
          </>
        )}

        {currentView === "student-detail" && selectedStudentId && (
          <DetailedTestResultView onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
