"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Database,
  Calendar,
  Clock,
  Plus,
  Settings,
  ChevronRight,
  GraduationCap,
  Activity,
  Trophy,
  Eye,
  Edit,
} from "lucide-react";
import { courseQueries } from "@/repo/course-queries/course-queries";
import Bank from "@/repo/bank/bank";
import Quiz from "@/repo/quiz/quiz";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Define the quiz type based on the Quiz repo structure
type QuizType = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  startTime: string;
  endTime: string;
  duration: number;
  password: string;
  fullScreen: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  linearQuiz: boolean;
  calculator: boolean;
  autoSubmit: boolean;
  publishResult: boolean;
  publishQuiz: boolean;
  section: string[];
  course: string[];
  student: string[];
  lab: string[];
  batch: string[];
  createdAt: string;
  createdBy: string;
};

export default function StaffDashboardPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  // Fetch courses handled by the user
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses-handled"],
    queryFn: courseQueries.getCoursesHandledByUser,
  });

  // Fetch all banks
  const { data: banksData, isLoading: banksLoading } = useQuery({
    queryKey: ["banks"],
    queryFn: () => Bank.getAllBanks(),
  });

  // Fetch all quizzes
  const { data: quizzes = [] as QuizType[], isLoading: quizzesLoading } =
    useQuery({
      queryKey: ["quizzes"],
      queryFn: Quiz.getAllQuizzes,
    });

  const banks = banksData?.content || [];
  const recentQuizzes = quizzes.slice(0, 5);
  const recentBanks = banks.slice(0, 5);

  const handleComingSoon = (feature: string) => {
    toast("Coming Soon!", {
      description: `${feature} feature will be available in the next update.`,
    });
  };

  const stats = [
    {
      title: "Active Courses",
      value: courses.length,
      description: "Courses you're teaching",
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-300",
      bgColor:
        "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-200 dark:bg-blue-800",
    },
    {
      title: "Active Quizzes",
      value: quizzes.length,
      description: "Published assessments",
      icon: Trophy,
      color: "text-purple-600 dark:text-purple-300",
      bgColor:
        "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      iconBg: "bg-purple-200 dark:bg-purple-800",
    },
    {
      title: "Question Banks",
      value: banks.length,
      description: "Available question sets",
      icon: Database,
      color: "text-green-600 dark:text-green-300",
      bgColor:
        "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconBg: "bg-green-200 dark:bg-green-800",
    },
  ];

  const quickActions = [
    {
      title: "Create Quiz",
      description: "Design a new assessment",
      icon: Plus,
      color: "text-blue-600 dark:text-blue-300",
      onClick: () => handleComingSoon("Create Quiz"),
    },
    {
      title: "Question Bank",
      description: "Manage your questions",
      icon: Database,
      color: "text-green-600 dark:text-green-300",
      onClick: () => router.push("/bank"),
    },
    {
      title: "Settings",
      description: "Configure preferences",
      icon: Settings,
      color: "text-gray-600 dark:text-gray-300",
      onClick: () => router.push("/settings"),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {session?.user?.name || "User"}!
            </h1>
            <p className="text-muted-foreground">
              {"Here's your teaching dashboard overview"}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {session?.user.groups.includes("manager") ? "Manager" : "Faculty"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div
                className={`flex items-center justify-between p-4 ${stat.bgColor} rounded-lg border ${stat.borderColor}`}
              >
                <div>
                  <p
                    className={`text-sm font-medium ${stat.color.replace("text-", "text-").replace("dark:text-", "dark:text-")}`}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-3xl font-bold ${stat.color.replace("-600", "-900").replace("-300", "-100")}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 ${stat.iconBg} rounded-full`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-accent transition-colors"
                  onClick={action.onClick}
                >
                  <action.icon className={`h-4 w-4 mr-1 ${action.color}`} />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full">
                  <Trophy className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <div className="font-medium text-sm">Quiz Created</div>
                  <div className="text-xs text-muted-foreground">
                    2 hours ago
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                  <BookOpen className="h-4 w-4 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <div className="font-medium text-sm">Course Updated</div>
                  <div className="text-xs text-muted-foreground">
                    5 hours ago
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-full">
                  <Database className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <div className="font-medium text-sm">Bank Added</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses and Quizzes Combined */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Courses */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              My Courses
            </CardTitle>
            <CardDescription>
              {"Courses you're currently teaching"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : courses.length > 0 ? (
              <div className="space-y-3">
                {courses.slice(0, 4).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => router.push(`/course/${course.id}/quiz`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                          {course.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                        >
                          {course.code}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Activity className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600 dark:text-green-400">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {courses.length > 4 && (
                  <Button
                    variant="ghost"
                    className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => router.push("/course")}
                  >
                    View All {courses.length} Courses
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <GraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No courses assigned yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Quizzes */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              Recent Quizzes
            </CardTitle>
            <CardDescription>
              Your latest assessments and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quizzesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
              </div>
            ) : recentQuizzes.length > 0 ? (
              <div className="space-y-3">
                {recentQuizzes.map((quiz: QuizType) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => handleComingSoon("Quiz Details")}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                          {quiz.name}
                        </h3>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-purple-200 dark:hover:bg-purple-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComingSoon("View Quiz");
                            }}
                          >
                            <Eye className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-purple-200 dark:hover:bg-purple-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComingSoon("Edit Quiz");
                            }}
                          >
                            <Edit className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-purple-700 dark:text-purple-300 line-clamp-1 mb-2">
                        {quiz.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
                            <span className="text-sm text-purple-600 dark:text-purple-400">
                              {quiz.duration}m
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
                            <span className="text-sm text-purple-600 dark:text-purple-400">
                              {new Date(quiz.startTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={quiz.publishQuiz ? "default" : "outline"}
                          className={
                            quiz.publishQuiz
                              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                              : ""
                          }
                        >
                          {quiz.publishQuiz ? "Live" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No quizzes created yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Question Banks */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600 dark:text-green-300" />
            Question Banks
          </CardTitle>
          <CardDescription>
            Your question repositories and collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {banksLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
            </div>
          ) : recentBanks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentBanks.map((bank) => (
                <div
                  key={bank.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => router.push(`/bank/${bank.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-900 dark:text-green-100">
                        {bank.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-xs border-green-300 dark:border-green-600 text-green-700 dark:text-green-300"
                      >
                        {bank.courseCode}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-green-700 dark:text-green-300">
                      <span>{bank.questions} questions</span>
                      <span>•</span>
                      <span>{bank.topics} topics</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No question banks created yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
