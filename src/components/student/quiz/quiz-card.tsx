"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  FileText,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Lock,
} from "lucide-react";
import { format } from "date-fns";

export interface QuizData {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: "ACTIVE" | "UPCOMING" | "MISSED" | "COMPLETED";
  quizTags: string[];
  instructions: string;
  linearQuiz: boolean;
  protected: boolean;
}

interface QuizCardProps {
  quiz: QuizData;
  onTakeQuiz?: (quizId: string) => void;
  onViewResults?: (quizId: string) => void;
}

const getStatusConfig = (status: QuizData["status"]) => {
  switch (status) {
    case "ACTIVE":
      return {
        badge: "bg-green-500 hover:bg-green-600 text-white",
        icon: Play,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
      };
    case "UPCOMING":
      return {
        badge: "bg-blue-500 hover:bg-blue-600 text-white",
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
        borderColor: "border-blue-200 dark:border-blue-800",
      };
    case "COMPLETED":
      return {
        badge: "bg-emerald-500 hover:bg-emerald-600 text-white",
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950",
        borderColor: "border-emerald-200 dark:border-emerald-800",
      };
    case "MISSED":
      return {
        badge: "bg-red-500 hover:bg-red-600 text-white",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
        borderColor: "border-red-200 dark:border-red-800",
      };
    default:
      return {
        badge: "bg-gray-500 hover:bg-gray-600 text-white",
        icon: AlertCircle,
        color: "text-gray-600",
        bgColor: "bg-gray-50 dark:bg-gray-950",
        borderColor: "border-gray-200 dark:border-gray-800",
      };
  }
};

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / (1000 * 60 * 60 * 1000000));
  const minutes = Math.floor(
    (duration % (1000 * 60 * 60 * 1000000)) / (1000 * 60 * 1000000),
  );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatTimeUntilStart = (startDate: Date, now: number) => {
  const diff = startDate.getTime() - now;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
};

const formatTimeUntilInstructions = (instructionsTime: Date, now: number) => {
  const diff = instructionsTime.getTime() - now;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
};

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const statusConfig = getStatusConfig(quiz.status);
  const StatusIcon = statusConfig.icon;

  const startDate = new Date(quiz.startTime);
  const endDate = new Date(quiz.endTime);
  const now = Date.now();

  // Check if instructions should be accessible (5 minutes before start)
  const instructionsAccessTime = new Date(startDate.getTime() - 5 * 60 * 1000);
  const canAccessInstructions =
    now >= instructionsAccessTime.getTime() &&
    (quiz.status === "UPCOMING" || quiz.status === "ACTIVE");

  const isLive = quiz.status === "ACTIVE";

  return (
    <Card
      className={`group relative overflow-hidden hover:shadow-xl transition-all duration-300 ${statusConfig.borderColor} hover:shadow-${statusConfig.color.split("-")[1]}-200/20 hover:-translate-y-2 ${statusConfig.bgColor} border-2`}
    >
      {/* Status indicator stripe */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${statusConfig.badge.split(" ")[0]}`}
      />

      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">
                {quiz.name}
              </h3>
              {quiz.protected && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {quiz.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Badge
              className={`${statusConfig.badge} px-3 py-1 text-xs font-medium shadow-sm`}
            >
              <StatusIcon className="h-3 w-3 mr-1.5" />
              {quiz.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Quiz Tags */}
        {quiz.quizTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {quiz.quizTags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-1 bg-secondary/50 hover:bg-secondary"
              >
                {tag}
              </Badge>
            ))}
            {quiz.quizTags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-1 bg-secondary/50"
              >
                +{quiz.quizTags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Quiz Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Start
                </div>
                <div className="text-sm font-semibold truncate">
                  {format(startDate, "MMM dd")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(startDate, "hh:mm a")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Timer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Duration
                </div>
                <div className="text-sm font-semibold">
                  {formatDuration(quiz.duration)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {quiz.linearQuiz ? "Linear" : "Non-linear"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30">
                <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  End
                </div>
                <div className="text-sm font-semibold truncate">
                  {format(endDate, "MMM dd")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(endDate, "hh:mm a")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </div>
                <div className="text-sm font-semibold">Quiz</div>
                <div className="text-xs text-muted-foreground">
                  Instructions available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator for live quizzes */}
        {isLive && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-green-600">
                {Math.min(
                  100,
                  Math.max(
                    0,
                    ((now - startDate.getTime()) /
                      (endDate.getTime() - startDate.getTime())) *
                      100,
                  ),
                ).toFixed(0)}
                %
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 shadow-sm"
                style={{
                  width: `${Math.min(100, Math.max(0, ((now - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent">
        <div className="w-full space-y-3">
          {/* Instructions Button - 5 minutes before quiz */}
          {canAccessInstructions && (
            <Link href={`/quiz/${quiz.id}/instructions`} className="block">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Instructions
              </Button>
            </Link>
          )}

          {/* Main Action Button */}
          {quiz.status === "ACTIVE" && now >= startDate.getTime() ? (
            <Link href={`/quiz/${quiz.id}/instructions`} className="block">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </Link>
          ) : quiz.status === "UPCOMING" ? (
            <Button
              disabled
              className="w-full bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
              size="sm"
              variant="outline"
            >
              <Clock className="w-4 h-4 mr-2" />
              Quiz Not Started
            </Button>
          ) : quiz.status === "COMPLETED" ? (
            <Link href={`/results/${quiz.id}`} className="block">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                size="sm"
                variant="outline"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                View Results
              </Button>
            </Link>
          ) : quiz.status === "MISSED" ? (
            <Button
              disabled
              className="w-full bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
              size="sm"
              variant="outline"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Quiz Missed
            </Button>
          ) : null}

          {/* Time-based Messages */}
          {quiz.status === "UPCOMING" && canAccessInstructions && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>
                Instructions available! Quiz starts in{" "}
                {formatTimeUntilStart(startDate, now)}
              </span>
            </div>
          )}

          {quiz.status === "UPCOMING" && !canAccessInstructions && (
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>
                Instructions available in{" "}
                {formatTimeUntilInstructions(instructionsAccessTime, now)}
              </span>
            </div>
          )}

          {quiz.status === "ACTIVE" && now < startDate.getTime() && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300 px-3 py-2 rounded-lg">
              <Play className="w-4 h-4" />
              <span>Quiz starts in {formatTimeUntilStart(startDate, now)}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
