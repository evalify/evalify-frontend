"use client";

import React, { useMemo, useState, Suspense, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  Activity,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
}

// Skeleton Components
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Statistics Skeleton */}
      <div>
        <Skeleton className="h-6 w-[150px] mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-4 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[120px]" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[80px]" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Statistics Component
function StatisticsCards({
  processedQuizzes,
  courses,
  quizzesLoading,
  coursesLoading,
}: {
  processedQuizzes: {
    live?: QuizData[];
    upcoming?: QuizData[];
    completed?: QuizData[];
    missed?: QuizData[];
  };
  courses: CourseData[];
  quizzesLoading: boolean;
  coursesLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Live Quizzes
                </p>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {quizzesLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    processedQuizzes?.live?.length || 0
                  )}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Active now
                </p>
              </div>
              <div className="p-3 bg-green-200 dark:bg-green-800 rounded-full">
                <PlayCircle className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Upcoming
                </p>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {quizzesLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    processedQuizzes?.upcoming?.length || 0
                  )}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Scheduled
                </p>
              </div>
              <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-full">
                <Clock className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  My Courses
                </p>
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {coursesLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    courses?.length || 0
                  )}
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Enrolled
                </p>
              </div>
              <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Completed
                </p>
                <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {quizzesLoading ? (
                    <Skeleton className="h-8 w-8" />
                  ) : (
                    processedQuizzes?.completed?.length || 0
                  )}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Finished
                </p>
              </div>
              <div className="p-3 bg-orange-200 dark:bg-orange-800 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-orange-700 dark:text-orange-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Quiz Activities Component
