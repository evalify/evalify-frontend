"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TestSummary } from "../common/types";
import { getScoreTextColor } from "@/lib/utils/score-colors";

interface PerformanceTrendsProps {
  tests: TestSummary[];
  courseName: string;
}

export function PerformanceTrends({
  tests,
  courseName,
}: PerformanceTrendsProps) {
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
    if (diff > 5) return "Improving";
    if (diff < -5) return "Declining";
    return "Stable";
  };

  const getTrendIcon = () => {
    const trend = getTrend();
    if (trend === "Improving")
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "Declining")
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-orange-600" />;
  };

  const getTrendColor = () => {
    const trend = getTrend();
    if (trend === "Improving") return "text-green-600";
    if (trend === "Declining") return "text-red-600";
    return "text-orange-600";
  };

  const testCount = sortedTests.length;

  if (testCount === 0) {
    return (
      <Card className="border-border">
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <p>No test data available for {courseName}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between">
          <span>Performance Trends</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1"
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Average Score</div>
            <div
              className={`font-medium text-lg mt-1 ${getScoreTextColor(averageScore)}`}
            >
              {averageScore.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Latest Score</div>
            <div
              className={`font-medium text-lg mt-1 ${getScoreTextColor(latestScore)}`}
            >
              {latestScore.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Best Score</div>
            <div
              className={`font-medium text-lg mt-1 ${getScoreTextColor(highestScore)}`}
            >
              {highestScore.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Trend</div>
            <div
              className={`font-medium text-lg mt-1 flex items-center ${getTrendColor()}`}
            >
              {getTrendIcon()}
              <span className="ml-1">{getTrend()}</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4">
            <div className="mb-2 font-medium">Score History</div>
            <div className="relative h-32 w-full">
              {scores.length > 1 && (
                <div className="absolute inset-0">
                  <svg
                    className="h-full w-full"
                    viewBox={`0 0 ${scores.length - 1} 100`}
                  >
                    {/* Connect the score points with lines */}
                    <polyline
                      points={scores
                        .map((score, i) => `${i}, ${100 - score}`)
                        .join(" ")}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary"
                    />

                    {/* Add dots for each score point */}
                    {scores.map((score, i) => (
                      <circle
                        key={i}
                        cx={i}
                        cy={100 - score}
                        r="2"
                        className="fill-primary"
                      />
                    ))}
                  </svg>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Test History</div>
              <div className="space-y-2">
                {sortedTests.map((test, index) => (
                  <div
                    key={test.testId}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="mr-2 w-6 h-6 flex items-center justify-center p-0"
                      >
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{test.testName}</span>
                    </div>
                    <div
                      className={`text-sm font-medium ${getScoreTextColor(test.percentage)}`}
                    >
                      {test.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
