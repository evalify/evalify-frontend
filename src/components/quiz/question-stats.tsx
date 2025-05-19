"use client"

import { useQuiz } from "./quiz-context"

export default function QuestionStats() {
  const { stats } = useQuiz();
  
  const statsDisplay = [
    { label: "Attempted", count: stats.attempted, color: "bg-green-600" },
    { label: "Viewed", count: stats.viewed, color: "bg-gray-600" },
    { label: "Not Viewed", count: stats.notViewed, color: "border border-dashed border-gray-600" },
    { label: "For Review", count: stats.forReview, color: "bg-yellow-600" },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-2">
      {statsDisplay.map((stat, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`h-8 w-12 rounded flex items-center justify-center ${stat.color}`}>{stat.count}</div>
          <span className="text-sm">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