function QuizActivities({
  processedQuizzes,
  quizzesLoading,
  activeTab,
  setActiveTab,
  handleQuizAction,
  formatTimeRemaining,
}: {
  processedQuizzes: {
    live?: QuizData[];
    upcoming?: QuizData[];
    completed?: QuizData[];
    missed?: QuizData[];
  };
  quizzesLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleQuizAction: (id: string, action: "take" | "view") => void;
  formatTimeRemaining: (startTime: string) => string;
}) {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <div>
            <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100">
              Quiz Activities
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Assessment overview and status
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger
              value="live"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              Live ({processedQuizzes?.live?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
            >
              Upcoming ({processedQuizzes?.upcoming?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-4">
            <div className="space-y-3">
              {quizzesLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : processedQuizzes?.live && processedQuizzes.live.length > 0 ? (
                processedQuizzes.live.map((quiz: QuizData) => (
                  <Card
                    key={quiz.id}
                    className="border border-slate-200 dark:border-slate-700"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">
                            {quiz.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {quiz.courseCode}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleQuizAction(quiz.id, "take")}
                        >
                          Take Quiz
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No live quizzes at the moment
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            <div className="space-y-3">
              {quizzesLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : processedQuizzes?.upcoming &&
                processedQuizzes.upcoming.length > 0 ? (
                processedQuizzes.upcoming.map((quiz: QuizData) => (
                  <Card
                    key={quiz.id}
                    className="border border-slate-200 dark:border-slate-700"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">
                            {quiz.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {quiz.courseCode}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Starts in {formatTimeRemaining(quiz.startTime)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuizAction(quiz.id, "view")}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No upcoming quizzes scheduled
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Courses Section Component
function CoursesSection({
  courses,
  coursesLoading,
}: {
  courses: CourseData[];
  coursesLoading: boolean;
}) {

  const handleCourseClick = (courseId: string, courseName: string) => {
    // TODO: Navigate to course details when route is available
    // router.push(`/courses/${courseId}`);
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <div>
            <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100">
              Enrolled Courses
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Your current semester courses
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6 pt-0">
        <div className="space-y-3">
          {coursesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : !courses || !Array.isArray(courses) || courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
              <h3 className="font-medium mb-2 text-slate-700 dark:text-slate-300">
                No Courses Enrolled
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Contact your administrator to enroll in courses.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {courses.slice(0, 5).map((course: CourseData) => {
                if (!course || !course.id) return null;

                return (
                  <Card
                    key={course.id}
                    onClick={() =>
                      handleCourseClick(
                        course.id,
                        course.name || "Unnamed Course",
                      )
                    }
                    className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {course.code || "N/A"}
                            </Badge>
                            <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">
                              {course.name || "Unnamed Course"}
                            </h4>
                          </div>
                          {course.instructor && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {course.instructor}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {courses.length > 5 && (
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  <ChevronRight className="w-4 h-4 mr-1" />
                  View All Courses ({courses.length})
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Content Component
function DashboardContent({
  data,
}: {
  data: {
    processedQuizzes: {
      live?: QuizData[];
      upcoming?: QuizData[];
      completed?: QuizData[];
      missed?: QuizData[];
    };
    courses: CourseData[];
    quizzesLoading: boolean;
    coursesLoading: boolean;
  };
}) {
  const [activeTab, setActiveTab] = useState<string>("live");
  const { info } = useToast();
  const router = useRouter();

  const { processedQuizzes, courses, quizzesLoading, coursesLoading } = data;

  const handleQuizAction = useCallback(
    (id: string, action: "take" | "view") => {
      if (action === "take") {
        router.push(`/quiz/${id}/instructions`);
      } else {
        router.push(`/quiz/${id}/instructions`);
      }
    },
    [router],
  );

  const formatTimeRemaining = (startTime: string) => {
    try {
      const now = new Date();
      const start = new Date(startTime);

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

  return (
    <div className="space-y-6">
      <StatisticsCards
        processedQuizzes={processedQuizzes}
        courses={courses}
        quizzesLoading={quizzesLoading}
        coursesLoading={coursesLoading}
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Quiz Activities */}
        <div>
          <QuizActivities
            processedQuizzes={processedQuizzes}
            quizzesLoading={quizzesLoading}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleQuizAction={handleQuizAction}
            formatTimeRemaining={formatTimeRemaining}
          />
        </div>

        {/* Courses Panel */}
        <div>
          <CoursesSection courses={courses} coursesLoading={coursesLoading} />
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { data: session } = useSession();

  // Quiz Data
  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ["student-quizzes", session?.user?.email],
    queryFn: () => StudentQuiz.getAllStudentQuizzes(),
    enabled: !!session?.user?.email,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Course Data
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["student-courses", session?.user?.email],
    queryFn: () => StudentCourse.getAllStudentCourses(),
    enabled: !!session?.user?.email,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });

  // Process quiz data
  const processedQuizzes = useMemo(() => {
    if (!quizzes || !Array.isArray(quizzes)) {
      return { live: [], upcoming: [], completed: [], missed: [] };
    }

    const now = new Date();

    return quizzes.reduce(
      (acc, quiz) => {
        const startTime = new Date(quiz.startTime || quiz.scheduledStartTime);
        const endTime = new Date(quiz.endTime || quiz.scheduledEndTime);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          return acc;
        }

        if (now >= startTime && now <= endTime) {
          acc.live.push(quiz);
        } else if (now < startTime) {
          acc.upcoming.push(quiz);
        } else if (now > endTime) {
          if (quiz.status === "MISSED") {
            acc.missed.push(quiz);
          } else {
            acc.completed.push(quiz);
          }
        }

        return acc;
      },
      { live: [], upcoming: [], completed: [], missed: [] } as {
        live: QuizData[];
        upcoming: QuizData[];
        completed: QuizData[];
        missed: QuizData[];
      },
    );
  }, [quizzes]);

  // Loading state
  if (quizzesLoading || coursesLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Student Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor and manage your educational activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              System Online
            </span>
          </div>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent
          data={{
            processedQuizzes,
            courses,
            quizzesLoading,
            coursesLoading,
          }}
        />
      </Suspense>
    </div>
  );
}
