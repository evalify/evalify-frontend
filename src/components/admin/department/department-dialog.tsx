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
import { useToast } from "@/hooks/use-toast";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/repo/department-queries/department-queries";
import { Department } from "@/types/types";

interface DepartmentFormData {
  name: string;
}

interface DepartmentDialogProps {
  department?: Department;
  isOpen?: boolean;
  onClose?: (open: boolean) => void;
  mode?: "create" | "edit";
}

export function DepartmentDialog({
  department,
  isOpen: controlledIsOpen,
  onClose,
  mode = "create",
}: DepartmentDialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = onClose ?? setUncontrolledIsOpen;

  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
  });

  useEffect(() => {
    if (department && mode === "edit") {
      setFormData({
        name: department.name ?? "",
      });
    } else if (mode === "create") {
      resetForm();
    }
  }, [department, mode]);

  const { error, success } = useToast();

  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();

  const resetForm = () => {
    setFormData({
      name: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      createDepartmentMutation.mutate(formData, {
        onSuccess: () => {
          success("Department created successfully!");
          resetForm();
          setIsOpen(false);
        },
        onError: (e: Error) => {
          console.error("Error creating department:", e);
          error("Failed to create department. Please try again later.");
        },
      });
    } else if (mode === "edit" && department) {
      updateDepartmentMutation.mutate(
        { ...formData, id: department.id },
        {
          onSuccess: () => {
            success("Department updated successfully!");
            setIsOpen(false);
          },
          onError: (e: Error) => {
            console.error("Error updating department:", e);
            error("Failed to update department. Please try again later.");
          },
        },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          {mode === "create" ? "Add Department" : "Edit Department"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Department" : "Edit Department"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new department."
              : "Update the department information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                createDepartmentMutation.isPending ||
                updateDepartmentMutation.isPending
              }
            >
              {mode === "create" ? "Create Department" : "Update Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
