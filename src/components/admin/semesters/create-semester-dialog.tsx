"use client";
import React from "react";
import { Semester } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SemesterForm } from "./semester-form";

interface CreateSemesterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Semester, "id">) => void;
}

export function CreateSemesterDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateSemesterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Semester</DialogTitle>
          <DialogDescription>Add a new academic semester</DialogDescription>
        </DialogHeader>
        <SemesterForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
