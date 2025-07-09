"use client";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseBatchesTable } from "@/components/admin/course/batch-table";
import { CourseStudentsTable } from "@/components/admin/course/student-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Batch, User } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { courseQueries } from "@/repo/course-queries/course-queries";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { AssignBatchDialog } from "@/components/admin/course/assign-batch-dialog";
import { AssignStudentDialog } from "@/components/admin/course/assign-student-dialog";
import { AssignInstructorDialog } from "@/components/admin/course/assign-instructor-dialog";
import { useCourseInstructors } from "@/components/admin/course/hooks/use-course-instructors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  TrashIcon,
  UsersIcon,
  BookOpenIcon,
  GraduationCapIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserPlusIcon,
  TrendingUpIcon,
  BarChart3Icon,
} from "lucide-react";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseid as string;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "batches";

  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => {
      return courseQueries.getCourseById(courseId);
    },
    enabled: !!courseId,
  });
  const { data: instructors, isLoading: instructorsLoading } =
    useCourseInstructors(courseId);

  // Calculate stats - using queries to get accurate counts
  const { data: courseBatches } = useQuery({
    queryKey: ["courseBatches", courseId],
    queryFn: () =>
      courseQueries.getCourseBatches?.(courseId) || Promise.resolve([]),
    enabled: !!courseId,
  });

  const { data: courseStudents } = useQuery({
    queryKey: ["courseStudents", courseId],
    queryFn: () =>
      courseQueries.getCourseStudents?.(courseId) || Promise.resolve([]),
    enabled: !!courseId,
  });

  const queryClient = useQueryClient();

  const [isAssignBatchOpen, setIsAssignBatchOpen] = React.useState(false);
  const [isAssignStudentOpen, setIsAssignStudentOpen] = React.useState(false);
  const [isAssignInstructorOpen, setIsAssignInstructorOpen] =
    React.useState(false);
  const [batchToDelete, setBatchToDelete] = React.useState<Batch | null>(null);
  const [studentToDelete, setStudentToDelete] = React.useState<User | null>(
    null,
  );
  const [instructorToDelete, setInstructorToDelete] =
    React.useState<User | null>(null);

  const handleTabChange = (value: string) => {
    router.push(`${pathname}?tab=${value}`);
  };

  const handleMutationSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["courseBatches", courseId] });
    queryClient.invalidateQueries({ queryKey: ["courseStudents", courseId] });
    queryClient.invalidateQueries({
      queryKey: ["unassignedBatches", courseId],
    });
    queryClient.invalidateQueries({
      queryKey: ["unassignedStudents", courseId],
    });
    queryClient.invalidateQueries({
      queryKey: ["courseInstructors", courseId],
    });
  };

  const assignBatchesMutation = useMutation({
    mutationFn: (batchIds: string[]) => {
      return courseQueries.assignBatchesToCourse(courseId, batchIds);
    },
    onSuccess: () => {
      handleMutationSuccess("Batches assigned successfully");
      setIsAssignBatchOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeBatchMutation = useMutation({
    mutationFn: (batchId: string) => {
      return courseQueries.removeBatchFromCourse(courseId, batchId);
    },
    onSuccess: () => {
      handleMutationSuccess("Batch removed successfully");
      setBatchToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const assignStudentsMutation = useMutation({
    mutationFn: (studentIds: string[]) => {
      return courseQueries.assignStudentsToCourse(courseId, studentIds);
    },
    onSuccess: () => {
      handleMutationSuccess("Students assigned successfully");
      setIsAssignStudentOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeStudentMutation = useMutation({
    mutationFn: (studentId: string) => {
      return courseQueries.removeStudentFromCourse(courseId, studentId);
    },
    onSuccess: () => {
      handleMutationSuccess("Student removed successfully");
      setStudentToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const assignInstructorsMutation = useMutation({
    mutationFn: (instructorIds: string[]) => {
      return courseQueries.assignInstructorsToCourse(courseId, instructorIds);
    },
    onSuccess: () => {
      handleMutationSuccess("Instructors assigned successfully");
      setIsAssignInstructorOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const removeInstructorMutation = useMutation({
    mutationFn: (instructorId: string) => {
      return courseQueries.removeInstructorFromCourse(courseId, instructorId);
    },
    onSuccess: () => {
      handleMutationSuccess("Instructor removed successfully");
      setInstructorToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-6 w-16" />
              <ChevronRightIcon className="h-4 w-4 text-slate-400" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-8">
              <Skeleton className="h-10 w-80 mb-2" />
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-8 w-8 rounded-lg mb-2" />
                      <Skeleton className="h-6 w-16 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-8 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Instructors Section Skeleton */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600 dark:text-red-400">
              Error
            </CardTitle>
            <CardDescription>Failed to load course details</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBatches = courseBatches?.length || 0;
  const totalStudents = courseStudents?.length || 0;
  const totalInstructors = instructors?.length || 0;
  const activeQuizzes = 0; // This would come from your data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-slate-600 dark:text-slate-400">
          <BookOpenIcon className="h-4 w-4" />
          <span>Courses</span>
          <ChevronRightIcon className="h-4 w-4" />
          <span className="text-slate-900 dark:text-slate-100 font-medium">
            {course?.name}
          </span>
        </div>

        {/* Course Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24"></div>
          <div className="p-8 -mt-12">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border">
                  <BookOpenIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {course?.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="secondary" className="text-sm">
                      {course?.code}
                    </Badge>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-sm">Active Course</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                    {course?.description ||
                      "No description available for this course."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <GraduationCapIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Batches
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalBatches}
                  </p>
                </div>
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingUpIcon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <UsersIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Students
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalStudents}
                  </p>
                </div>
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingUpIcon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <UserPlusIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Instructors
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalInstructors}
                  </p>
                </div>
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingUpIcon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <BarChart3Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Active Quizzes
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {activeQuizzes}
                  </p>
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  <ClockIcon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructors Section */}
        <Card className="mb-8 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <UserPlusIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Course Instructors</CardTitle>
                  <CardDescription>
                    Manage teaching staff for this course
                  </CardDescription>
                </div>
              </div>
              <Button
                onClick={() => setIsAssignInstructorOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Add Instructor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {instructorsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : instructors && instructors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="group flex items-center justify-between p-4 border rounded-xl hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 bg-white dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-700">
                        <AvatarImage src={instructor.image || ""} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                          {instructor.name?.charAt(0) || "I"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {instructor.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {instructor.email}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          Instructor
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setInstructorToDelete(instructor)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto mb-4">
                  <UserPlusIcon className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No Instructors Assigned
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Start by adding instructors to teach this course.
                </p>
                <Button
                  onClick={() => setIsAssignInstructorOpen(true)}
                  variant="outline"
                >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add First Instructor
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <GraduationCapIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Course Management</CardTitle>
                <CardDescription>
                  Manage batches and students enrolled in this course
                </CardDescription>
              </div>
            </div>
            <Tabs
              value={tab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger
                  value="batches"
                  className="flex items-center gap-2"
                >
                  <GraduationCapIcon className="h-4 w-4" />
                  Batches ({totalBatches})
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="flex items-center gap-2"
                >
                  <UsersIcon className="h-4 w-4" />
                  Students ({totalStudents})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={handleTabChange}>
              <TabsContent value="batches" className="mt-0">
                <CourseBatchesTable
                  courseId={courseId}
                  onAssign={() => setIsAssignBatchOpen(true)}
                  onDelete={setBatchToDelete}
                />
              </TabsContent>
              <TabsContent value="students" className="mt-0">
                <CourseStudentsTable
                  courseId={courseId}
                  onAssign={() => setIsAssignStudentOpen(true)}
                  onDelete={setStudentToDelete}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <AssignBatchDialog
        isOpen={isAssignBatchOpen}
        onClose={() => setIsAssignBatchOpen(false)}
        onAssign={(batchIds) => assignBatchesMutation.mutate(batchIds)}
        isAssigning={assignBatchesMutation.isPending}
      />
      <AssignStudentDialog
        isOpen={isAssignStudentOpen}
        onClose={() => setIsAssignStudentOpen(false)}
        onAssign={(studentIds) => assignStudentsMutation.mutate(studentIds)}
        isAssigning={assignStudentsMutation.isPending}
        courseId={courseId}
      />
      <AssignInstructorDialog
        isOpen={isAssignInstructorOpen}
        onClose={() => setIsAssignInstructorOpen(false)}
        onAssign={(instructorIds) =>
          assignInstructorsMutation.mutate(instructorIds)
        }
        isAssigning={assignInstructorsMutation.isPending}
        courseId={courseId}
      />
      <DeleteDialog
        isOpen={!!batchToDelete}
        onClose={() => setBatchToDelete(null)}
        onConfirm={() =>
          batchToDelete && removeBatchMutation.mutate(batchToDelete.id)
        }
        title={`Remove ${batchToDelete?.name}`}
        description="Are you sure you want to remove this batch from the course?"
        isLoading={removeBatchMutation.isPending}
      />
      <DeleteDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() =>
          studentToDelete && removeStudentMutation.mutate(studentToDelete.id)
        }
        title={`Remove ${studentToDelete?.name}`}
        description="Are you sure you want to remove this student from the course?"
        isLoading={removeStudentMutation.isPending}
      />
      <DeleteDialog
        isOpen={!!instructorToDelete}
        onClose={() => setInstructorToDelete(null)}
        onConfirm={() =>
          instructorToDelete &&
          removeInstructorMutation.mutate(instructorToDelete.id)
        }
        title={`Remove ${instructorToDelete?.name}`}
        description="Are you sure you want to remove this instructor from the course?"
        isLoading={removeInstructorMutation.isPending}
      />
    </div>
  );
}
