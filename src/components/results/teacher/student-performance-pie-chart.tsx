import React from "react";
import { Pie } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface StudentPerformancePieChartProps {
  scores: number[];
}

// Distribution: Excellent: 90%+, Good: 75-89%, Average: 50-74%, Needs Improvement: <50%  
function getPerformanceDistribution(scores: number[]) {
  let excellent = 0,
    good = 0,
    average = 0,
    needsImprovement = 0;
  scores.forEach((score) => {
    if (score >= 90) excellent++;
    else if (score >= 75) good++;
    else if (score >= 50) average++;
    else needsImprovement++;
  });
  return { excellent, good, average, needsImprovement };
}

export const StudentPerformancePieChart: React.FC<
  StudentPerformancePieChartProps
> = ({ scores }) => {
  const { excellent, good, average, needsImprovement } =
    getPerformanceDistribution(scores);
  const data = {
    labels: [
      "Excellent (90%+)",
      "Good (75-89%)",
      "Average (50-74%)",
      "Needs Improvement (<50%)",
    ],
    datasets: [
      {
        data: [excellent, good, average, needsImprovement],
        backgroundColor: [
          "#0ea5e9", // blue for Excellent
          "#22c55e", // green for Good
          "#fbbf24", // yellow for Average
          "#ef4444", // red for Needs Improvement
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: typeof window !== "undefined"
            ? getComputedStyle(document.documentElement).getPropertyValue("--foreground") || "#222"
            : "#222",
        },
      },
      tooltip: { enabled: true },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Student Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Pie data={data} options={options} height={220} />
      </CardContent>
    </Card>
  );
};
