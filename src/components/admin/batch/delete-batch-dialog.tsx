"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import batchQueries from "@/repo/batch-queries/batch-queries";
import { Loader2 } from "lucide-react";

interface DeleteBatchDialogProps {
  batchId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteBatchDialog({
  batchId,
  isOpen,
  onClose,
}: DeleteBatchDialogProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteBatch, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return batchQueries.deleteBatch(batchId);
    },
    onSuccess: () => {
      toast.success("Batch deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete batch");
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Batch</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this batch? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => deleteBatch()}
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
