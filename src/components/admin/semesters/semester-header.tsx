"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { SemesterForm } from "./semester-form";
import { Semester } from "@/types/types";

interface SemesterHeaderProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onCreateSemester: (data: Omit<Semester, "id">) => void;
}

export function SemesterHeader({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  onCreateSemester,
}: SemesterHeaderProps) {
  return (
    <div className="flex justify-between items-center pb-3">
      <div>
        <h1 className="text-2xl font-bold">Semesters Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage academic semesters and their configurations
        </p>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Semester
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Semester</DialogTitle>
            <DialogDescription>
              Add a new semester to the academic calendar
            </DialogDescription>
          </DialogHeader>
          <SemesterForm onSubmit={onCreateSemester} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
