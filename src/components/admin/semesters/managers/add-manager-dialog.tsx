"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, UserPlus, X } from "lucide-react";
import { User } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import semesterQueries from "@/repo/semester-queries/semester-queries";
import userQueries from "@/repo/user-queries/user-queries";

interface AddManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  semesterId: string;
}

export function AddManagerDialog({
  isOpen,
  onClose,
  onSuccess,
  semesterId,
}: AddManagerDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManagers, setSelectedManagers] = useState<User[]>([]);
  const { success: showSuccess, error: showError } = useToast();
  const queryClient = useQueryClient();

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch all users with MANAGER role
  const {
    data: allUsers = [],
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery({
    queryKey: ["allUsers", debouncedSearchQuery, "MANAGER"],
    queryFn: () => userQueries.getAllUsers(debouncedSearchQuery, "MANAGER"),
    enabled: isOpen,
  });

  // Fetch current semester managers
  const { data: currentManagers = [], isLoading: isLoadingManagers } = useQuery(
    {
      queryKey: ["semesterManagers", semesterId],
      queryFn: () => semesterQueries.getSemesterManagers(semesterId),
      enabled: isOpen,
    },
  );

  // Mutation for assigning managers
  const assignManagersMutation = useMutation({
    mutationFn: (managerIds: string[]) =>
      semesterQueries.assignManagersToSemester(semesterId, managerIds),
    onSuccess: () => {
      showSuccess(
        `Successfully added ${selectedManagers.length} manager(s) to the semester.`,
      );
      queryClient.invalidateQueries({
        queryKey: ["semesterManagers", semesterId],
      });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      handleClose();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data.message as string)
          : "Failed to add managers. Please try again.";

      showError(errorMessage);
    },
  });

  const handleSelectManager = useCallback((user: User) => {
    setSelectedManagers((prev) => {
      const isAlreadySelected = prev.find((m) => m.id === user.id);
      if (isAlreadySelected) {
        return prev.filter((m) => m.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  }, []);

  const handleRemoveManager = useCallback((userId: string) => {
    setSelectedManagers((prev) => prev.filter((m) => m.id !== userId));
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedManagers.length === 0) {
      showError("Please select at least one manager");
      return;
    }

    assignManagersMutation.mutate(selectedManagers.map((m) => m.id));
  }, [selectedManagers, assignManagersMutation, showError]);

  const handleClose = useCallback(() => {
    setSearchQuery("");
    setSelectedManagers([]);
    onClose();
  }, [onClose]);

  // Filter out already assigned managers and already selected managers from available users
  const filteredUsers = useMemo(
    () =>
      allUsers.filter(
        (user: User) =>
          !currentManagers.find((manager: User) => manager.id === user.id) &&
          !selectedManagers.find((selected: User) => selected.id === user.id),
      ),
    [allUsers, currentManagers, selectedManagers],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Semester Managers
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-6">
          {/* Search Controls */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search managers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={
                assignManagersMutation.isPending ||
                selectedManagers.length === 0
              }
              size="default"
            >
              {assignManagersMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add{" "}
                  {selectedManagers.length > 0
                    ? `${selectedManagers.length} `
                    : ""}
                  Manager{selectedManagers.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>

          {/* Selected Managers */}
          {selectedManagers.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Selected Managers ({selectedManagers.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedManagers.map((manager) => (
                  <Badge
                    key={manager.id}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={manager.image || ""} />
                      <AvatarFallback className="text-xs">
                        {manager.name?.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{manager.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveManager(manager.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Managers List */}
          <div className="flex-1 overflow-hidden">
            <Label className="text-sm font-medium mb-3 block">
              Available Managers
            </Label>

            {isLoadingUsers || isLoadingManagers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading users...</span>
              </div>
            ) : isErrorUsers ? (
              <div className="text-center py-8 text-slate-500">
                <p>Failed to load users. Please try again.</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No available managers found.</p>
                {searchQuery && (
                  <p className="text-sm mt-2">
                    Try adjusting your search criteria.
                  </p>
                )}
                {currentManagers.length > 0 && !searchQuery && (
                  <p className="text-sm mt-2">
                    All eligible managers are already assigned to this semester.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-80 pr-2">
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                    onClick={() => handleSelectManager(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {user.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {user.role || "User"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button variant="outline" size="sm">
                            Select
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="flex justify-between pt-4 border-t">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {selectedManagers.length} manager(s) selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={assignManagersMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
