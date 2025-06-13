"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestSummary } from "./types";

interface PerformanceTrendsProps {
  tests: TestSummary[];
  courseName: string;
}

export const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({
  tests,
  courseName,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort tests by completion date
  const sortedTests = [...tests].sort(
    (a, b) =>
      new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
  );

  const scores = sortedTests.map((test) => test.percentage);

  // Calculate stats
  const averageScore =
    scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

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

  if (tests.length === 0) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
          <h4 className="text-sm font-medium">Performance Trends</h4>
        </div>
        <div className="flex flex-col items-center justify-center py-6 bg-muted/10">
          <p className="text-muted-foreground text-center mb-2">
            No test data available for {courseName}
          </p>
          <p className="text-xs text-muted-foreground/70 text-center">
            Complete tests in this course to see performance trends
          </p>
        </div>
      </div>
    );
  }

  const trend = getTrend();
  const trendColor =
    trend === "Improving"
      ? "text-green-600"
      : trend === "Declining"
        ? "text-red-600"
        : "text-amber-600";

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div
        className="p-3 border-b bg-muted/30 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-sm font-medium">Performance Trends</h4>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Always show summary stats */}
      <div className="p-4 pb-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Average Score</div>
            <div className="text-lg font-medium">
              {averageScore.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Latest Score</div>
            <div className="text-lg font-medium">{latestScore.toFixed(1)}%</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Highest Score</div>
            <div className="text-lg font-medium text-green-600">
              {highestScore.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Trend</div>
            <div className={`text-lg font-medium ${trendColor}`}>{trend}</div>
          </div>
        </div>
      </div>

      {/* Collapsible details section */}
      {isExpanded && (
        <div className="p-4 pt-2 space-y-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Lowest Score</div>
            <div className="text-sm font-medium text-red-600">
              {lowestScore.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground mb-1">
              Test History
            </div>
            <div className="flex flex-wrap gap-2">
              {sortedTests.map((test, index) => (
                <Badge key={test.testId} variant="outline" className="text-xs">
                  Quiz {index + 1}: {test.percentage.toFixed(0)}% -{" "}
                  {test.testName}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <div className="text-xs text-muted-foreground">Analysis</div>
            <p className="text-sm text-muted-foreground">
              {trend === "Improving" &&
                "Your scores are showing an upward trend. Keep up the good work!"}
              {trend === "Declining" &&
                "Your scores are declining. Consider revisiting earlier material or seeking additional help."}
              {trend === "Stable" &&
                "Your performance has been consistent. Focus on difficult areas to improve further."}
              {trend === "Not enough data" &&
                "Take more tests to see performance analysis."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
