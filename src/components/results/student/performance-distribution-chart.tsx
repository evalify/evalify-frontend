"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { RecentTestResult } from "../common/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const getBarColor = (lowerBound: number): string => {
  if (lowerBound < 20) return "#ef4444";
  if (lowerBound < 40) return "#f97316";
  if (lowerBound < 60) return "#eab308";
  if (lowerBound < 80) return "#10b981";
  return "#16a34a";
};

interface StudentPerformanceDistributionChartProps {
  tests: RecentTestResult[];
}

type GroupingSize = "20%" | "10%" | "5%";

export function StudentPerformanceDistributionChart({
  tests,
}: StudentPerformanceDistributionChartProps) {
  const [grouping, setGrouping] = useState<GroupingSize>("20%");

  const handleGroupingChange = (value: string) => {
    setGrouping(value as GroupingSize);
  };

  const generateDistribution = (
    results: RecentTestResult[],
    groupSize: number,
  ) => {
    if (!results || results.length === 0) return [];
    const numberOfBins = 100 / groupSize;
    const bins: { count: number; range: string }[] = [];
    for (let i = 0; i < numberOfBins; i++) {
      const lowerBound = i * groupSize;
      const upperBound =
        lowerBound + groupSize - (i === numberOfBins - 1 ? 0 : 1);
      bins.push({ count: 0, range: `${lowerBound}-${upperBound}` });
    }
    results.forEach((result) => {
      const scorePercentage = result.percentage;
      if (scorePercentage === 100) {
        bins[bins.length - 1].count++;
      } else {
        const binIndex = Math.floor(scorePercentage / groupSize);
        if (binIndex >= 0 && binIndex < bins.length) {
          bins[binIndex].count++;
        }
      }
    });
    const total = results.length;
    return bins.map((bin) => {
      const lowerBound = parseInt(bin.range.split("-")[0]);
      return {
        range: bin.range,
        count: bin.count,
        percentage: total > 0 ? Math.round((bin.count / total) * 100) : 0,
        lowerBound,
        color: getBarColor(lowerBound),
      };
    });
  };

  const groupSize = parseInt(grouping);
  const distribution = generateDistribution(tests, groupSize);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2 bg-muted/30 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            My Score Distribution
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Group by score range:
            </span>
            <Select value={grouping} onValueChange={handleGroupingChange}>
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5%">5%</SelectItem>
                <SelectItem value="10%">10%</SelectItem>
                <SelectItem value="20%">20%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-80 w-full">
          <Bar
            data={{
              labels: distribution.map((item) => `${item.range}%`),
              datasets: [
                {
                  label: "Number of Tests",
                  data: distribution.map((item) => item.count),
                  backgroundColor: distribution.map((item) => item.color),
                  borderColor: distribution.map((item) => item.color),
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: true },
              },
              scales: {
                x: { grid: { color: "#e5e7eb22" } },
                y: { beginAtZero: true, grid: { color: "#e5e7eb22" } },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
