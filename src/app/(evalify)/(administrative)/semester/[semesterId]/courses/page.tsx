"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSemesterCourses } from "@/components/admin/semesters/hook/use-semester-courses";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Terminal,
  Settings,
  Download,
  BookOpen,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import semesterQueries from "@/repo/semester-queries/semester-queries";
import { Course, User } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { CourseDialog } from "@/components/admin/semesters/courses/course-dialog";
import { AddManagerDialog } from "@/components/admin/semesters/managers/add-manager-dialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/lib/axios/axios-client";

export default function SemesterCoursesPage() {
  const params = useParams();
  const router = useRouter();
  const semesterId = params.semesterId as string;
  const { success, error, toast } = useToast();

  const {
    data: courses,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
    error: errorCourses,
  } = useSemesterCourses(semesterId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const queryClient = useQueryClient();

  const {
    data: semester,
    isLoading: isLoadingSemester,
    isError: isErrorSemester,
    error: errorSemester,
  } = useQuery({
    queryKey: ["semester", semesterId],
    queryFn: () => semesterQueries.getSemesterById(semesterId),
    enabled: !!semesterId,
  });

  // Query for semester managers (mock data for now)
  const {
    data: managers = [],
    isLoading: isLoadingManagers,
    isError: isErrorManagers,
    error: errorManagers,
  } = useQuery({
    queryKey: ["semesterManagers", semesterId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/api/semester/${semesterId}/managers`,
      );
      return response.data as User[];
    },
    enabled: !!semesterId,
  });

  const handleMutationSuccess = (action: "created" | "deleted") => {
    success(`Course ${action} successfully`);
    queryClient.invalidateQueries({ queryKey: ["courses", semesterId] });
    if (action === "created") setIsFormOpen(false);
    if (action === "deleted") setCourseToDelete(null);
  };

  const handleMutationError = (
    actionError: Error,
    action: "create" | "delete",
  ) => {
    error(`Failed to ${action} course: ${actionError.message}`);
  };

  const createMutation = useMutation({
    mutationFn: (course: Course) => {
      const newCourse: Course = {
        id: "",
        name: course.name,
        code: course.code,
        description: course.description,
        type: course.type,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
      return semesterQueries.createCourseForSemester(semesterId, newCourse);
    },
    onSuccess: () => handleMutationSuccess("created"),
    onError: (actionError) => handleMutationError(actionError, "create"),
  });

  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => {
      return semesterQueries.deleteCourseFromSemester(semesterId, courseId);
    },
    onSuccess: () => handleMutationSuccess("deleted"),
    onError: (actionError) => handleMutationError(actionError, "delete"),
  });

  const removeManagerMutation = useMutation({
    mutationFn: async (managerId: string) => {
      const response = await axiosInstance.delete(
        `/api/semester/${semesterId}/managers`,
        {
          data: { managersId: [managerId] },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      success("Manager removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["semesterManagers", semesterId],
      });
    },
    onError: (actionError: Error) => {
      error(`Failed to remove manager: ${actionError.message}`);
    },
  });

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleDelete = (course: Course) => {
    setCourseToDelete(course);
  };

  const handleSubmit = (data: unknown) => {
    createMutation.mutate(data as Course);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const handleExport = () => {
    toast("Export functionality will be available soon");
  };

  const handleSettings = () => {
    toast("Semester settings will be available soon");
  };

  const handleAddManager = () => {
    setIsManagerDialogOpen(true);
  };

  const handleRemoveManager = (managerId: string) => {
    removeManagerMutation.mutate(managerId);
  };

  if (isLoadingCourses || isLoadingSemester || isLoadingManagers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-6" />
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-20 w-32" />
              <Skeleton className="h-20 w-32" />
              <Skeleton className="h-20 w-32" />
            </div>
          </div>

          {/* Action Bar Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Course Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isErrorCourses || isErrorSemester || isErrorManagers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorCourses?.message ||
                errorSemester?.message ||
                errorManagers?.message ||
                "Failed to fetch data."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen 0">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {semester?.name || "Semester"}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Academic Year {semester?.year} •{" "}
                {semester?.isActive ? "Active" : "Inactive"} Semester
              </p>
            </div>
            <Badge
              variant={semester?.isActive ? "default" : "secondary"}
              className="px-3 py-1 text-sm"
            >
              {semester?.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total Courses
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {courses?.length || 0}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Academic Year
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {semester?.year}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Managers
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {managers?.length || 0}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Courses Section */}
          <div className="space-y-6 col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Courses
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage semester courses and assignments
                </p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleSettings}
                  disabled
                  className="flex-1 sm:flex-none"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled
                  className="flex-1 sm:flex-none"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button onClick={handleCreate} className="flex-1 sm:flex-none">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </div>
            </div>

            {/* Courses Grid */}
            {courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:scale-[1.02] cursor-pointer"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {course.name}
                          </CardTitle>
                          {course.code && (
                            <CardDescription className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {course.code}
                            </CardDescription>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCourseClick(course.id);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(course);
                              }}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
                        {course.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {course.type?.toString().replace("_", " ") ||
                            "Course"}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          Created{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No courses yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Get started by adding your first course to this semester.
                    You can organize your curriculum and track student progress.
                  </p>
                  <Button onClick={handleCreate}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Managers Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Managers
                </h2>
                <p className="text-slate-600 text-sm dark:text-slate-400">
                  Administrators overseeing this semester
                </p>
              </div>
              <Button
                onClick={handleAddManager}
                size="sm"
                className="w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Manager
              </Button>
            </div>

            {/* Managers List */}
            {managers && managers.length > 0 ? (
              <div className="space-y-4">
                {managers.map((manager) => (
                  <Card
                    key={manager.id}
                    className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="flex items-center justify-between gap-4 p-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={manager.image || ""} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {manager.name?.charAt(0) || "M"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {manager.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {manager.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <Separator className="my-1" />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleRemoveManager(manager.id)}
                            disabled={removeManagerMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {removeManagerMutation.isPending
                              ? "Removing..."
                              : "Remove Manager"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <UserCheck className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No managers assigned
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Assign managers to help oversee this semester. They can
                    monitor progress and assist with administrative tasks.
                  </p>
                  <Button onClick={handleAddManager}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Manager
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Dialogs */}
        {isFormOpen && (
          <CourseDialog
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        )}

        <AddManagerDialog
          isOpen={isManagerDialogOpen}
          onClose={() => setIsManagerDialogOpen(false)}
          onSuccess={() => {
            success("Managers updated successfully");
            queryClient.invalidateQueries({
              queryKey: ["semesterManagers", semesterId],
            });
          }}
          semesterId={semesterId}
        />

        <DeleteDialog
          isOpen={!!courseToDelete}
          onClose={() => setCourseToDelete(null)}
          onConfirm={() =>
            courseToDelete && deleteMutation.mutate(courseToDelete.id)
          }
          title="Delete Course"
          description={`Are you sure you want to delete the course "${courseToDelete?.name}"? This action cannot be undone and will remove all associated data.`}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
