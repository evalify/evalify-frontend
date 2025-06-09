import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseForm } from "./course-form";
import { Course } from "@/types/types";

interface CourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: unknown) => void;
  isLoading: boolean;
  course?: Course | null;
}

export function CourseDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  course,
}: CourseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Create Course"}</DialogTitle>
        </DialogHeader>
        <CourseForm onSubmit={onSubmit} isLoading={isLoading} course={course} />
      </DialogContent>
    </Dialog>
  );
}
