import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface QuestionStat {
  question: string;
  correct: number;
  wrong: number;
}

export interface QuestionWiseBarChartProps {
  questionStats: QuestionStat[];
  horizontalMode?: boolean;
}

export const QuestionWiseBarChart: React.FC<QuestionWiseBarChartProps> = ({
  questionStats,
  horizontalMode = false,
}) => {
  // Only show first 15 questions, rest scrollable in horizontal mode; for vertical, scroll if >30
  const scrollThreshold = horizontalMode ? 15 : 30;
  const isScrollable = questionStats.length > scrollThreshold;
  const visibleStats =
    isScrollable && horizontalMode ? questionStats.slice(0, 15) : questionStats;
  const chart = (
    <Bar
      data={{
        labels: visibleStats.map((q, i) => `Q${i + 1}`),
        datasets: [
          {
            label: "Correct",
            data: visibleStats.map((q) => q.correct),
            backgroundColor: "#22c55e",
            borderRadius: 4,
          },
          {
            label: "Wrong",
            data: visibleStats.map((q) => q.wrong),
            backgroundColor: "#ef4444",
            borderRadius: 4,
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              color:
                getComputedStyle(document.documentElement).getPropertyValue(
                  "--foreground",
                ) || "#222",
            },
          },
          tooltip: { enabled: true },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
            ticks: {
              color:
                getComputedStyle(document.documentElement).getPropertyValue(
                  "--foreground",
                ) || "#fff",
            },
          },
          y: {
            beginAtZero: true,
            stacked: false,
            ticks: {
              color:
                getComputedStyle(document.documentElement).getPropertyValue(
                  "--foreground",
                ) || "#fff",
            },
          },
        },
      }}
      height={220}
    />
  );
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Question-wise Correct/Wrong</CardTitle>
      </CardHeader>
      <CardContent>{chart}</CardContent>
    </Card>
  );
};
