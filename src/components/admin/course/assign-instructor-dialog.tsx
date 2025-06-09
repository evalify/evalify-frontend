"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { useFaculty } from "./hooks/use-faculty";

interface AssignInstructorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (instructorIds: string[]) => void;
  isAssigning: boolean;
  courseId: string;
}

export function AssignInstructorDialog({
  isOpen,
  onClose,
  onAssign,
  isAssigning,
}: AssignInstructorDialogProps) {
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const { data: instructors, isLoading } = useFaculty();

  useEffect(() => {
    if (!isOpen) {
      setSelectedInstructors([]);
    }
  }, [isOpen]);

  const instructorOptions = useMemo(() => {
    return (instructors || []).map((instructor) => ({
      label: instructor.name,
      value: instructor.id,
    }));
  }, [instructors]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Instructors</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <p>Loading instructors...</p>
          ) : (
            <MultiSelect
              options={instructorOptions}
              selected={selectedInstructors}
              onChange={setSelectedInstructors}
              placeholder="Select instructors"
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onAssign(selectedInstructors)}
            disabled={isAssigning || selectedInstructors.length === 0}
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
