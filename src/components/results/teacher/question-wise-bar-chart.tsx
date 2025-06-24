import React, { useEffect, useState } from "react";
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

// Use a distinct name to avoid conflict with types.ts
export interface QuestionStatChart {
  question: string;
  correct: number;
  wrong: number;
}

export interface QuestionWiseBarChartProps {
  questionStats: QuestionStatChart[];
  horizontalMode?: boolean;
}

// Custom hook for theme-aware colors (SSR safe)
const useThemeColors = () => {
  const [colors, setColors] = useState({ foreground: "#222" });

  useEffect(() => {
    const updateColors = () => {
      const style = getComputedStyle(document.documentElement);
      setColors({
        foreground: style.getPropertyValue("--foreground") || "#222",
      });
    };
    updateColors();
  }, []);

  return colors;
};

export const QuestionWiseBarChart: React.FC<QuestionWiseBarChartProps> = ({
  questionStats,
  horizontalMode = false,
}) => {
  const themeColors = useThemeColors();
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
              color: themeColors.foreground,
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
              color: themeColors.foreground,
            },
          },
          y: {
            beginAtZero: true,
            stacked: false,
            ticks: {
              color: themeColors.foreground,
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
