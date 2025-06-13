"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, Calendar } from "lucide-react";
import { RecentTestResult } from "./types";

interface RecentTestsCardProps {
  tests: RecentTestResult[];
  onViewTest: (testId: string) => void;
}

export const RecentTestsCard: React.FC<RecentTestsCardProps> = ({
  tests,
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
  }; // We use the status color instead of score color for this component

  // Filter to show only tests from the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const displayTests = tests
    .filter((test) => new Date(test.completedAt) >= sevenDaysAgo)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    ) // Most recent first
    .slice(0, 3); // Show max 3 tests

  return (
    <Card>
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-base flex items-center justify-between">
          {" "}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recent Tests (Last 7 Days)
          </div>
          <Badge variant="outline" className="text-xs">
            {displayTests.length} Tests
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {tests.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {" "}
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tests in the last 7 days</p>
            </div>
          ) : (
            displayTests.map((test) => (
              <div
                key={test.testId}
                className="flex items-center justify-between py-2 px-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate pr-2">
                      {test.testName}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusColor(test.status)}`}
                    >
                      {test.status === "completed"
                        ? `${test.percentage}%`
                        : test.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {test.courseName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(test.completedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {test.status === "completed" && (
                    <div className="flex items-center gap-0 mt-1">
                      <Progress
                        value={test.percentage}
                        className="flex-1 h-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewTest(test.testId)}
                        className="h-6 w-6 ml-1"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {tests.length > 0 && (
        <CardFooter className="pt-1 pb-2 px-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => onViewTest(tests[0].testId)}
          >
            View All Test Results
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
