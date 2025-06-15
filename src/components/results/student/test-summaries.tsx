"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Target,
  FileText,
  Calendar,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import type { TestSummary } from "../common/types";
import { getScoreBgColor, getScoreTextColor } from "@/lib/utils/score-colors";

interface TestSummariesProps {
  courseName: string;
  courseCode: string;
  tests: TestSummary[];
  onBack: () => void;
  onViewTest: (testId: string) => void;
}

export function TestSummaries({
  courseName,
  courseCode,
  tests,
  onBack,
  onViewTest,
}: TestSummariesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300";
      case "hard":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

  const completedTests = tests.filter((test) => test.status === "completed");
  const averageScore =
    completedTests.length > 0
      ? completedTests.reduce((acc, test) => acc + test.percentage, 0) /
        completedTests.length
      : 0;

  // Sort tests by date (most recent first)
  const sortedTests = [...tests].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-card shadow-sm rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1.5 h-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {courseName}
              <Badge variant="secondary">{courseCode}</Badge>
            </h1>
          </div>
        </div>
        <Badge variant="outline" className="self-start sm:self-auto">
          {tests.length} {tests.length === 1 ? "Test" : "Tests"}
        </Badge>
      </div>
      {/* Course Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          {" "}
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </span>
              Average Score
            </CardTitle>{" "}
          </CardHeader>
          <CardContent className="pt-3">
            <div className="flex items-baseline">
              <span
                className={`text-2xl font-bold ${getScoreTextColor(averageScore)}`}
              >
                {averageScore.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          {" "}
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </span>
              Completion
            </CardTitle>{" "}
          </CardHeader>
          <CardContent className="pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {tests.length > 0
                  ? ((completedTests.length / tests.length) * 100).toFixed(0)
                  : 0}
                %
              </span>
              <span className="text-sm text-muted-foreground">
                ({completedTests.length}/{tests.length} tests)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          {" "}
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-violet-100 dark:bg-violet-900">
                <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </span>
              Best Performance
            </CardTitle>{" "}
          </CardHeader>
          <CardContent className="pt-3">
            {completedTests.length > 0 ? (
              <div className="flex items-baseline gap-2">
                {" "}
                <span
                  className={`text-2xl font-bold ${getScoreTextColor(Math.max(...completedTests.map((test) => test.percentage)))}`}
                >
                  {Math.max(
                    ...completedTests.map((test) => test.percentage),
                  ).toFixed(1)}
                  %
                </span>
                <span className="text-xs text-muted-foreground">
                  highest score
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">No completed tests</span>
            )}
          </CardContent>
        </Card>
      </div>{" "}
      {/* Performance Trends removed as requested */} {/* Tests List */}{" "}
      <Card className="shadow-sm">
        <CardHeader className="py-2 px-4 border-b">
          <CardTitle className="flex items-center justify-between text-lg">
            Test Results
            {completedTests.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                Click on a test to view detailed results
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {" "}
          {tests.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-muted-foreground">
                No tests available for this course
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {sortedTests.map((test) => (
                <div
                  key={test.testId}
                  className="py-3 px-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onViewTest(test.testId)}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{test.testName}</h3>
                        <Badge
                          variant="secondary"
                          className={getDifficultyColor(test.difficulty)}
                        >
                          {test.difficulty}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getStatusColor(test.status)}
                        >
                          {test.status === "completed"
                            ? "Completed"
                            : test.status === "in-progress"
                              ? "In Progress"
                              : "Not Started"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-blue-500" />
                          <span>
                            {new Date(test.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-purple-500" />
                          <span>{test.timeTaken} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3 text-emerald-500" />
                          <span>
                            {test.correctAnswers}/{test.questionCount} correct
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
                      {" "}
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 text-sm font-semibold ${getScoreBgColor(test.percentage)}`}
                      >
                        {test.score}/{test.maxScore} (
                        {test.percentage.toFixed(1)}%)
                      </Badge>{" "}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
