"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CourseResult } from "./types";
import { TestSummary } from "../common/types";
import { getScoreBgColor, getScoreTextColor } from "@/lib/utils/score-colors";

interface CourseCardProps {
  course: CourseResult;
  onViewCourse: (courseId: string) => void;
  onViewTest?: (testId: string) => void;
}

export function CourseCard({
  course,
  onViewCourse,
  onViewTest,
}: CourseCardProps) {
  // Calculate average score
  const averageScore = course.testResults.length
    ? course.testResults.reduce(
        (sum: number, test: TestSummary) => sum + test.percentage,
        0,
      ) / course.testResults.length
    : 0;
  // No longer needed - best score removed
  // Sort tests by completion date (most recent first) and get top 3
  const recentTests = [...course.testResults]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onViewCourse(course.courseId)}
    >
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2">
          <div className="truncate flex-1 leading-normal py-1 mr-3 overflow-visible">
            {course.courseName}
          </div>
          <Badge variant="secondary" className="shrink-0 whitespace-nowrap">
            {course.courseCode}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-5">
          {/* Progress and Stats */}
          <div>
            {/* Average Score - Emphasized */}
            <div className="flex flex-col items-center justify-center mb-3">
              <div className="text-sm text-muted-foreground mb-1">
                Average Score
              </div>
              <div
                className={`text-2xl font-bold ${getScoreTextColor(averageScore)}`}
              >
                {averageScore.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {course.completedTests} of {course.totalTests} tests completed
              </div>
            </div>
          </div>
          {/* Recent Tests */}
          {recentTests.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Tests</h4>
              <div className="space-y-2">
                {recentTests.map((test) => (
                  <div
                    key={test.testId}
                    className="flex items-center justify-between p-2 rounded-md border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onViewTest) onViewTest(test.testId);
                    }}
                  >
                    <div className="truncate mr-2">
                      <div className="text-xs font-medium truncate">
                        {test.testName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(test.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getScoreBgColor(test.percentage)} text-xs shrink-0`}
                    >
                      {test.score}/{test.maxScore} ({test.percentage.toFixed(1)}
                      %)
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
