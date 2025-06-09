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
import { TrashIcon } from "lucide-react";

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
    queryKey: [courseId],
    queryFn: () => {
      return courseQueries.getCourseById(courseId);
    },
    refetchOnMount: true,
  });
  const { data: instructors, isLoading: instructorsLoading } =
    useCourseInstructors(courseId);
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
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading course details.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">{course?.name}</h1>
      <p className="text-gray-500">{course?.code}</p>
      <p className="mt-4">{course?.description}</p>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Instructors</h2>
          <Button onClick={() => setIsAssignInstructorOpen(true)}>
            Assign Instructor
          </Button>
        </div>
        {instructorsLoading ? (
          <p>Loading instructors...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(instructors || []).map((instructor) => (
              <div
                key={instructor.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={instructor.image || ""} />
                    <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{instructor.name}</p>
                    <p className="text-sm text-gray-500">{instructor.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setInstructorToDelete(instructor)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={handleTabChange} className="mt-8">
        <TabsList>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        <TabsContent value="batches">
          <CourseBatchesTable
            courseId={courseId}
            onAssign={() => setIsAssignBatchOpen(true)}
            onDelete={setBatchToDelete}
          />
        </TabsContent>
        <TabsContent value="students">
          <CourseStudentsTable
            courseId={courseId}
            onAssign={() => setIsAssignStudentOpen(true)}
            onDelete={setStudentToDelete}
          />
        </TabsContent>
      </Tabs>
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
