"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  FileText,
  Grid3X3,
  List,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import AuthGuard from "@/components/auth/auth-guard";
import { UserType } from "@/lib/auth/utils";
import StudentQuiz from "@/repo/student/quiz/student-quiz";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuizPreferences } from "@/components/quiz/hooks/use-quiz-preferences";
import QuizCard, { QuizData } from "@/components/student/quiz/quiz-card";
import QuizTable from "@/components/student/quiz/quiz-table";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { preferences, isLoaded, setViewMode, setSelectedTab } =
    useQuizPreferences();

  // Initialize state from URL params and preferences
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCourse, setSelectedCourse] = useState<string>(
    searchParams.get("course") || "all",
  );

  // Use preferences for initial tab selection if no URL param
  const initialTab =
    searchParams.get("status") || (isLoaded ? preferences.selectedTab : "all");
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update URL params when filters change
  useEffect(() => {
    if (!isLoaded) return;

    const params = new URLSearchParams();

    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    }

    if (activeTab !== "all") {
      params.set("status", activeTab);
    }

    if (selectedCourse !== "all") {
      params.set("course", selectedCourse);
    }

    const paramString = params.toString();
    const newUrl = paramString ? `?${paramString}` : "/quiz";

    router.replace(newUrl, { scroll: false });
  }, [debouncedSearchQuery, activeTab, selectedCourse, router, isLoaded]);

  // Update preferences when tab changes
  useEffect(() => {
    if (isLoaded && activeTab !== preferences.selectedTab) {
      setSelectedTab(
        activeTab as "all" | "live" | "upcoming" | "completed" | "missed",
      );
    }
  }, [activeTab, isLoaded, preferences.selectedTab, setSelectedTab]);

  const {
    data: quizData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["studentQuizzes"],
    queryFn: () => StudentQuiz.getAllStudentQuizzes(),
  });

  // Filter quizzes based on search, course, and active tab
  const filteredQuizzes = useMemo(() => {
    if (!quizData) return [];

    let filtered = quizData;

    // Tab filter (status filter)
    if (activeTab !== "all") {
      const statusMapping = {
        live: "ACTIVE",
        upcoming: "UPCOMING",
        completed: "COMPLETED",
        missed: "MISSED",
      };

      const targetStatus =
        statusMapping[activeTab as keyof typeof statusMapping];
      if (targetStatus) {
        filtered = filtered.filter(
          (quiz: QuizData) => quiz.status === targetStatus,
        );
      }
    }

    // Search filter
    if (debouncedSearchQuery) {
      filtered = filtered.filter(
        (quiz: QuizData) =>
          quiz.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          quiz.description
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          quiz.quizTags.some((tag) =>
            tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
          ),
      );
    }

    // Course filter (if you have course data in the future)
    if (selectedCourse !== "all") {
      // filtered = filtered.filter((quiz: QuizData) => quiz.courseId === selectedCourse);
    }

    return filtered;
  }, [quizData, debouncedSearchQuery, selectedCourse, activeTab]);

  // Get unique courses for filter dropdown (placeholder for future use)
  const availableCourses = useMemo(() => {
    if (!quizData) return [];
    // Extract unique courses from quiz data when available
    return [];
  }, [quizData]);

  // Quiz counts by status
  const quizCounts = useMemo(() => {
    if (!quizData)
      return { all: 0, live: 0, upcoming: 0, completed: 0, missed: 0 };

    const allQuizzes = quizData;
    return {
      all: allQuizzes.length,
      live: allQuizzes.filter((quiz: QuizData) => quiz.status === "ACTIVE")
        .length,
      upcoming: allQuizzes.filter(
        (quiz: QuizData) => quiz.status === "UPCOMING",
      ).length,
      completed: allQuizzes.filter(
        (quiz: QuizData) => quiz.status === "COMPLETED",
      ).length,
      missed: allQuizzes.filter((quiz: QuizData) => quiz.status === "MISSED")
        .length,
    };
  }, [quizData]);

  const handleViewResults = useCallback(
    (quizId: string) => {
      router.push(`/results/${quizId}`);
    },
    [router],
  );

  // Auto-redirect logic for quiz instructions
  useEffect(() => {
    if (!quizData) return;

    const now = Date.now();

    // Check for quizzes that just became available for instructions (5 minutes before start)
    const readyForInstructionsQuiz = quizData.find((quiz: QuizData) => {
      if (quiz.status !== "UPCOMING") return false;

      const startDate = new Date(quiz.startTime);
      const instructionsAccessTime = new Date(
        startDate.getTime() - 5 * 60 * 1000,
      );

      // Quiz instructions just became available
      return (
        now >= instructionsAccessTime.getTime() && now < startDate.getTime()
      );
    });

    if (readyForInstructionsQuiz) {
      // Check if we're not already on an instructions page to avoid infinite redirects
      if (!window.location.pathname.includes("/instructions")) {
        router.push(`/quiz/${readyForInstructionsQuiz.id}/instructions`);
      }
    }
  }, [quizData, router]);

  // Refetch quiz data when a quiz becomes active
  useEffect(() => {
    if (!quizData) return;

    const checkInterval = setInterval(() => {
      const currentTime = Date.now();

      // Check if any upcoming quiz should now be active
      const shouldRefetch = quizData.some((quiz: QuizData) => {
        if (quiz.status !== "UPCOMING") return false;
        const startDate = new Date(quiz.startTime);
        return currentTime >= startDate.getTime();
      });

      if (shouldRefetch) {
        // Refetch quiz data to update statuses
        // The useQuery will automatically update when we invalidate
        window.location.reload(); // Simple approach, can be refined with query invalidation
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [quizData]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const handleViewModeChange = useCallback(
    (mode: "grid" | "table") => {
      setViewMode(mode);
    },
    [setViewMode],
  );

  if (error) {
    return (
      <AuthGuard requiredGroups={[UserType.STUDENT]}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/50">
              <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
                Error Loading Quizzes
              </div>
              <p className="text-red-600/80 dark:text-red-400/80">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (isLoading) {
    return (
      <AuthGuard requiredGroups={[UserType.STUDENT]}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Loading Quizzes...
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Please wait while we fetch your quizzes
              </p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredGroups={[UserType.STUDENT]}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
              <p className="text-muted-foreground">
                View and manage your assigned quizzes
              </p>
            </div>
          </div>
        </div>

        {/* Tabs with Status Filters */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <TabsList className="grid w-full grid-cols-5 h-12 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <TabsTrigger
                  value="all"
                  className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm"
                >
                  <span className="hidden sm:inline">All</span>
                  <span className="sm:hidden">All</span>
                  {quizCounts.all > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 h-5 px-2 text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200"
                    >
                      {quizCounts.all}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="live"
                  className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm"
                >
                  <Play className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Live</span>
                  {quizCounts.live > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 h-5 px-2 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    >
                      {quizCounts.live}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="upcoming"
                  className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm"
                >
                  <Clock className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Upcoming</span>
                  {quizCounts.upcoming > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 h-5 px-2 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    >
                      {quizCounts.upcoming}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm"
                >
                  <CheckCircle className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Done</span>
                  {quizCounts.completed > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 h-5 px-2 text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                    >
                      {quizCounts.completed}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="missed"
                  className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm"
                >
                  <XCircle className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Missed</span>
                  {quizCounts.missed > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 h-5 px-2 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                    >
                      {quizCounts.missed}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 ml-auto bg-slate-100/80 dark:bg-slate-800/60 rounded-lg p-1 border border-slate-200/60 dark:border-slate-700/60">
                <Button
                  variant={
                    preferences.viewMode === "grid" ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => handleViewModeChange("grid")}
                  className={`h-8 w-8 p-0 ${
                    preferences.viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-50"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={
                    preferences.viewMode === "table" ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => handleViewModeChange("table")}
                  className={`h-8 w-8 p-0 ${
                    preferences.viewMode === "table"
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-50"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-3 items-center">
                <Filter className="h-4 w-4 text-muted-foreground" />

                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {availableCourses.map(
                      (course: { id: string; name: string }) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quiz Content - Dynamic TabsContent for each status */}
          {["all", "live", "upcoming", "completed", "missed"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              {preferences.viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredQuizzes.map((quiz: QuizData) => (
                    <QuizCard
                      key={quiz.id}
                      quiz={quiz}
                      onViewResults={handleViewResults}
                    />
                  ))}
                  {filteredQuizzes.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        {status === "all" ? (
                          <AlertCircle className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                        ) : status === "live" ? (
                          <Play className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                        ) : status === "upcoming" ? (
                          <Clock className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                        ) : status === "completed" ? (
                          <CheckCircle className="h-8 w-8 text-violet-500 dark:text-violet-400" />
                        ) : (
                          <XCircle className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                        {status === "all"
                          ? "No quizzes found"
                          : `No ${status} quizzes`}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 max-w-md">
                        {status === "all"
                          ? "Try adjusting your search or filters to find quizzes"
                          : status === "live"
                            ? "Check back later for live quizzes"
                            : status === "upcoming"
                              ? "All caught up! No upcoming quizzes scheduled"
                              : status === "completed"
                                ? "Complete some quizzes to see them here"
                                : "Great job! You haven't missed any quizzes"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <QuizTable
                  quizzes={filteredQuizzes}
                  onViewResults={handleViewResults}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AuthGuard>
  );
};

export default Page;
