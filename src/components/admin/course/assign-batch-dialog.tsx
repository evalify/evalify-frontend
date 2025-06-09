"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDepartmentsQuery } from "@/components/admin/department/hooks/use-department";
import { useDepartmentBatches } from "@/components/admin/department/hooks/use-department";
import { Combobox } from "@/components/ui/combobox";
import { MultiSelect } from "@/components/ui/multi-select";
import { Department } from "@/types/types";
import { Batch } from "@/types/types";

interface AssignBatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (batchIds: string[]) => void;
  isAssigning: boolean;
}

export function AssignBatchDialog({
  isOpen,
  onClose,
  onAssign,
  isAssigning,
}: AssignBatchDialogProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >(undefined);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  const { data: departments, isLoading: isLoadingDepartments } =
    useDepartmentsQuery();
  const { data: batches, isLoading: isLoadingBatches } = useDepartmentBatches(
    selectedDepartment ?? null,
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedDepartment(undefined);
      setSelectedBatches([]);
    }
  }, [isOpen]);

  const departmentOptions = useMemo(() => {
    return (departments || []).map((dept: Department) => ({
      label: dept.name,
      value: dept.id,
    }));
  }, [departments]);

  const batchOptions = useMemo(() => {
    return (batches || []).map((batch: Batch) => ({
      label: batch.name,
      value: batch.id,
    }));
  }, [batches]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Batches</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Combobox
            options={departmentOptions}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            placeholder="Select a department"
            searchPlaceholder="Search departments..."
            disabled={isLoadingDepartments}
            filter={(value, search) => {
              const department = departmentOptions.find(
                (option: { value: string }) => option.value === value,
              );
              if (department) {
                return department.label
                  .toLowerCase()
                  .includes(search.toLowerCase())
                  ? 1
                  : 0;
              }
              return 0;
            }}
          />

          {selectedDepartment && (
            <div>
              {isLoadingBatches ? (
                <p>Loading batches...</p>
              ) : (
                <MultiSelect
                  options={batchOptions}
                  selected={selectedBatches}
                  onChange={setSelectedBatches}
                  placeholder="Select batches"
                />
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onAssign(selectedBatches)}
            disabled={isAssigning || selectedBatches.length === 0}
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
