"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useSemesterCourses } from "@/components/admin/semesters/hook/use-semester-courses";
import CourseList from "@/components/admin/semesters/courses/course-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PlusCircle, Terminal } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import semesterQueries from "@/repo/semester-queries/semester-queries";
import { Course } from "@/types/types";
import { toast } from "sonner";
import { CourseDialog } from "@/components/admin/semesters/courses/course-dialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import SemesterDetailsHeader from "@/components/admin/semesters/semester-details-header";

export default function SemesterCoursesPage() {
  const params = useParams();
  const semesterId = params.semesterId as string;
  const {
    data: courses,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
    error: errorCourses,
  } = useSemesterCourses(semesterId);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const handleMutationSuccess = (action: "created" | "deleted") => {
    toast.success(`Course ${action} successfully`);
    queryClient.invalidateQueries({ queryKey: ["courses", semesterId] });
    if (action === "created") setIsFormOpen(false);
    if (action === "deleted") setCourseToDelete(null);
  };

  const handleMutationError = (error: Error, action: "create" | "delete") => {
    toast.error(`Failed to ${action} course: ${error.message}`);
  };

  const createMutation = useMutation({
    mutationFn: (course: Course) => {
      const newCourse: Course = {
        id: "",
        name: course.name,
        description: course.description,
        type: course.type,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
      return semesterQueries.createCourseForSemester(semesterId, newCourse);
    },
    onSuccess: () => handleMutationSuccess("created"),
    onError: (error) => handleMutationError(error, "create"),
  });

  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => {
      return semesterQueries.deleteCourseFromSemester(semesterId, courseId);
    },
    onSuccess: () => handleMutationSuccess("deleted"),
    onError: (error) => handleMutationError(error, "delete"),
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

  if (isLoadingCourses || isLoadingSemester) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-24 w-full mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorCourses || isErrorSemester) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {errorCourses?.message ||
            errorSemester?.message ||
            "Failed to fetch data."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {semester && <SemesterDetailsHeader semester={semester} />}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>
      <CourseList courses={courses || []} onDelete={handleDelete} />
      {isFormOpen && (
        <CourseDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      )}
      <DeleteDialog
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={() =>
          courseToDelete && deleteMutation.mutate(courseToDelete.id)
        }
        title="Delete Course"
        description={`Are you sure you want to delete the course "${courseToDelete?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
