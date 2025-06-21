"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { CourseResult } from "./types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface StudentPerformanceTrendsChartProps {
  courses: CourseResult[];
}

export function StudentPerformanceTrendsChart({
  courses,
}: StudentPerformanceTrendsChartProps) {
  // Track which courses are visible
  const [visibleCourses, setVisibleCourses] = useState<string[]>(
    courses.map((c) => c.courseId),
  );

  // Find the max number of tests in any course
  const maxQuizzes = Math.max(...courses.map((c) => c.testResults.length));
  // X-axis: Quiz numbers (1, 2, 3, ...)
  const labels = Array.from({ length: maxQuizzes }, (_, i) => `Quiz ${i + 1}`);

  // Custom color palette for better distinction and accessibility
  const palette = [
    "#2563eb", // blue-600
    "#059669", // emerald-600
    "#f59e42", // orange-400
    "#e11d48", // rose-600
    "#a21caf", // purple-800
    "#f472b6", // pink-400
    "#0ea5e9", // sky-500
    "#eab308", // yellow-500
    "#7c3aed", // violet-600
    "#14b8a6", // teal-500
  ];

  // Only show datasets for visible courses
  const filteredCourses = courses.filter((c) =>
    visibleCourses.includes(c.courseId),
  );

  const datasets = filteredCourses.map((course, idx) => {
    // Sort tests by their order in the course
    const sortedTests = [...course.testResults].sort((a, b) =>
      a.completedAt.localeCompare(b.completedAt),
    );
    // Map to quiz number
    const data = labels.map((_, i) =>
      sortedTests[i] ? sortedTests[i].percentage : null,
    );
    return {
      label: course.courseName,
      data,
      borderColor: palette[idx % palette.length],
      backgroundColor: palette[idx % palette.length] + "33", // 20% opacity fill
      pointBackgroundColor: palette[idx % palette.length],
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: palette[idx % palette.length],
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 8,
      tension: 0.4,
      fill: true,
      spanGaps: true,
    };
  });

  // Add SSR-safe dark mode detection helper
  const isDarkMode = (): boolean => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return false;
    return document.documentElement.classList.contains("dark");
  };

  return (
    <Card className="border border-border shadow-lg w-full h-full bg-background">
      <CardHeader className="pb-2 border-b rounded-t-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-bold text-primary bg-transparent">
            Performance Trends
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {courses.map((course, idx) => {
            const isActive = visibleCourses.includes(course.courseId);
            return (
              <button
                key={course.courseId}
                type="button"
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow border-2 transition-colors duration-150 focus:outline-none ${isActive ? "text-white border-transparent" : "text-gray-400 border-dashed border-gray-300 opacity-60"}`}
                style={{
                  backgroundColor: isActive
                    ? palette[idx % palette.length]
                    : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setVisibleCourses((prev) =>
                    prev.includes(course.courseId)
                      ? prev.filter((id) => id !== course.courseId)
                      : [...prev, course.courseId],
                  );
                }}
                aria-pressed={isActive}
              >
                <span
                  className="inline-block w-3 h-3 rounded-full border-2 border-white"
                  style={{
                    backgroundColor: palette[idx % palette.length],
                    opacity: isActive ? 1 : 0.3,
                  }}
                ></span>
                {course.courseName}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px] w-full">
          <Line
            data={{ labels, datasets }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: {
                  enabled: true,
                  backgroundColor: () => {
                    return isDarkMode() ? "#1e293b" : "#fff";
                  },
                  titleColor: () => {
                    return isDarkMode() ? "#60a5fa" : "#1e293b";
                  },
                  bodyColor: () => {
                    return isDarkMode() ? "#f1f5f9" : "#0f172a";
                  },
                  borderColor: () => {
                    return isDarkMode() ? "#334155" : "#2563eb";
                  },
                  borderWidth: 1,
                  titleFont: { weight: "bold" },
                  bodyFont: { weight: "medium" },
                  padding: 12,
                  callbacks: {
                    label: (ctx) => {
                      const quizNumber = ctx.dataIndex + 1;
                      const marks = ctx.parsed.y ?? "-";
                      return `Quiz ${quizNumber}: ${marks}`;
                    },
                    labelTextColor: (ctx) => {
                      // Use course color for tooltip text
                      const courseIdx = datasets.findIndex(
                        (ds) => ds.label === ctx.dataset.label,
                      );
                      return palette[courseIdx % palette.length];
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: { color: "#e5e7eb33" },
                  ticks: { color: "#64748b", font: { weight: "bold" } },
                  title: {
                    display: true,
                    text: "Quiz Number",
                    color: "#334155",
                    font: { weight: "bold" },
                  },
                },
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: { color: "#e5e7eb33" },
                  ticks: {
                    color: "#64748b",
                    font: { weight: "bold" },
                    stepSize: 25,
                    callback: (v) => v + "%",
                  },
                  title: {
                    display: true,
                    text: "Score (%)",
                    color: "#334155",
                    font: { weight: "bold" },
                  },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
