"use client";

import { useQuiz } from "./quiz-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StatItem = {
  label: string;
  count: number;
  variant: "default" | "secondary" | "outline" | "destructive";
  className: string;
};

export default function QuestionStats() {
  const { stats } = useQuiz();
  const statsDisplay: StatItem[] = [
    {
      label: "Attempted",
      count: stats.attempted,
      variant: "default",
      className: "bg-green-600/90 dark:bg-green-700 hover:bg-green-600",
    },
    {
      label: "Viewed",
      count: stats.viewed,
      variant: "secondary",
      className: "bg-gray-500/80 dark:bg-gray-600/80 hover:bg-gray-500",
    },
    {
      label: "Not Viewed",
      count: stats.notViewed,
      variant: "outline",
      className: "border-gray-300 dark:border-gray-600",
    },
    {
      label: "For Review",
      count: stats.forReview,
      variant: "destructive",
      className: "bg-yellow-500/90 dark:bg-yellow-600/90 hover:bg-yellow-500",
    },
  ];

  return (
    <Card className="mt-3 border-muted/30">
      <CardHeader className="pb-0 pt-2 px-3">
        <CardTitle className="text-sm font-medium text-foreground">
          Question Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {statsDisplay.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge
                variant={stat.variant}
                className={`h-7 w-9 rounded flex items-center justify-center text-sm font-medium ${stat.className}`}
              >
                {stat.count}
              </Badge>
              <span className="text-sm text-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
