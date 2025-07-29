"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Quiz from "@/repo/quiz/quiz";
import { QuizCard } from "@/components/quiz/quiz-view/quiz-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Share, BookOpen } from "lucide-react";

interface SharedQuiz {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  batches: string[];
  labs: string[];
  duration: number;
  publishResult: boolean;
  status: string;
  isProtected: boolean;
  courseCodes: string[];
}

const fetchSharedQuizzes = async (): Promise<SharedQuiz[]> => {
  return await Quiz.getSharedQuizzes();
};

export default function SharedQuizzesPage() {
  const {
    data: sharedQuizzes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shared-quizzes"],
    queryFn: fetchSharedQuizzes,
  });

  const handleViewResults = (quizId: string) => {
    // Navigate to quiz results page
    console.log("View results for quiz:", quizId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Loading Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="h-12 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center space-y-6 text-center p-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-xl dark:shadow-black/20">
            <Share className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Error loading shared quizzes
          </h3>
          <p className="text-muted-foreground max-w-md">
            There was an error loading the shared quizzes. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  if (!sharedQuizzes || sharedQuizzes.length === 0) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Shared Quizzes
            </h1>
            <p className="text-muted-foreground">
              Discover and access quizzes shared by other instructors
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex min-h-[500px] flex-col items-center justify-center space-y-6 text-center p-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-xl dark:shadow-black/20">
              <Share className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 dark:bg-orange-400 rounded-full flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-black/20">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              No shared quizzes available
            </h3>
            <p className="text-muted-foreground max-w-md">
              There are currently no quizzes shared by other instructors. Check
              back later for new shared content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Shared Quizzes
          </h1>
          <p className="text-muted-foreground">
            Discover and access quizzes shared by other instructors
          </p>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {sharedQuizzes.length}
          </span>{" "}
          shared quiz{sharedQuizzes.length !== 1 ? "es" : ""}
        </div>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sharedQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={{
              id: quiz.id,
              name: quiz.name,
              description: quiz.description,
              startTime: quiz.startTime,
              endTime: quiz.endTime,
              duration: quiz.duration,
              status: quiz.status,
              isProtected: quiz.isProtected,
              publishResult: quiz.publishResult,
              courseCodes: quiz.courseCodes,
            }}
            isShared={true}
            onView={handleViewResults}
          />
        ))}
      </div>
    </div>
  );
}
