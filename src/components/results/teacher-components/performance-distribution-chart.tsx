"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedTestStatistics } from "../teacher-types";

// Color gradient for the performance bars
const getBarColor = (range: string): string => {
  // Extract the lower bound of the range as a number
  const lowerBound = parseInt(range.split("-")[0]);

  // Use a gradient based on the performance level
  if (lowerBound < 20) return "bg-red-500";
  if (lowerBound < 40) return "bg-orange-500";
  if (lowerBound < 60) return "bg-yellow-500";
  if (lowerBound < 80) return "bg-emerald-500";
  return "bg-green-600";
};

interface PerformanceDistributionChartProps {
  statistics: DetailedTestStatistics;
}

export function PerformanceDistributionChart({
  statistics,
}: PerformanceDistributionChartProps) {
  // Extract the performance distribution data
  const { performanceDistribution } = statistics;

  // Find the maximum count to scale the chart
  const maxCount = Math.max(
    ...performanceDistribution.map((item) => item.count),
  );

  // Ensure we have data to render
  if (!performanceDistribution || performanceDistribution.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Performance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">
              No performance data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30 border-b">
        <CardTitle className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          Performance Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="flex h-60 items-end space-x-2">
          {performanceDistribution.map((range) => (
            <div
              key={range.range}
              className="relative flex flex-col items-center flex-1"
            >
              <div
                className={`w-full rounded-t-md transition-all ${getBarColor(range.range)}`}
                style={{
                  height: `${(range.count / maxCount) * 100}%`,
                  opacity: 0.8 + (range.percentage / 100) * 0.2,
                }}
              />
              <div className="mt-3 text-xs text-center space-y-1">
                <p className="font-medium">{range.range}%</p>
                <p className="text-muted-foreground">{range.count} students</p>
                <p className="text-muted-foreground">({range.percentage}%)</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
