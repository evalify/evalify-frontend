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
  onViewResults?: (quizId: string) => void;
}

const getStatusConfig = (status: QuizData["status"]) => {
  switch (status) {
    case "ACTIVE":
      return {
        badge:
          "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300 border border-green-200/50 dark:border-green-800/50",
        icon: Play,
        stripeColor: "bg-green-400/70 dark:bg-green-500/70",
      };
    case "UPCOMING":
      return {
        badge:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50",
        icon: Clock,
        stripeColor: "bg-blue-400/70 dark:bg-blue-500/70",
      };
    case "COMPLETED":
      return {
        badge:
          "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50",
        icon: CheckCircle,
        stripeColor: "bg-purple-400/70 dark:bg-purple-500/70",
      };
    case "MISSED":
      return {
        badge:
          "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/50",
        icon: XCircle,
        stripeColor: "bg-orange-400/70 dark:bg-orange-500/70",
      };
    default:
      return {
        badge:
          "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600",
        icon: AlertCircle,
        stripeColor: "bg-slate-400 dark:bg-slate-500",
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

  // Allow instructions access for completed/missed quizzes for review
  const canViewInstructions =
    canAccessInstructions ||
    quiz.status === "COMPLETED" ||
    quiz.status === "MISSED";

  // Check if quiz can be started (active and past start time)
  const canStartQuiz = quiz.status === "ACTIVE" && now >= startDate.getTime();

  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/80 dark:hover:border-slate-600/80 hover:-translate-y-1">
      {/* Status indicator stripe */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${statusConfig.stripeColor}`}
      />

      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50 truncate">
                {quiz.name}
              </h3>
              {quiz.protected && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
                  <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </div>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {quiz.description}
            </p>
          </div>
          <Badge
            className={`${statusConfig.badge} px-2 py-1 text-xs font-medium shrink-0`}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {quiz.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4">
        {/* Quiz Tags */}
        {quiz.quizTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {quiz.quizTags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0.5 bg-slate-50/80 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-600/50"
              >
                {tag}
              </Badge>
            ))}
            {quiz.quizTags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 bg-slate-50/80 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-600/50"
              >
                +{quiz.quizTags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Quiz Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded bg-slate-50/60 dark:bg-slate-800/25">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              <span className="text-sm text-slate-700 dark:text-slate-200">
                Start
              </span>
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
              {format(startDate, "MMM dd, hh:mm a")}
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-slate-50/60 dark:bg-slate-800/25">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
              <span className="text-sm text-slate-700 dark:text-slate-200">
                End
              </span>
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
              {format(endDate, "MMM dd, hh:mm a")}
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-slate-50/60 dark:bg-slate-800/25">
            <div className="flex items-center gap-2">
              <Timer className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              <span className="text-sm text-slate-700 dark:text-slate-200">
                Duration
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {formatDuration(quiz.duration)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {quiz.linearQuiz ? "Linear" : "Non-linear"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4 px-4 bg-slate-50/40 dark:bg-slate-800/15 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="w-full space-y-2">
          {/* Instructions Button - 5 minutes before quiz or for review, but not when Start Quiz is visible */}
          {canViewInstructions && !canStartQuiz && (
            <Link href={`/quiz/${quiz.id}/instructions`} className="block">
              <Button
                className="w-full bg-indigo-500/90 hover:bg-indigo-600 dark:bg-indigo-600/90 dark:hover:bg-indigo-700 text-white border-0"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {quiz.status === "COMPLETED" || quiz.status === "MISSED"
                  ? "Review Instructions"
                  : "View Instructions"}
              </Button>
            </Link>
          )}

          {/* Main Action Button */}
          {canStartQuiz ? (
            <Link href={`/quiz/${quiz.id}/instructions`} className="block">
              <Button
                className="w-full bg-green-500/90 hover:bg-green-600 dark:bg-green-600/90 dark:hover:bg-green-700 text-white border-0"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </Link>
          ) : quiz.status === "UPCOMING" ? (
            <Button
              disabled
              className="w-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50"
              size="sm"
              variant="outline"
            >
              <Clock className="w-4 h-4 mr-2" />
              Quiz Not Started
            </Button>
          ) : quiz.status === "COMPLETED" ? (
            <div className="space-y-2">
              <Link href={`/results/${quiz.id}`} className="block">
                <Button
                  className="w-full bg-purple-500/90 hover:bg-purple-600 dark:bg-purple-600/90 dark:hover:bg-purple-700 text-white border-0"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  View Results
                </Button>
              </Link>
              {!canViewInstructions && (
                <Link href={`/quiz/${quiz.id}/instructions`} className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Review Instructions
                  </Button>
                </Link>
              )}
            </div>
          ) : quiz.status === "MISSED" ? (
            <div className="space-y-2">
              <Button
                disabled
                className="w-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-800/50"
                size="sm"
                variant="outline"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Quiz Missed
              </Button>
              {!canViewInstructions && (
                <Link href={`/quiz/${quiz.id}/instructions`} className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Review Instructions
                  </Button>
                </Link>
              )}
            </div>
          ) : null}

          {/* Time-based Messages */}
          {quiz.status === "UPCOMING" && canAccessInstructions && (
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 px-2 py-1.5 rounded border border-amber-200/50 dark:border-amber-800/50">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Instructions available! Quiz starts in{" "}
                {formatTimeUntilStart(startDate, now)}
              </span>
            </div>
          )}

          {quiz.status === "UPCOMING" && !canAccessInstructions && (
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/30 px-2 py-1.5 rounded border border-blue-200/50 dark:border-blue-800/50">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>
                Instructions available in{" "}
                {formatTimeUntilInstructions(instructionsAccessTime, now)}
              </span>
            </div>
          )}

          {quiz.status === "ACTIVE" && now < startDate.getTime() && (
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50/70 dark:bg-green-950/30 px-2 py-1.5 rounded border border-green-200/50 dark:border-green-800/50">
              <Play className="w-3.5 h-3.5 shrink-0" />
              <span>Quiz starts in {formatTimeUntilStart(startDate, now)}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
