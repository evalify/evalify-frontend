"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { QuestionResult } from "./types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface QuestionBarChartProps {
  questions: QuestionResult[];
}

export const QuestionBarChart: React.FC<QuestionBarChartProps> = ({
  questions,
}) => {
  const labels = questions.map((q, i) => `Q${i + 1}`);
  const correct = questions.map((q) => (q.isCorrect === true ? 1 : 0));
  const wrong = questions.map((q) => (q.isCorrect === false ? 1 : 0));

  return (
    <div className="w-full h-64">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Correct",
              data: correct,
              backgroundColor: "#10b981",
              borderRadius: 6,
            },
            {
              label: "Wrong",
              data: wrong,
              backgroundColor: "#ef4444",
              borderRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: "top" },
            tooltip: { enabled: true },
          },
          scales: {
            x: { stacked: true, grid: { color: "#e5e7eb33" } },
            y: {
              beginAtZero: true,
              stepSize: 1,
              grid: { color: "#e5e7eb33" },
              ticks: { precision: 0 },
            },
          },
        }}
      />
    </div>
  );
};
