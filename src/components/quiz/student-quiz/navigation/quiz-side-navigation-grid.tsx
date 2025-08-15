/**
 * Quiz Side Navigation with Grid-Based Layout
 * Displays question status in a grid format for better overview
 */

"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Flag, Clock, Send, AlertTriangle, Timer, Zap } from "lucide-react";
import { QuizNavigationState, QuestionNavigation } from "../types/quiz-types";
import { cn } from "@/lib/utils";

interface QuizSideNavigationProps {
  navigationState: QuizNavigationState;
  onQuestionSelect: (questionId: string) => void;
  timeRemaining?: string;
  startTime?: string;
  endTime?: string;
  className?: string;
}

const QuizSideNavigationGrid: React.FC<QuizSideNavigationProps> = ({
  navigationState,
  onQuestionSelect,
  timeRemaining,
  startTime,
  endTime,
  className,
}) => {
  // Calculate timer stats and colors
  const timerStats = useMemo(() => {
    if (!timeRemaining || !startTime || !endTime) {
      return {
        progressPercentage: 0,
        timeElapsedPercentage: 0,
        status: "normal" as const,
        icon: Clock,
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        borderColor: "border-blue-200 dark:border-blue-800",
        textColor: "text-blue-700 dark:text-blue-300",
        progressColor: "bg-blue-500",
        progressBg: "bg-gray-200 dark:bg-gray-700",
      };
    }

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();

    const totalDuration = end - start;
    const elapsed = now - start;
    const remaining = end - now;

    const timeElapsedPercentage = Math.min(
      100,
      Math.max(0, (elapsed / totalDuration) * 100),
    );
    const progressPercentage = 100 - timeElapsedPercentage;

    // Determine status based on remaining time percentage
    const remainingPercentage = (remaining / totalDuration) * 100;

    let status: "normal" | "warning" | "critical" | "expired";
    let icon = Clock;
    let bgColor = "bg-blue-50 dark:bg-blue-950/30";
    let borderColor = "border-blue-200 dark:border-blue-800";
    let textColor = "text-blue-700 dark:text-blue-300";
    let progressColor = "bg-blue-500";
    const progressBg = "bg-gray-200 dark:bg-gray-700";

    if (remainingPercentage <= 0) {
      status = "expired";
      icon = AlertTriangle;
      bgColor = "bg-red-50 dark:bg-red-950/30";
      borderColor = "border-red-300 dark:border-red-800";
      textColor = "text-red-700 dark:text-red-300";
      progressColor = "bg-red-500";
    } else if (remainingPercentage <= 10) {
      status = "critical";
      icon = Zap;
      bgColor = "bg-red-50 dark:bg-red-950/30";
      borderColor = "border-red-300 dark:border-red-800";
      textColor = "text-red-700 dark:text-red-300";
      progressColor = "bg-red-500";
    } else if (remainingPercentage <= 25) {
      status = "warning";
      icon = Timer;
      bgColor = "bg-orange-50 dark:bg-orange-950/30";
      borderColor = "border-orange-300 dark:border-orange-800";
      textColor = "text-orange-700 dark:text-orange-300";
      progressColor = "bg-orange-500";
    } else {
      status = "normal";
      icon = Clock;
      bgColor = "bg-green-50 dark:bg-green-950/30";
      borderColor = "border-green-300 dark:border-green-800";
      textColor = "text-green-700 dark:text-green-300";
      progressColor = "bg-green-500";
    }

    return {
      progressPercentage,
      timeElapsedPercentage,
      status,
      icon,
      bgColor,
      borderColor,
      textColor,
      progressColor,
      progressBg,
    };
  }, [timeRemaining, startTime, endTime]);

  const getQuestionStatusColor = (question: QuestionNavigation) => {
    if (question.status.isAnswered && question.status.isMarkedForReview) {
      return "bg-orange-100 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-950/50";
    } else if (question.status.isAnswered) {
      return "bg-green-100 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-950/50";
    } else if (question.status.isMarkedForReview) {
      return "bg-orange-100 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-950/50";
    }
    return "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800";
  };

  const allQuestions = navigationState.sections.flatMap(
    (section) => section.questions,
  );

  // Calculate correct review count - questions marked for review
  const markedForReviewCount = allQuestions.filter(
    (q) => q.status.isMarkedForReview,
  ).length;

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      {/* Enhanced Timer Header */}
      <div
        className={cn(
          "p-4 border-b transition-all duration-300",
          timerStats.bgColor,
          timerStats.borderColor,
        )}
      >
        {timeRemaining && (
          <div className="space-y-3">
            {/* Timer Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <timerStats.icon
                  className={cn("w-4 h-4", timerStats.textColor)}
                />
                <span
                  className={cn("text-sm font-medium", timerStats.textColor)}
                >
                  Time Remaining
                </span>
              </div>
              <div
                className={cn(
                  "font-mono text-lg font-bold",
                  timerStats.textColor,
                )}
              >
                {timeRemaining}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>
                  {Math.round(timerStats.timeElapsedPercentage)}% elapsed
                </span>
              </div>
              <div
                className={cn(
                  "w-full rounded-full h-2 overflow-hidden",
                  timerStats.progressBg,
                )}
              >
                <div
                  className={cn(
                    "h-full transition-all duration-1000 ease-in-out rounded-full",
                    timerStats.progressColor,
                  )}
                  style={{ width: `${timerStats.timeElapsedPercentage}%` }}
                />
              </div>
            </div>

            {/* Status Badge */}
            {timerStats.status !== "normal" && (
              <div className="flex items-center justify-center">
                <Badge
                  variant={
                    timerStats.status === "expired"
                      ? "destructive"
                      : timerStats.status === "critical"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs animate-pulse"
                >
                  {timerStats.status === "expired" && "Time Expired!"}
                  {timerStats.status === "critical" && "Critical Time!"}
                  {timerStats.status === "warning" && "Time Running Low"}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Questions Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {navigationState.sections.map((section) => (
            <Card key={section.sectionId} className="border-muted">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {section.sectionName}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {section.answeredQuestions}/{section.totalQuestions}
                    </Badge>
                    {section.reviewedQuestions > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {section.reviewedQuestions}{" "}
                        <Flag className="w-2 h-2 ml-1" />
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress
                  value={
                    (section.answeredQuestions / section.totalQuestions) * 100
                  }
                  className="h-1"
                />
              </CardHeader>
              <CardContent>
                {/* Questions Grid - 6 columns for better fit */}
                <div className="grid grid-cols-4 gap-2">
                  {section.questions.map((question) => {
                    const isCurrent =
                      question.questionId === navigationState.currentQuestionId;
                    return (
                      <Button
                        key={question.questionId}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        onClick={() => onQuestionSelect(question.questionId)}
                        className={cn(
                          "h-12 w-full p-1 text-sm font-medium relative",
                          isCurrent
                            ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                            : getQuestionStatusColor(question),
                        )}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <span>{question.questionNumber}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-muted/5 space-y-3">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="text-green-600 dark:text-green-400 font-semibold">
              {navigationState.answeredQuestions}
            </div>
            <div className="text-muted-foreground">Answered</div>
          </div>
          <div className="space-y-1">
            <div className="text-orange-600 dark:text-orange-400 font-semibold">
              {markedForReviewCount}
            </div>
            <div className="text-muted-foreground">Review</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600 dark:text-gray-400 font-semibold">
              {navigationState.totalQuestions -
                navigationState.answeredQuestions}
            </div>
            <div className="text-muted-foreground">Remaining</div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="destructive"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              if (confirm("Are you sure you want to submit the quiz?")) {
                // Submit logic would be handled by parent component
              }
            }}
          >
            <Send className="w-3 h-3 mr-1" />
            Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizSideNavigationGrid;
