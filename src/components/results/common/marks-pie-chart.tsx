"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { QuestionResult } from "./types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MarksPieChartProps {
  questions: QuestionResult[];
}

export const MarksPieChart: React.FC<MarksPieChartProps> = ({ questions }) => {
  const correctMarks = questions
    .filter((q) => q.isCorrect === true)
    .reduce((sum, q) => sum + (q.marks || 0), 0);
  const wrongMarks = questions
    .filter((q) => q.isCorrect === false)
    .reduce((sum, q) => sum + (q.marks || 0), 0);
  const unansweredMarks = questions
    .filter((q) => q.isCorrect === undefined)
    .reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <Pie
        data={{
          labels: ["Correct", "Wrong", "Unanswered"],
          datasets: [
            {
              data: [correctMarks, wrongMarks, unansweredMarks],
              backgroundColor: ["#10b981", "#ef4444", "#f59e42"],
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: "bottom" },
            tooltip: { enabled: true },
          },
        }}
      />
    </div>
  );
};
