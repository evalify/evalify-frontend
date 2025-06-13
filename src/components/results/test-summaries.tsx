"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  Target,
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { TestSummary } from "./types";
import { PerformanceTrends } from "./performance-trends";

interface TestSummariesProps {
  courseName: string;
  courseCode: string;
  tests: TestSummary[];
  onBack: () => void;
  onViewTest: (testId: string) => void;
}

export const TestSummaries: React.FC<TestSummariesProps> = ({
  courseName,
  courseCode,
  tests,
  onBack,
  onViewTest,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const completedTests = tests.filter((test) => test.status === "completed");
  const averageScore =
    completedTests.length > 0
      ? completedTests.reduce((acc, test) => acc + test.percentage, 0) /
        completedTests.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{courseName}</h1>
            <p className="text-muted-foreground">{courseCode}</p>
          </div>
        </div>
        <Badge variant="outline">{tests.length} Tests</Badge>
      </div>

      {/* Performance Trends */}
      <PerformanceTrends tests={completedTests} courseName={courseName} />

      {/* Course Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              Average Score
            </div>
            <div
              className={`text-2xl font-bold ${getScoreColor(averageScore)}`}
            >
              {averageScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4" />
              Completed Tests
            </div>
            <div className="text-2xl font-bold">
              {completedTests.length}/{tests.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Best Score
            </div>
            <div className="text-2xl font-bold text-green-600">
              {completedTests.length > 0
                ? Math.max(...completedTests.map((t) => t.percentage)).toFixed(
                    1,
                  )
                : "0"}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tests found for this course</p>
              </div>
            ) : (
              tests.map((test) => (
                <div
                  key={test.testId}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{test.testName}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={getDifficultyColor(test.difficulty)}
                        >
                          {test.difficulty}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(test.status)}
                        >
                          {test.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {test.questionCount} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {test.timeTaken}m
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {test.correctAnswers} correct
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(test.completedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {test.status === "completed" && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3" />
                          <span
                            className={`font-medium ${getScoreColor(test.percentage)}`}
                          >
                            {test.score}/{test.maxScore} ({test.percentage}%)
                          </span>
                        </div>
                        <Progress
                          value={test.percentage}
                          className="flex-1 max-w-48"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewTest(test.testId)}
                    className="ml-4"
                    disabled={test.status !== "completed"}
                  >
                    {test.status === "completed"
                      ? "View Details"
                      : "Not Available"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
