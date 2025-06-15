"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TestOverview } from "./types";
import { Calendar, Clock, Users, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Function to get badge color based on average score
const getScoreBadgeColor = (score: number): string => {
  if (score >= 90)
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (score >= 80)
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (score >= 70)
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  if (score >= 60)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
};

interface RecentTestsCardProps {
  tests: TestOverview[];
  onViewTest: (testId: string) => void;
}

export function RecentTestsCard({ tests, onViewTest }: RecentTestsCardProps) {
  // Filter to show only tests from the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentTests = tests
    .filter((test) => new Date(test.createdAt) >= sevenDaysAgo)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ) // Most recent first
    .slice(0, 3); // Show max 3 tests

  if (recentTests.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Tests (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center justify-center">
            <Clock className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <p className="text-muted-foreground">No tests in the last 7 days</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-3 bg-muted/30 border-b">
        <CardTitle className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          Recent Tests (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {recentTests.map((test) => {
            const testDate = new Date(test.createdAt);
            const timeAgo = formatDistanceToNow(testDate, { addSuffix: true });
            const scoreBadgeColor = getScoreBadgeColor(test.averageScore);

            return (
              <div
                key={test.testId}
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onViewTest(test.testId)}
              >
                <div className="flex flex-col space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-full">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{test.testName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {test.courseName} ({test.courseCode})
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-xs">{test.totalSubmissions}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className={`text-xs px-1.5 py-0 ${scoreBadgeColor}`}
                        >
                          {test.averageScore.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-purple-500" />
                        <span className="text-xs">{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
