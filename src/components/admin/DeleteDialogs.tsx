"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface Course {
  code: string;
  name: string;
  semester: string;
  status: string;
  credits: number;
  description?: string;
  instructorName?: string;
  instructorEmail?: string;
  learningOutcomes?: string[];
}

interface DeleteDialogsProps {
  showDeleteDialog: boolean;
  showBulkDeleteDialog: boolean;
  courseToDelete: Course | null;
  selectedCourses: Set<string>;
  selectedCoursesData: Course[];
  onConfirmDelete: () => void;
  onConfirmBulkDelete: () => void;
  onCancelDelete: () => void;
  onCancelBulkDelete: () => void;
  setShowDeleteDialog: (show: boolean) => void;
  setShowBulkDeleteDialog: (show: boolean) => void;
}

export default function DeleteDialogs({
  showDeleteDialog,
  showBulkDeleteDialog,
  courseToDelete,
  selectedCourses,
  selectedCoursesData,
  onConfirmDelete,
  onConfirmBulkDelete,
  onCancelDelete,
  onCancelBulkDelete,
  setShowDeleteDialog,
  setShowBulkDeleteDialog,
}: DeleteDialogsProps) {
  return (
    <>
      {/* Single Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Course
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the course{" "}
              <span className="font-semibold text-foreground">
                {courseToDelete?.name}
              </span>
              ?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Multiple Courses
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCourses.size} selected
              course
              {selectedCourses.size > 1 ? "s" : ""}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="text-sm font-medium mb-2">
              Courses to be deleted:
            </div>
            <div className="max-h-32 overflow-y-auto border rounded-md p-2 bg-muted/30">
              <ul className="space-y-1">
                {selectedCoursesData.slice(0, 10).map((course) => (
                  <li key={course.code} className="text-sm">
                    <span className="font-mono">{course.code}</span> -{" "}
                    {course.name}
                  </li>
                ))}
                {selectedCoursesData.length > 10 && (
                  <li className="text-sm text-muted-foreground">
                    ... and {selectedCoursesData.length - 10} more courses
                  </li>
                )}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCancelBulkDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmBulkDelete}>
              Delete {selectedCourses.size} Course
              {selectedCourses.size > 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
