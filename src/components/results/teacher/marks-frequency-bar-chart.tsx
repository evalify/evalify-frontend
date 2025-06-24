import React from "react";
import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export interface MarksFrequencyBarChartProps {
  scores: number[];
  binSize?: number; // e.g., 10 for 0-9, 10-19, ...
}

function getBins(scores: number[], binSize: number) {
  const max = 100;
  const bins = Array(Math.ceil(max / binSize)).fill(0);
  scores.forEach((score) => {
    const idx = Math.min(Math.floor(score / binSize), bins.length - 1);
    bins[idx]++;
  });
  return bins;
}

export const MarksFrequencyBarChart: React.FC<MarksFrequencyBarChartProps> = ({
  scores,
  binSize = 10,
}) => {
  const bins = getBins(scores, binSize);
  const labels = bins.map(
    (_, i) => `${i * binSize}-${i * binSize + binSize - 1}`,
  );
  const data = {
    labels,
    datasets: [
      {
        label: "Number of Students",
        data: bins,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  };
  // Utility to safely get CSS variable (SSR-safe)
  const getCSSVariable = (variable: string, fallback: string) => {
    if (typeof window === "undefined") return fallback;
    return (
      getComputedStyle(document.documentElement).getPropertyValue(variable) ||
      fallback
    );
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Percentage Range",
          color: getCSSVariable("--foreground", "#fff"),
          font: { size: 14 },
        },
        ticks: {
          color: getCSSVariable("--foreground", "#fff"),
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Students",
          color: getCSSVariable("--foreground", "#fff"),
          font: { size: 14 },
        },
        ticks: {
          color: getCSSVariable("--foreground", "#fff"),
        },
      },
    },
  };
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Marks Distribution (Marks vs Frequency)</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} height={220} />
      </CardContent>
    </Card>
  );
};
