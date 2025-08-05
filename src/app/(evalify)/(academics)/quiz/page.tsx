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
  X,
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

  // Function to clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCourse("all");
    setActiveTab("all");
  }, []);

  const { data: quizData, error } = useQuery({
    queryKey: ["studentQuizzes"],
    queryFn: () => StudentQuiz.getAllStudentQuizzes(),
  });

  // Filter quizzes based on search, course, and active tab
  const filteredQuizzes = useMemo(() => {
    if (!quizData) return [];

    let filtered = quizData;

    // Tab filter (status filter)
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (quiz: QuizData) =>
          quiz.status.toLowerCase() === activeTab.toLowerCase(),
      );
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

  const handleTakeQuiz = useCallback(
    (quizId: string) => {
      router.push(`/take-quiz/${quizId}`);
    },
    [router],
  );

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
            <div className="text-center">
              <div className="text-destructive text-lg font-semibold mb-2">
                Error Loading Quizzes
              </div>
              <p className="text-muted-foreground">{error.message}</p>
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
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="all" className="text-sm font-medium">
                  <span className="hidden sm:inline">All</span>
                  <span className="sm:hidden">All</span>
                  {quizCounts.all > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-2 text-xs"
                    >
                      {quizCounts.all}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="live" className="text-sm font-medium">
                  <Play className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Live</span>
                  {quizCounts.live > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-2 text-xs"
                    >
                      {quizCounts.live}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="text-sm font-medium">
                  <Clock className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Upcoming</span>
                  {quizCounts.upcoming > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-2 text-xs"
                    >
                      {quizCounts.upcoming}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-sm font-medium">
                  <CheckCircle className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Done</span>
                  {quizCounts.completed > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-2 text-xs"
                    >
                      {quizCounts.completed}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="missed" className="text-sm font-medium">
                  <XCircle className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Missed</span>
                  {quizCounts.missed > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-2 text-xs"
                    >
                      {quizCounts.missed}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant={
                    preferences.viewMode === "grid" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleViewModeChange("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={
                    preferences.viewMode === "table" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleViewModeChange("table")}
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

          {/* Results Summary and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredQuizzes.length} quiz
                {filteredQuizzes.length !== 1 ? "es" : ""} found
              </span>
            </div>

            {(debouncedSearchQuery || selectedCourse !== "all") && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filters:</span>
                {debouncedSearchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {debouncedSearchQuery}
                  </Badge>
                )}
                {selectedCourse !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Course: {selectedCourse}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Quiz Content - Dynamic TabsContent for each status */}
          {["all", "live", "upcoming", "completed", "missed"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              {preferences.viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes.map((quiz: QuizData) => (
                    <QuizCard
                      key={quiz.id}
                      quiz={quiz}
                      onTakeQuiz={handleTakeQuiz}
                      onViewResults={handleViewResults}
                    />
                  ))}
                  {filteredQuizzes.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      {status === "all" ? (
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      ) : status === "live" ? (
                        <Play className="h-12 w-12 text-muted-foreground mb-4" />
                      ) : status === "upcoming" ? (
                        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      ) : status === "completed" ? (
                        <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      ) : (
                        <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      )}
                      <h3 className="text-lg font-semibold mb-2">
                        {status === "all"
                          ? "No quizzes found"
                          : `No ${status} quizzes`}
                      </h3>
                      <p className="text-muted-foreground">
                        {status === "all"
                          ? "Try adjusting your search or filters"
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
                  onTakeQuiz={handleTakeQuiz}
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
