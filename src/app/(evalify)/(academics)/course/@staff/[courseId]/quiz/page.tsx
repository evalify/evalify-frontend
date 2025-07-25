"use client";

import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { courseQueries } from "@/repo/course-queries/course-queries";
import QuizRepo from "@/repo/quiz/quiz";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  BookOpen,
  AlertCircle,
  Calendar,
  CheckCircle,
  PlayCircle,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import { useQuizState } from "@/hooks/use-quiz-state";

// Import our new components
import {
  QuizFilters,
  type SortOption,
} from "@/components/quiz/quiz-view/quiz-filters";
import { QuizGrid } from "@/components/quiz/quiz-view/quiz-grid";
import { QuizTable } from "@/components/quiz/quiz-view/quiz-table";

type Props = {
  params: Promise<{
    courseId: string;
  }>;
};

interface Quiz {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  isProtected: boolean;
  publishResult: boolean;
  courseCodes: string[];
}

// Define the type for raw quiz data from API
interface RawQuizData {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: number;
  status?: string;
  isProtected?: boolean;
  publishResult?: boolean;
  courseCodes?: string[];
}

export default function QuizManagementPage({ params }: Props) {
  const { courseId } = use(params);
  const router = useRouter();
  const { info, error } = useToast();

  // Use custom hook for state management
  const {
    viewMode,
    sortBy,
    filters,
    handleViewModeChange,
    handleFiltersChange,
    handleSortChange,
  } = useQuizState({ defaultSort: "startTime" });

  // Data fetching
  const {
    data: quizData,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useQuery({
    queryKey: ["quizzes", courseId],
    queryFn: () => QuizRepo.getQuizzesByCourseId(courseId),
  });

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseQueries.getCourseById(courseId),
  });

  // Transform quiz data to match our interface
  const transformedQuizzes: Quiz[] = useMemo(() => {
    if (!quizData) return [];
    return quizData.map((quiz: RawQuizData) => ({
      id: quiz.id,
      name: quiz.name,
      description: quiz.description || "",
      startTime: quiz.startTime,
      endTime: quiz.endTime,
      duration: quiz.duration,
      status: quiz.status || "DRAFT",
      isProtected: quiz.isProtected || false,
      publishResult: quiz.publishResult || false,
      courseCodes: quiz.courseCodes || [],
    }));
  }, [quizData]);

  // Filter and sort logic
  const filteredAndSortedQuizzes = useMemo(() => {
    let result = [...transformedQuizzes];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (quiz) =>
          quiz.name.toLowerCase().includes(searchLower) ||
          quiz.description.toLowerCase().includes(searchLower) ||
          quiz.courseCodes.some((code) =>
            code.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter((quiz) => filters.status.includes(quiz.status));
    }

    // Apply course code filter
    if (filters.courseCode.length > 0) {
      result = result.filter((quiz) =>
        quiz.courseCodes.some((code) => filters.courseCode.includes(code)),
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "startTime":
          return (
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        case "startTime-desc":
          return (
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        case "status-desc":
          return b.status.localeCompare(a.status);
        case "duration":
          return a.duration - b.duration;
        case "duration-desc":
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

    return result;
  }, [transformedQuizzes, filters, sortBy]);

  // Get unique values for filters
  const availableStatuses = useMemo(() => {
    const statuses = new Set(transformedQuizzes.map((quiz) => quiz.status));
    return Array.from(statuses);
  }, [transformedQuizzes]);

  const availableCourseCodes = useMemo(() => {
    const codes = new Set(
      transformedQuizzes.flatMap((quiz) => quiz.courseCodes),
    );
    return Array.from(codes);
  }, [transformedQuizzes]);

  // Sort options
  const sortOptions: SortOption[] = [
    { value: "startTime", label: "Start Time (Earliest)" },
    { value: "startTime-desc", label: "Start Time (Latest)" },
    { value: "name", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "status", label: "Status" },
    { value: "duration", label: "Duration (Shortest)" },
    { value: "duration-desc", label: "Duration (Longest)" },
  ];

  // Quiz stats for dashboard
  const quizStats = useMemo(() => {
    const stats = {
      total: transformedQuizzes.length,
      active: 0,
      scheduled: 0,
      completed: 0,
      draft: 0,
    };

    transformedQuizzes.forEach((quiz) => {
      switch (quiz.status) {
        case "ACTIVE":
          stats.active++;
          break;
        case "SCHEDULED":
          stats.scheduled++;
          break;
        case "COMPLETED":
          stats.completed++;
          break;
        case "DRAFT":
          stats.draft++;
          break;
      }
    });

    return stats;
  }, [transformedQuizzes]);

  // Action handlers
  const handleCreateQuiz = useCallback(() => {
    router.push(`/course/${courseId}/quiz/create/manage`);
  }, [router, courseId]);

  const handleEditQuiz = useCallback(
    (quizId: string) => {
      router.push(`/course/${courseId}/quiz/${quizId}/manage`);
    },
    [router, courseId],
  );

  const handleViewQuiz = useCallback(
    (quizId: string) => {
      router.push(`/course/${courseId}/quiz/${quizId}/result`);
    },
    [router, courseId],
  );

  const handleManageQuiz = useCallback(
    (quizId: string) => {
      router.push(`/course/${courseId}/quiz/${quizId}/view`);
    },
    [router, courseId],
  );

  const handleDuplicateQuiz = useCallback(
    (quizId: string) => {
      info("Feature Coming Soon", {
        description: `Quiz duplication for ${quizId} will be available in the next update.`,
      });
    },
    [info],
  );

  const handleDeleteQuiz = useCallback(
    (quizId: string) => {
      error("Feature Coming Soon", {
        description: `Quiz deletion for ${quizId} will be available in the next update.`,
      });
    },
    [error],
  );

  // Loading state
  if (courseLoading || quizzesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        <Skeleton className="h-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (quizzesError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load quizzes. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-4 mt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              {courseData?.name || "Course"} - Quizzes
            </h1>
          </div>
          <p className="text-gray-500">
            {courseData?.code && (
              <span className="font-mono px-2 py-1 rounded text-sm mr-2">
                {courseData.code}
              </span>
            )}
            Manage and track all quizzes for this course
          </p>
        </div>

        <Button onClick={handleCreateQuiz} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm ">Total Quizzes</p>
                <p className="text-2xl font-bold">{quizStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PlayCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm ">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {quizStats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm ">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {quizStats.scheduled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm ">Completed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {quizStats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <QuizFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        availableStatuses={availableStatuses}
        availableCourseCodes={availableCourseCodes}
        sortOptions={sortOptions}
        totalQuizzes={transformedQuizzes.length}
        filteredCount={filteredAndSortedQuizzes.length}
      />

      {/* Quiz Display */}
      {viewMode === "grid" ? (
        <QuizGrid
          quizzes={filteredAndSortedQuizzes}
          onEdit={handleEditQuiz}
          onView={handleViewQuiz}
          onDuplicate={handleDuplicateQuiz}
          onDelete={handleDeleteQuiz}
          onManage={handleManageQuiz}
          isLoading={quizzesLoading}
        />
      ) : (
        <QuizTable
          quizzes={filteredAndSortedQuizzes}
          onEdit={handleEditQuiz}
          onView={handleViewQuiz}
          onDuplicate={handleDuplicateQuiz}
          onDelete={handleDeleteQuiz}
          onManage={handleManageQuiz}
          isLoading={quizzesLoading}
        />
      )}
    </div>
  );
}
