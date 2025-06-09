"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import batchQueries from "@/repo/batch-queries/batch-queries";
import { Batch } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllDepartments } from "@/components/admin/department/hooks/use-department";
import { Skeleton } from "@/components/ui/skeleton";

interface BatchFormData {
  name: string;
  graduationYear: number;
  section: string;
  isActive: boolean;
  departmentId: string;
}

interface BatchDialogProps {
  batch?: Batch;
  isOpen?: boolean;
  onClose?: (open: boolean) => void;
  mode?: "create" | "edit";
}

export function BatchDialog({
  batch,
  isOpen: controlledIsOpen,
  onClose,
  mode = "create",
}: BatchDialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = onClose ?? setUncontrolledIsOpen;
  const queryClient = useQueryClient();
  const toast = useToast();

  const [formData, setFormData] = useState<BatchFormData>({
    name: "",
    graduationYear: new Date().getFullYear(),
    section: "",
    isActive: true,
    departmentId: "",
  });

  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    refetch,
  } = useAllDepartments({ enabled: false });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (batch && mode === "edit") {
      setFormData({
        name: batch.name ?? "",
        graduationYear: batch.graduationYear ?? new Date().getFullYear(),
        section: batch.section ?? "",
        isActive: batch.isActive ?? true,
        departmentId: batch.department?.id ?? "",
      });
    } else if (mode === "create") {
      resetForm();
    }
  }, [batch, mode]);

  useEffect(() => {
    if (
      mode === "create" &&
      formData.graduationYear &&
      formData.departmentId &&
      formData.section
    ) {
      const department = departments.find(
        (d) => d.id === formData.departmentId,
      );
      if (department) {
        const batchName = `${formData.graduationYear}-${department.name}-${formData.section}`;
        setFormData((prev) => ({ ...prev, name: batchName }));
      }
    }
  }, [
    formData.graduationYear,
    formData.departmentId,
    formData.section,
    departments,
    mode,
  ]);

  const { mutate: createBatch, isPending: isCreating } = useMutation({
    mutationFn: (data: BatchFormData) => {
      return batchQueries.createBatch(data);
    },
    onSuccess: () => {
      toast.success("Batch created successfully!");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create batch");
    },
  });

  const { mutate: updateBatch, isPending: isUpdating } = useMutation({
    mutationFn: (data: BatchFormData & { id: string }) => {
      return batchQueries.updateBatch(data);
    },
    onSuccess: () => {
      toast.success("Batch updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update batch");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      graduationYear: new Date().getFullYear(),
      section: "",
      isActive: true,
      departmentId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      createBatch(formData);
    } else if (mode === "edit" && batch) {
      updateBatch({ ...formData, id: batch.id });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          {mode === "create" ? "Add Batch" : "Edit Batch"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Batch" : "Edit Batch"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new batch."
              : "Update the batch information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              value={formData.graduationYear}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  graduationYear: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentId">Department</Label>
            <Select
              value={formData.departmentId}
              onValueChange={(value) =>
                setFormData({ ...formData, departmentId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingDepartments ? (
                  <div className="p-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full mt-2" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                ) : (
                  departments?.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <Input
              id="section"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Batch Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={mode === "create"}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {mode === "create" ? "Create Batch" : "Update Batch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
