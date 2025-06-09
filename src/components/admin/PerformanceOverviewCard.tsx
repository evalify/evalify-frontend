"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart3 } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  date: string;
  averageScore: number;
  totalQuestions: number;
  participantCount: number;
}

interface PerformanceOverviewCardProps {
  quizzes: Quiz[];
  recentQuizzes: Quiz[];
}

export default function PerformanceOverviewCard({
  quizzes,
  recentQuizzes,
}: PerformanceOverviewCardProps) {
  const overallAverage =
    quizzes.length > 0
      ? quizzes.reduce((sum, quiz) => sum + quiz.averageScore, 0) /
        quizzes.length
      : 0;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  if (quizzes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{overallAverage.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Overall Average</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total Quizzes</span>
              <span className="font-semibold">{quizzes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Recent Quizzes</span>
              <span className="font-semibold">{recentQuizzes.length}</span>
            </div>
            {recentQuizzes.length > 0 && (
              <div className="flex justify-between">
                <span className="text-sm">Latest Score</span>
                <span
                  className={`font-semibold ${getScoreColor(recentQuizzes[0].averageScore)}`}
                >
                  {recentQuizzes[0].averageScore.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
