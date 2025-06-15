"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Timer } from "lucide-react";
import type { RecentTestResult } from "../common/types";
import { getScoreBgColor } from "@/lib/utils/score-colors";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentTestResults } from "@/repo/student-results/student-results-api";

interface RecentTestsCardProps {
  studentId: string;
  limit?: number;
  tests?: RecentTestResult[];
  onViewTest: (testId: string) => void;
  showHeader?: boolean;
}

// Ensure this component is properly exported
export const RecentTestsCard: React.FC<RecentTestsCardProps> = ({
  studentId,
  limit = 3,
  tests: propTests,
  onViewTest,
  showHeader = true,
}) => {
  // Use our custom React Query hook if studentId is provided, otherwise use prop tests
  const {
    data: queryTests,
    isLoading,
    isError,
  } = useRecentTestResults(studentId, limit, {
    enabled: !!studentId && !propTests,
  });

  // Use either provided tests from props or fetched tests from query
  const tests = propTests || queryTests || [];

  // Sort tests by completion date (most recent first)
  const sortedTests = [...tests].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );

  // Show only the specified limit (default 3)
  const recentTests = sortedTests.slice(0, limit);

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        {showHeader && (
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-semibold">
              Recent Tests
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="py-3 px-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="shadow-sm">
        {showHeader && (
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-semibold">
              Recent Tests
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">Failed to load test results</p>
        </CardContent>
      </Card>
    );
  }

  if (recentTests.length === 0) {
    return (
      <Card className="shadow-sm">
        {showHeader && (
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-semibold">
              Recent Tests
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">No tests completed yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      {showHeader && (
        <CardHeader className="py-2 px-4 border-b">
          <CardTitle className="text-lg font-semibold">Recent Tests</CardTitle>
        </CardHeader>
      )}
      <CardContent className={`p-0 ${!showHeader ? "pt-0" : ""}`}>
        <div className="divide-y">
          {recentTests.map((test) => (
            <div
              key={test.testId}
              className="py-3 px-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => onViewTest(test.testId)}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-medium pr-2 leading-normal line-clamp-1 overflow-visible">
                  {test.testName}
                </h3>
                <Badge
                  variant="outline"
                  className={`${getScoreBgColor(test.percentage)} text-xs px-2 py-0.5 font-medium shrink-0`}
                >
                  {test.score}/{test.maxScore} ({test.percentage.toFixed(1)}%)
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="mr-1 h-3 w-3" />
                  {test.courseName}
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(test.completedAt).toLocaleDateString()}
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Timer className="h-3 w-3 mr-1" />
                  {test.timeTaken} min
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
