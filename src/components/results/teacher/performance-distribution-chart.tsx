"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DetailedTestStatistics,
  PerformanceDistribution,
  StudentTestResult,
} from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Color mapping for the performance bars
const getBarColor = (lowerBound: number): string => {
  if (lowerBound < 20) return "#ef4444"; // red-500
  if (lowerBound < 40) return "#f97316"; // orange-500
  if (lowerBound < 60) return "#eab308"; // yellow-500
  if (lowerBound < 80) return "#10b981"; // emerald-500
  return "#16a34a"; // green-600
};

interface PerformanceDistributionChartProps {
  statistics: DetailedTestStatistics;
}

type GroupingSize = "20%" | "10%" | "5%";

export function PerformanceDistributionChart({
  statistics,
}: PerformanceDistributionChartProps) {
  const { error } = useToast();
  const [grouping, setGrouping] = useState<GroupingSize>("20%");

  const handleGroupingChange = (value: string) => {
    setGrouping(value as GroupingSize);
  };

  // Create custom performance distribution based on selected grouping
  const generateDistribution = (
    results: StudentTestResult[],
    groupSize: number,
  ): PerformanceDistribution[] => {
    if (!results || results.length === 0) return [];

    try {
      // Create bins based on group size
      const numberOfBins = 100 / groupSize;
      const bins: { count: number; range: string }[] = [];

      for (let i = 0; i < numberOfBins; i++) {
        const lowerBound = i * groupSize;
        const upperBound =
          lowerBound + groupSize - (i === numberOfBins - 1 ? 0 : 1);
        bins.push({
          count: 0,
          range: `${lowerBound}-${upperBound}`,
        });
      }

      // Count students in each bin
      results.forEach((result: StudentTestResult) => {
        const scorePercentage = result.percentage;

        if (scorePercentage === 100) {
          // Special case for 100% to put it in the last bin
          bins[bins.length - 1].count++;
        } else {
          const binIndex = Math.floor(scorePercentage / groupSize);
          if (binIndex >= 0 && binIndex < bins.length) {
            bins[binIndex].count++;
          }
        }
      });

      // Calculate percentages
      const totalStudents = results.length;
      return bins.map((bin) => {
        const lowerBound = parseInt(bin.range.split("-")[0]);
        return {
          range: bin.range,
          count: bin.count,
          percentage:
            totalStudents > 0
              ? Math.round((bin.count / totalStudents) * 100)
              : 0,
          lowerBound,
          color: getBarColor(lowerBound),
        };
      });
    } catch (err) {
      error("Error processing performance data");
      console.error("Error generating distribution:", err);
      return [];
    }
  };

  // Get performance distribution based on selected grouping
  const getPerformanceDistribution = (): PerformanceDistribution[] => {
    const { studentResults } = statistics;

    // Use original data if it's already in the right format and grouping is 20%
    if (grouping === "20%" && statistics.performanceDistribution?.length > 0) {
      return statistics.performanceDistribution.map((item) => {
        const lowerBound = parseInt(item.range.split("-")[0]);
        return {
          ...item,
          lowerBound,
          color: getBarColor(lowerBound),
        };
      });
    }

    // Otherwise generate new distribution based on selected grouping
    const groupSize = parseInt(grouping);
    return generateDistribution(studentResults, groupSize);
  };

  const performanceDistribution = getPerformanceDistribution();

  // Debug: Log the data being passed to the chart
  console.log("Performance Distribution Data:", performanceDistribution);
  console.log("Statistics:", statistics);

  // Generate sample data for testing when no real data available
  const generateSampleData = (
    groupingValue: string,
  ): PerformanceDistribution[] => {
    const groupSize = parseInt(groupingValue);
    const numberOfBins = 100 / groupSize;
    const sampleData: PerformanceDistribution[] = [];

    for (let i = 0; i < numberOfBins; i++) {
      const lowerBound = i * groupSize;
      const upperBound =
        lowerBound + groupSize - (i === numberOfBins - 1 ? 0 : 1);
      const count = Math.floor(Math.random() * 10) + 1; // Random count between 1-10
      sampleData.push({
        range: `${lowerBound}-${upperBound}`,
        count,
        percentage: Math.round((count / 20) * 100), // Assuming total of 20 students
        lowerBound,
        color: getBarColor(lowerBound),
      });
    }

    return sampleData;
  };

  // Ensure we have data to render
  if (!performanceDistribution || performanceDistribution.length === 0) {
    // Create sample data for testing if no real data is available
    const sampleData = generateSampleData(grouping);

    console.log("Using sample data:", sampleData);

    return (
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2 bg-muted/30 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              Performance Distribution (Sample Data)
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
                labels: sampleData.map((item) => `${item.range}%`),
                datasets: [
                  {
                    label: "Number of Students",
                    data: sampleData.map((item) => item.count),
                    backgroundColor: sampleData.map(
                      (item) => item.color || getBarColor(item.lowerBound || 0),
                    ),
                    borderColor: sampleData.map(
                      (item) => item.color || getBarColor(item.lowerBound || 0),
                    ),
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    titleColor: "#374151",
                    bodyColor: "#6B7280",
                    borderColor: "#E5E7EB",
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                      title: function (context) {
                        const index = context[0].dataIndex;
                        return `Score Range: ${sampleData[index].range}%`;
                      },
                      label: function (context) {
                        const index = context.dataIndex;
                        const data = sampleData[index];
                        return `Students: ${data.count} (${data.percentage}%)`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.1)",
                    },
                    title: {
                      display: true,
                      text: "Number of Students",
                    },
                    ticks: {
                      precision: 0,
                    },
                  },
                },
                interaction: {
                  intersect: false,
                  mode: "index",
                },
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing student distribution grouped by {grouping} score ranges
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2 bg-muted/30 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            Performance Distribution
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
              labels: performanceDistribution.map((item) => `${item.range}%`),
              datasets: [
                {
                  label: "Number of Students",
                  data: performanceDistribution.map((item) => item.count),
                  backgroundColor: performanceDistribution.map(
                    (item) => item.color || getBarColor(item.lowerBound || 0),
                  ),
                  borderColor: performanceDistribution.map(
                    (item) => item.color || getBarColor(item.lowerBound || 0),
                  ),
                  borderWidth: 1,
                  borderRadius: 4,
                  borderSkipped: false,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  titleColor: "#374151",
                  bodyColor: "#6B7280",
                  borderColor: "#E5E7EB",
                  borderWidth: 1,
                  cornerRadius: 8,
                  displayColors: false,
                  callbacks: {
                    title: function (context) {
                      const index = context[0].dataIndex;
                      return `Score Range: ${performanceDistribution[index].range}%`;
                    },
                    label: function (context) {
                      const index = context.dataIndex;
                      const data = performanceDistribution[index];
                      return `Students: ${data.count} (${data.percentage}%)`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                  },
                  title: {
                    display: true,
                    text: "Number of Students",
                  },
                  ticks: {
                    precision: 0,
                  },
                },
              },
              interaction: {
                intersect: false,
                mode: "index",
              },
            }}
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Showing student distribution grouped by {grouping} score ranges
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
