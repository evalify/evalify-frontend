"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopBar from "@/components/question_creation/top-bar";
import {
  StudentRecentTestsCard,
  CourseResultsGrid,
  TestSummaries,
  StudentOverallResult,
  CourseResult,
  TestSummary,
} from "@/components/results";
import { MockResultsAPI } from "@/lib/results-api";

export default function StudentResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<
    "overview" | "course" | "tests"
  >("overview");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentOverallResult | null>(
    null,
  );
  const [courseResults, setCourseResults] = useState<CourseResult[]>([]);
  const [testSummaries, setTestSummaries] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define functions before useEffect hooks
  const loadInitialData = React.useCallback(async () => {
    // Use a mock student ID since we're not requiring login
    const mockStudentId = "student-1";

    setLoading(true);
    setError(null);

    try {
      // Load both student overview and course results in parallel
      const [overview, courses] = await Promise.all([
        MockResultsAPI.getStudentOverview(mockStudentId),
        MockResultsAPI.getCourseResults(mockStudentId),
      ]);

      setStudentData(overview);
      setCourseResults(courses);
    } catch (err) {
      console.error("Failed to load results data:", err);
      setError("Failed to load results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTestSummaries = React.useCallback(async (courseId: string) => {
    // Use a mock student ID since we're not requiring login
    const mockStudentId = "student-1";

    setLoading(true);
    try {
      const tests = await MockResultsAPI.getTestSummaries(
        mockStudentId,
        courseId,
      );
      setTestSummaries(tests);
    } catch (err) {
      console.error("Failed to load test summaries:", err);
      setError("Failed to load test summaries. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle URL parameters for navigation
  useEffect(() => {
    const view = searchParams.get("view");
    const courseId = searchParams.get("courseId");

    if (view === "course" && courseId) {
      setCurrentView("course");
      setSelectedCourseId(courseId);
      loadTestSummaries(courseId);
    } else if (view === "tests" && courseId) {
      setCurrentView("tests");
      setSelectedCourseId(courseId);
      loadTestSummaries(courseId);
    } else {
      setCurrentView("overview");
      setSelectedCourseId(null);
    }
  }, [searchParams, loadTestSummaries]);

  // Load initial data
  useEffect(() => {
    // Load data immediately without waiting for session
    loadInitialData();
  }, [loadInitialData]);
  const handleViewCourse = (courseId: string) => {
    router.push(`/student-results?view=course&courseId=${courseId}`);
  };

  const handleViewTest = (testId: string) => {
    router.push(`/student-results/test/${testId}`);
  };
  const handleBack = () => {
    if (currentView === "course") {
      router.push("/student-results");
    }
  };

  const selectedCourse = courseResults.find(
    (course) => course.courseId === selectedCourseId,
  );

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Results
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={loadInitialData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-muted-foreground">No results data available</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {currentView === "overview" && (
          <>
            {/* Student Overview */}
            <div>
              <h1 className="text-3xl font-bold mb-2">My Results</h1>
              <p className="text-muted-foreground mb-4">
                Track your academic performance and progress
              </p>
              {/* Overview cards removed as requested */}
            </div>{" "}
            {/* Recent Tests */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recent Tests</h2>
              <StudentRecentTestsCard
                studentId={studentData.studentId || "current-student"}
                tests={studentData.recentTests}
                onViewTest={handleViewTest}
                showHeader={false}
              />
            </div>
            {/* Course Results */}
            <div>
              <h2 className="text-xl font-bold mb-4">Course Results</h2>
              <CourseResultsGrid
                courses={courseResults}
                onViewCourse={handleViewCourse}
                onViewTest={handleViewTest}
              />
            </div>
          </>
        )}
        {currentView === "course" && selectedCourse && (
          <TestSummaries
            courseName={selectedCourse.courseName}
            courseCode={selectedCourse.courseCode}
            tests={testSummaries}
            onBack={handleBack}
            onViewTest={handleViewTest}
          />
        )}
      </div>
    </div>
  );
}
