"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import labQueries from "@/repo/lab-queries/lab-queries";

interface DeleteLabDialogProps {
  isOpen: boolean;
  onClose: () => void;
  labId: string | null;
  labName?: string;
}

export function DeleteLabDialog({
  isOpen,
  onClose,
  labId,
  labName,
}: DeleteLabDialogProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await labQueries.deleteLab(id);
    },
    onSuccess: () => {
      toast.success("Lab deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete lab");
    },
  });

  const handleDelete = () => {
    if (labId) {
      deleteMutation.mutate(labId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Lab</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete
            {labName ? `"${labName}"` : "this lab"}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
