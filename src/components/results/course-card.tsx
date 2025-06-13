"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { CourseResult } from "./types";

interface CourseCardProps {
  course: CourseResult;
  onViewCourse: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onViewCourse,
}) => {
  // We're using sorted data to calculate trends

  // Sort tests by completion date
  const sortedTests = [...(course.tests || [])].sort(
    (a, b) =>
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
  );

  const scores = sortedTests.map((test) => test.percentage);
  const averageScore =
    scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

  const latestScore = scores.length > 0 ? scores[scores.length - 1] : 0;

  // Get trend (improving, stable, declining)
  const getTrend = () => {
    if (scores.length < 2) return "Not enough data";

    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;

    if (diff >= 5) return "Improving";
    if (diff <= -5) return "Declining";
    return "Stable";
  };

  const trend = getTrend();
  const trendColor =
    trend === "Improving"
      ? "text-green-600"
      : trend === "Declining"
        ? "text-red-600"
        : "text-amber-600";

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader
        className="pb-3 cursor-pointer"
        onClick={() => onViewCourse(course.courseId)}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{course.courseName}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {course.courseCode}
            </Badge>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {course.completedTests}/{course.totalTests} tests
            </span>
          </div>
          <Progress
            value={(course.completedTests / course.totalTests) * 100}
            className="h-2"
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <div className="text-xs text-muted-foreground">Average</div>
            <div className="font-medium">{averageScore.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Latest</div>
            <div className="font-medium">{latestScore.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Highest</div>
            <div className="font-medium text-green-600">
              {course.highestScore.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Trend</div>
            <div className={`font-medium ${trendColor}`}>{trend}</div>
          </div>
        </div>

        {sortedTests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 mt-4">
            <p className="text-muted-foreground text-center mb-1">
              No test data available
            </p>
            <p className="text-xs text-muted-foreground/70 text-center">
              Complete tests to see performance
            </p>
          </div>
        )}

        {sortedTests.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="w-full text-xs text-muted-foreground mb-1">
              Recent tests:
            </div>
            {sortedTests
              .slice(-3)
              .reverse()
              .map((test) => (
                <Badge key={test.testId} variant="outline" className="text-xs">
                  {test.testName}: {test.percentage.toFixed(0)}%
                </Badge>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
