"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios/axios-client";

interface Department {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
}

interface AssignBatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (batchId: string) => void;
  isAssigning: boolean;
}

export function AssignBatchDialog({
  isOpen,
  onClose,
  onAssign,
  isAssigning,
}: AssignBatchDialogProps) {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [isDepartmentPopoverOpen, setIsDepartmentPopoverOpen] = useState(false);

  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/department/all");
      const data = response.data;
      return Array.isArray(data) ? data : data.data || [];
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch batches for the selected department
  const {
    data: batches,
    isLoading: isBatchesLoading,
    error: batchesError,
  } = useQuery<Batch[]>({
    queryKey: ["batches", selectedDepartmentId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/api/department/${selectedDepartmentId}/batches`,
      );
      const data = response.data;
      return Array.isArray(data) ? data : data.data || [];
    },
    enabled: isOpen && !!selectedDepartmentId,
    staleTime: 5 * 60 * 1000,
  });

  const handleAssign = () => {
    if (selectedBatchId) {
      onAssign(selectedBatchId);
    }
  };

  const selectedDepartment = departments?.find(
    (d) => d.id === selectedDepartmentId,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Users to a Batch</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isDepartmentsLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : departmentsError ? (
            <div className="text-sm text-red-500">
              Failed to load departments.
            </div>
          ) : (
            <Popover
              open={isDepartmentPopoverOpen}
              onOpenChange={setIsDepartmentPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isDepartmentPopoverOpen}
                  className="w-full justify-between"
                >
                  {selectedDepartment
                    ? selectedDepartment.name
                    : "Select department..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search department..." />
                  <CommandEmpty>No department found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {departments?.map((department) => (
                        <CommandItem
                          key={department.id}
                          value={department.name}
                          onSelect={() => {
                            setSelectedDepartmentId(department.id);
                            setSelectedBatchId(null);
                            setIsDepartmentPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedDepartmentId === department.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {department.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {isBatchesLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : selectedDepartmentId && batches ? (
            <Select
              onValueChange={setSelectedBatchId}
              value={selectedBatchId || ""}
              disabled={isBatchesLoading || !!batchesError}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batchesError ? (
                  <div className="p-2 text-sm text-red-500">
                    Failed to load batches
                  </div>
                ) : batches.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    No batches available
                  </div>
                ) : (
                  batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={
              !selectedBatchId ||
              isAssigning ||
              isDepartmentsLoading ||
              isBatchesLoading
            }
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
