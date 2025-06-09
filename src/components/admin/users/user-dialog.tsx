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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userQueries from "@/repo/user-queries/user-queries";
import { User } from "@/types/types";

interface UserFormData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  password?: string;
  isActive: boolean;
}

interface UserDialogProps {
  user?: User;
  isOpen?: boolean;
  onClose?: () => void;
  mode?: "create" | "edit";
}

export function UserDialog({
  user,
  isOpen: controlledIsOpen,
  onClose,
  mode = "create",
}: UserDialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = onClose ?? setUncontrolledIsOpen;

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    password: "",
    isActive: true,
  });

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        role: user.role ?? "",
        isActive: user.isActive ?? true,
      });
    } else if (mode === "create") {
      resetForm();
    }
  }, [user, mode]);

  const queryClient = useQueryClient();
  const { error, success } = useToast();

  const createUserMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      return userQueries.createUser(data as Required<UserFormData>);
    },
    onSuccess: () => {
      success("User created successfully!");
      resetForm();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e: Error) => {
      console.error("Error creating user:", e);
      error("Failed to create user. Please try again later.");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      if (!user?.id) {
        throw new Error("User ID is required for update");
      }
      return userQueries.updateUser({ ...data, id: user.id });
    },
    onSuccess: () => {
      success("User updated successfully!");
      resetForm();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e: Error) => {
      console.error("Error updating user:", e);
      error("Failed to update user. Please try again later.");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      role: "",
      password: "",
      isActive: true,
    });
  };

  const handleClose = () => {
    if (mode === "create") {
      resetForm();
    }
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      error("Email is required");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      error("Phone is required");
      return;
    }

    if (!formData.role) {
      error("Role is required");
      return;
    }

    if (mode === "create") {
      formData.password = formData.name;
      createUserMutation.mutate(formData);
    } else {
      updateUserMutation.mutate(formData);
    }
  };

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;
  const isEditMode = mode === "edit";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="mb-4" variant={"outline"}>
            Add User
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>{isEditMode ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the user's information below."
                : "Fill in the details below to create a new user account."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email-1">Email</Label>
              <Input
                id="email-1"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone-1">Phone</Label>
              <Input
                id="phone-1"
                name="phone"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                disabled={isLoading}
                required
              />
            </div>
            <div className="flex gap-3">
              <div className="grid gap-3">
                <Label htmlFor="role-1" className="px-1">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="FACULTY">Faculty</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="isActive-1">Active</Label>
                <Switch
                  id="isActive-1"
                  name="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Save changes"
                  : "Create user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
