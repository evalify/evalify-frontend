"use client";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import {
  Users,
  GraduationCap,
  Calendar,
  FlaskConical,
  BookOpen,
  FileText,
  Trophy,
  CheckCircle,
  Clock,
  PlayCircle,
  ExternalLink,
  Activity,
  Shield,
  Database,
  BarChart3,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import axiosInstance from "@/lib/axios/axios-client";

interface DashboardData {
  bankCount: { count: number };
  courseCount: { count: number };
  batchCount: { count: number };
  userCount: {
    STUDENT: number;
    MANAGER: number;
    ADMIN: number;
    FACULTY: number;
  };
  semesterCount: { count: number };
  quizCount: {
    total: number;
    live: number;
    upcoming: number;
    completed: number;
  };
}

const administrationItems = [
  {
    title: "Users",
    url: "/user",
    icon: Users,
    description: "Manage system users",
    color: "text-blue-600",
  },
  {
    title: "Batches",
    url: "/batch",
    icon: GraduationCap,
    description: "Manage student batches",
    color: "text-green-600",
  },
  {
    title: "Semester",
    url: "/semester",
    icon: Calendar,
    description: "Manage academic semesters",
    color: "text-purple-600",
  },
  {
    title: "Departments",
    url: "/department",
    icon: GraduationCap,
    description: "Manage departments",
    color: "text-orange-600",
  },
  {
    title: "Labs",
    url: "/lab",
    icon: FlaskConical,
    description: "Manage lab facilities",
    color: "text-cyan-600",
  },
];

const externalServices = [
  {
    title: "System Logs",
    url: `${process.env.NEXT_PUBLIC_LOGS}`,
    icon: FileText,
    description: "View application logs",
    external: true,
    color: "text-gray-600",
  },
  {
    title: "MinIO Storage",
    url: `${process.env.NEXT_PUBLIC_MINIO}`,
    icon: Database,
    description: "Object storage console",
    external: true,
    color: "text-red-600",
  },
  {
    title: "Metrics Dashboard",
    url: `${process.env.NEXT_PUBLIC_METRICS}`,
    icon: BarChart3,
    description: "System performance metrics",
    external: true,
    color: "text-yellow-600",
  },
  {
    title: "Keycloak Admin",
    url: `${process.env.NEXT_PUBLIC_AUTH}`,
    icon: Shield,
    description: "Authentication provider",
    external: true,
    color: "text-indigo-600",
  },
];

const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const [
      bankCount,
      courseCount,
      batchCount,
      userCount,
      semesterCount,
      quizCount,
    ] = await Promise.all([
      axiosInstance.get("/api/bank/count"),
      axiosInstance.get("/api/course/count"),
      axiosInstance.get("/api/batch/count"),
      axiosInstance.get("/api/user/count"),
      axiosInstance.get("/api/semester/count"),
      axiosInstance.get("/api/quiz/count"),
    ]);

    return {
      bankCount: bankCount.data,
      courseCount: courseCount.data,
      batchCount: batchCount.data,
      userCount: userCount.data,
      semesterCount: semesterCount.data,
      quizCount: quizCount.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

function StatsCards({ data }: { data: DashboardData }) {
  const totalUsers = Object.values(data.userCount).reduce(
    (sum: number, count: number) => sum + count,
    0,
  );

  return (
    <div className="space-y-6">
      {/* User Statistics Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">All system users</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.userCount.STUDENT}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.userCount.FACULTY}</div>
              <p className="text-xs text-muted-foreground">Teaching staff</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Managers</CardTitle>
              <Shield className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.userCount.MANAGER}</div>
              <p className="text-xs text-muted-foreground">System managers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.userCount.ADMIN}</div>
              <p className="text-xs text-muted-foreground">
                System administrators
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quiz & Academic Resources Combined Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quiz Statistics */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              Quiz Statistics
            </CardTitle>
            <CardDescription>Assessment overview and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Total Quizzes
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {data.quizCount.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-full">
                  <Trophy className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Live Quizzes
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {data.quizCount.live}
                  </p>
                </div>
                <div className="p-3 bg-green-200 dark:bg-green-800 rounded-full">
                  <PlayCircle className="h-6 w-6 text-green-700 dark:text-green-300" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Upcoming
                  </p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                    {data.quizCount.upcoming}
                  </p>
                </div>
                <div className="p-3 bg-amber-200 dark:bg-amber-800 rounded-full">
                  <Clock className="h-6 w-6 text-amber-700 dark:text-amber-300" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {data.quizCount.completed}
                  </p>
                </div>
                <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                  <CheckCircle className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Resources */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Academic Resources
            </CardTitle>
            <CardDescription>
              Educational infrastructure overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Courses
                  </p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                    {data.courseCount.count}
                  </p>
                </div>
                <div className="p-3 bg-orange-200 dark:bg-orange-800 rounded-full">
                  <BookOpen className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <div>
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                    Batches
                  </p>
                  <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">
                    {data.batchCount.count}
                  </p>
                </div>
                <div className="p-3 bg-cyan-200 dark:bg-cyan-800 rounded-full">
                  <GraduationCap className="h-6 w-6 text-cyan-700 dark:text-cyan-300" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    Semesters
                  </p>
                  <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                    {data.semesterCount.count}
                  </p>
                </div>
                <div className="p-3 bg-indigo-200 dark:bg-indigo-800 rounded-full">
                  <Calendar className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <div>
                  <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
                    Question Banks
                  </p>
                  <p className="text-3xl font-bold text-pink-900 dark:text-pink-100">
                    {data.bankCount.count}
                  </p>
                </div>
                <div className="p-3 bg-pink-200 dark:bg-pink-800 rounded-full">
                  <FileText className="h-6 w-6 text-pink-700 dark:text-pink-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* User Statistics Skeleton */}
      <div>
        <Skeleton className="h-6 w-[150px] mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => (
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

      {/* Combined Quiz & Academic Resources Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quiz Statistics Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                >
                  <div>
                    <Skeleton className="h-4 w-[80px] mb-2" />
                    <Skeleton className="h-8 w-[50px]" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Academic Resources Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-4 w-[220px]" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                >
                  <div>
                    <Skeleton className="h-4 w-[80px] mb-2" />
                    <Skeleton className="h-8 w-[50px]" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-[60px]" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[50px]" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardContent({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <StatsCards data={data} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Administrative Functions
            </CardTitle>
            <CardDescription>
              Manage system components and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {administrationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.url}>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4 hover:bg-accent transition-colors"
                    >
                      <Icon className={`h-4 w-4 mr-1 ${item.color}`} />
                      <div className="text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Services */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Services
            </CardTitle>
            <CardDescription>External tools and monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {externalServices.map((service) => {
              const Icon = service.icon;
              const buttonContent = (
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className={`h-4 w-4 ${service.color}`} />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{service.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {service.description}
                      </div>
                    </div>
                    {service.external && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </Button>
              );

              if (service.external) {
                return (
                  <a
                    key={service.title}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {buttonContent}
                  </a>
                );
              }

              return (
                <Link key={service.title} href={service.url} className="block">
                  {buttonContent}
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: errorToast } = useToast();

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchDashboardData();
      setData(result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      errorToast("Error", {
        description: "Failed to load dashboard data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [errorToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your educational platform
            </p>
          </div>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your educational platform
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Failed to load dashboard
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the dashboard data.
            </p>
            <Button onClick={() => loadDashboardData()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your educational platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Online
          </Badge>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent data={data} />
      </Suspense>
    </div>
  );
}
