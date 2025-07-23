"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  Trophy,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  BarChart3,
  Eye,
  EyeOff,
  Users,
  Timer,
  Award,
  ChevronRight,
  Activity,
  LayoutDashboard,
  Target,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import StudentQuiz from "@/repo/student/quiz/student-quiz";
import StudentCourse from "@/repo/student/course/student-course";
import { useToast } from "@/hooks/use-toast";

interface QuizData {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: string | number;
  status: "LIVE" | "UPCOMING" | "COMPLETED" | "MISSED";
  course: string;
  courseName: string;
  courseCode: string;
  totalMarks?: number;
  questions?: number;
}

interface CourseData {
  id: string;
  name: string;
  code: string;
  instructor?: string;
  semester?:
    | string
    | {
        id: string;
        name: string;
        year: number;
      };
  enrollmentDate?: string;
  progress?: number;
}

type Quiz = {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration: string | number;
  status: "LIVE" | "UPCOMING" | "COMPLETED" | "MISSED";
  course: string;
  courseName: string;
  courseCode: string;
  totalMarks?: number;
  questions?: number;
};

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<string>("live");

  // Fetch student quizzes
  const {
    data: quizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useQuery({
    queryKey: ["student-quizzes"],
    queryFn: () => StudentQuiz.getAllStudentQuizzes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch student courses
  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["student-courses"],
    queryFn: () => StudentCourse.getAllStudentCourses(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Process quiz data
  const processedQuizzes = useMemo(() => {
    if (!quizzes || !Array.isArray(quizzes))
      return { live: [], upcoming: [], recent: [] };

    const now = new Date();
    const live: QuizData[] = [];
    const upcoming: QuizData[] = [];
    const recent: QuizData[] = [];

    quizzes.forEach((quiz: Quiz) => {
      try {
        // Ensure required fields exist
        if (!quiz.id || !quiz.name || !quiz.startTime || !quiz.endTime) {
          console.warn("Quiz missing required fields:", quiz);
          return;
        }

        const startTime = new Date(quiz.startTime);
        const endTime = new Date(quiz.endTime);

        // Check if dates are valid
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn("Invalid quiz dates:", quiz);
          return;
        }

        const processedQuiz: QuizData = {
          id: quiz.id,
          name: quiz.name,
          description: quiz.description || "",
          startTime: quiz.startTime,
          endTime: quiz.endTime,
          duration: quiz.duration || 0,
          course: quiz.course || "",
          courseName: quiz.courseName || "Unknown Course",
          courseCode: quiz.courseCode || "N/A",
          totalMarks: quiz.totalMarks,
          questions: quiz.questions,
          status: "COMPLETED", // Default, will be overridden below
        };

        if (now >= startTime && now <= endTime) {
          live.push({ ...processedQuiz, status: "LIVE" });
        } else if (now < startTime) {
          upcoming.push({ ...processedQuiz, status: "UPCOMING" });
        } else {
          recent.push({ ...processedQuiz, status: "COMPLETED" });
        }
      } catch (error) {
        console.error("Error processing quiz:", quiz, error);
      }
    });

    return {
      live: live.slice(0, 3),
      upcoming: upcoming.slice(0, 4),
      recent: recent.slice(0, 3),
    };
  }, [quizzes]);

  // Set default tab based on available quizzes
  useEffect(() => {
    if (!quizzesLoading && processedQuizzes) {
      if ((processedQuizzes?.live?.length || 0) > 0) {
        setActiveTab("live");
      } else if ((processedQuizzes?.upcoming?.length || 0) > 0) {
        setActiveTab("upcoming");
      }
    }
  }, [quizzesLoading, processedQuizzes]);

  const handleQuizAction = (quizId: string, action: "take" | "view") => {
    if (action === "take") {
      success("Redirecting to quiz", {
        description: "Taking you to the quiz page...",
      });
      // Navigate to quiz taking page
    } else {
      success("Viewing quiz details", {
        description: "Opening quiz information...",
      });
      // Navigate to quiz details/results page
    }
  };

  const formatDuration = (duration: string | number) => {
    // Handle different duration formats
    if (typeof duration === "number") {
      // If duration is in nanoseconds or milliseconds, convert to minutes
      let minutes;
      if (duration > 1000000000) {
        // Likely nanoseconds, convert to minutes
        minutes = Math.floor(duration / (1000000000 * 60));
      } else if (duration > 1000) {
        // Likely milliseconds, convert to minutes
        minutes = Math.floor(duration / (1000 * 60));
      } else {
        // Assume it's already in minutes
        minutes = duration;
      }

      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      if (hours > 0) {
        return `${hours}h ${mins}m`;
      }
      return `${mins}m`;
    }

    if (typeof duration === "string") {
      // Handle ISO 8601 duration format (PT1H30M)
      const match = duration.match(/PT(\d+H)?(\d+M)?/);
      if (match) {
        const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
        const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;

        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
      }

      // If it's already formatted, return as is
      return duration;
    }

    return "N/A";
  };

  const formatTimeRemaining = (startTime: string) => {
    try {
      const now = new Date();
      const start = new Date(startTime);

      // Check if the date is valid
      if (isNaN(start.getTime())) {
        return "Invalid date";
      }

      const diff = start.getTime() - now.getTime();

      if (diff <= 0) return "Started";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (error) {
      console.error("Error formatting time remaining:", error);
      return "N/A";
    }
  };

  if (quizzesError || coursesError) {
    error("Failed to load dashboard data", {
      description: "Please refresh the page to try again.",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Welcome back, {session?.user?.name || "Student"}! 👋
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    {"Here's what's happening with your studies today."}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <Badge variant="outline" className="px-4 py-2 text-sm border-2">
                <GraduationCap className="w-4 h-4 mr-2" />
                Student Dashboard
              </Badge>
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-secondary/5 rounded-full blur-lg"></div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/20"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Live Quizzes
                  </p>
                  <div className="text-3xl font-bold text-red-600 group-hover:scale-105 transition-transform">
                    {quizzesLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      processedQuizzes?.live?.length || 0
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Zap className="w-3 h-3 mr-1" />
                    Active now
                  </div>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-xl group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/20"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Upcoming
                  </p>
                  <div className="text-3xl font-bold text-orange-600 group-hover:scale-105 transition-transform">
                    {quizzesLoading ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      processedQuizzes?.upcoming?.length || 0
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Timer className="w-3 h-3 mr-1" />
                    Scheduled
                  </div>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-950/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20"></div>
            <CardContent className="p-6 relative z-10">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  My Courses
                </p>
                <div className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform">
                  {coursesLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    courses?.length || 0
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Enrolled
                </div>
              </div>
              <div className="absolute top-4 right-4 p-3 bg-green-100 dark:bg-green-950/30 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 group opacity-60">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20"></div>
            <CardContent className="p-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Avg Score
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-purple-600 group-hover:scale-105 transition-transform">
                  ---%
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Target className="w-3 h-3 mr-1" />
                  Performance
                </div>
              </div>
              <div className="absolute top-4 right-4 p-3 bg-purple-100 dark:bg-purple-950/30 rounded-xl group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Quizzes (3/4 width) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Quiz Tabs */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-background border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Quiz Activities</CardTitle>
                      <CardDescription>
                        Manage your active and upcoming quizzes
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="border-b bg-muted/20">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-transparent rounded-none">
                      <TabsTrigger
                        value="live"
                        className="relative data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-red-500"
                      >
                        <div className="flex items-center space-x-2">
                          <PlayCircle className="w-4 h-4" />
                          <span>Live Quizzes</span>
                          {(processedQuizzes?.live?.length || 0) > 0 && (
                            <Badge
                              variant="destructive"
                              className="ml-2 h-5 px-2 text-xs animate-pulse"
                            >
                              {processedQuizzes.live.length}
                            </Badge>
                          )}
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="upcoming"
                        className="relative data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500"
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Upcoming</span>
                          {(processedQuizzes?.upcoming?.length || 0) > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-2 h-5 px-2 text-xs"
                            >
                              {processedQuizzes.upcoming.length}
                            </Badge>
                          )}
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Live Quizzes Tab */}
                  <TabsContent value="live" className="p-6 space-y-4">
                    {quizzesLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <Card key={i} className="p-4">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (processedQuizzes?.live?.length || 0) === 0 ? (
                      <div className="text-center py-12">
                        <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-4">
                          <PlayCircle className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          No Live Quizzes
                        </h3>
                        <p className="text-muted-foreground">
                          There are no active quizzes at the moment. Check back
                          later!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(processedQuizzes?.live || []).map((quiz) => (
                          <Card
                            key={quiz.id}
                            className="group border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-950/20"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-lg">
                                      <PlayCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-semibold group-hover:text-red-600 transition-colors">
                                        {quiz.name}
                                      </h4>
                                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <span className="flex items-center">
                                          <BookOpen className="w-3 h-3 mr-1" />
                                          {quiz.courseCode || "N/A"}
                                        </span>
                                        <span className="flex items-center">
                                          <Timer className="w-3 h-3 mr-1" />
                                          {formatDuration(quiz.duration)}
                                        </span>
                                        <Badge
                                          variant="destructive"
                                          className="animate-pulse"
                                        >
                                          LIVE
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  {quiz.description && (
                                    <p className="text-sm text-muted-foreground pl-11">
                                      {quiz.description}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  onClick={() =>
                                    handleQuizAction(quiz.id, "take")
                                  }
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105"
                                  size="lg"
                                >
                                  <PlayCircle className="w-5 h-5 mr-2" />
                                  Take Quiz
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Upcoming Quizzes Tab */}
                  <TabsContent value="upcoming" className="p-6 space-y-4">
                    {quizzesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="p-4">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (processedQuizzes?.upcoming?.length || 0) === 0 ? (
                      <div className="text-center py-12">
                        <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-4">
                          <Calendar className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          No Upcoming Quizzes
                        </h3>
                        <p className="text-muted-foreground">
                          All caught up! No quizzes are scheduled for now.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(processedQuizzes?.upcoming || [])
                          .slice(0, 6)
                          .map((quiz) => (
                            <Card
                              key={quiz.id}
                              className="group border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20"
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-orange-100 dark:bg-orange-950/30 rounded-lg">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                      </div>
                                      <div>
                                        <h4 className="text-lg font-semibold group-hover:text-orange-600 transition-colors">
                                          {quiz.name}
                                        </h4>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                          <span className="flex items-center">
                                            <BookOpen className="w-3 h-3 mr-1" />
                                            {quiz.courseCode || "N/A"}
                                          </span>
                                          <span className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {quiz.startTime
                                              ? new Date(
                                                  quiz.startTime,
                                                ).toLocaleDateString()
                                              : "N/A"}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300"
                                          >
                                            {formatTimeRemaining(
                                              quiz.startTime,
                                            )}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    {quiz.description && (
                                      <p className="text-sm text-muted-foreground pl-11">
                                        {quiz.description}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() =>
                                      handleQuizAction(quiz.id, "view")
                                    }
                                    className="border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-800 dark:hover:bg-orange-950/20 group-hover:scale-105 transition-all duration-200"
                                  >
                                    <Eye className="w-5 h-5 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recently Released Results - Disabled */}
            <Card className="opacity-60 border-dashed">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted/20 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Recently Released Results</span>
                        <Badge variant="secondary">Coming Soon</Badge>
                      </CardTitle>
                      <CardDescription>
                        Latest quiz results and feedback will appear here
                      </CardDescription>
                    </div>
                  </div>
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <div className="p-4 bg-muted/10 rounded-full w-fit mx-auto mb-4">
                    <AlertCircle className="w-12 h-12" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    Results Feature Coming Soon
                  </p>
                  <p className="text-sm">
                    {
                      "We're working on bringing you detailed quiz results and performance analytics"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Courses & Performance (1/4 width) */}
          <div className="xl:col-span-1 space-y-6">
            {/* Enrolled Courses */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50/50 to-background dark:from-green-950/20 border-b">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">My Courses</CardTitle>
                    <CardDescription>Enrolled this semester</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {coursesLoading ? (
                    <div className="p-4 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : !courses ||
                    !Array.isArray(courses) ||
                    courses.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="p-4 bg-muted/10 rounded-full w-fit mx-auto mb-4">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">
                        No Courses Enrolled
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Contact your administrator to enroll in courses.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {courses.map((course: CourseData, index: number) => {
                        // Add error handling for individual courses
                        if (!course || !course.id) {
                          return null;
                        }

                        // Safely handle semester data
                        let semesterDisplay = "";
                        if (course.semester) {
                          if (typeof course.semester === "string") {
                            semesterDisplay = course.semester;
                          } else if (
                            course.semester &&
                            typeof course.semester === "object"
                          ) {
                            semesterDisplay = `${course.semester.name || "Unknown"} (${course.semester.year || "N/A"})`;
                          }
                        }

                        return (
                          <Card
                            key={course.id}
                            className="group border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-background to-muted/10"
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-mono bg-primary/5 border-primary/20"
                                  >
                                    {course.code || "N/A"}
                                  </Badge>
                                  <div className="p-1 bg-muted/20 rounded group-hover:bg-primary/10 transition-colors">
                                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                                    {course.name || "Unnamed Course"}
                                  </h4>
                                  {course.instructor && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {course.instructor}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    Course {index + 1}
                                  </span>
                                  {semesterDisplay && (
                                    <span>{semesterDisplay}</span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      {courses.length > 8 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-3"
                        >
                          <ChevronRight className="w-4 h-4 mr-1" />
                          View All Courses
                        </Button>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Performance Overview - Redesigned but Disabled */}
            <Card className="opacity-60 border-dashed overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50/50 to-background dark:from-purple-950/20 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted/20 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <span>Performance Analytics</span>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                        <span>Advanced insights</span>
                      </CardDescription>
                    </div>
                  </div>
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Mock Performance Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg border-dashed border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Best Score
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ---%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted/30 rounded-full">
                        <div className="h-2 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 rounded-full w-0"></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Historical high score
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg border-dashed border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Average
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ---%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted/30 rounded-full">
                        <div className="h-2 bg-gradient-to-r from-blue-400/30 to-blue-500/30 rounded-full w-0"></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Overall performance
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg border-dashed border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Trend
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ---
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 flex items-end space-x-1">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="flex-1 bg-muted/30 rounded-sm"
                            style={{ height: `${Math.random() * 20 + 10}px` }}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Performance over time
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center space-y-3">
                  <div className="p-3 bg-muted/10 rounded-full w-fit mx-auto">
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">
                      Advanced Analytics
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Detailed performance insights, progress tracking, and
                      personalized recommendations will be available soon.{" "}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
