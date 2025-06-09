"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDeleteDepartment } from "@/repo/department-queries/department-queries";
import { Loader2 } from "lucide-react";

interface DeleteDepartmentDialogProps {
  departmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteDepartmentDialog({
  departmentId,
  isOpen,
  onClose,
}: DeleteDepartmentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { error, success } = useToast();
  const deleteDepartmentMutation = useDeleteDepartment();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDepartmentMutation.mutateAsync(departmentId);
      success("Department deleted successfully!");
      onClose();
    } catch (e) {
      console.error("Error deleting department:", e);
      error("Failed to delete department. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Department</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this department? This action cannot
            be undone. All associated batches will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
