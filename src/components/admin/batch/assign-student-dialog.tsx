"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/components/admin/users/hooks/use-users";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignStudentsToBatch } from "./hooks/use-batch";
import { toast } from "sonner";

interface AssignStudentToBatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  onSuccess: () => void;
}

export function AssignStudentToBatchDialog({
  isOpen,
  onClose,
  batchId,
  onSuccess,
}: AssignStudentToBatchDialogProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, isLoading } = useUsers(debouncedSearchQuery, 0, 1000);
  const students = data?.data || [];

  const assignMutation = useAssignStudentsToBatch();

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: students.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 5,
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedStudents([]);
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleAssign = () => {
    assignMutation.mutate(
      { batchId, userIds: selectedStudents },
      {
        onSuccess: () => {
          toast.success("Students assigned successfully");
          onSuccess();
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to assign students");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Students to Batch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Search students..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div
            ref={parentRef}
            className="h-[300px] overflow-y-auto relative border rounded-md"
          >
            {isLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const student = students[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      className="p-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={student.id}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() =>
                            handleSelectStudent(student.id)
                          }
                        />
                        <Label htmlFor={student.id} className="cursor-pointer">
                          {student.name} ({student.email})
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!isLoading && students.length === 0 && (
              <p className="p-4 text-center text-sm text-gray-500">
                No students found.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={assignMutation.isPending || selectedStudents.length === 0}
          >
            {assignMutation.isPending ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
