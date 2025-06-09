"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "@/components/admin/users/user-columns";
import { useUsers } from "@/components/admin/users/hooks/use-users";
import { UserDialog } from "@/components/admin/users/user-dialog";
import userQueries from "@/repo/user-queries/user-queries";
import { AssignBatchDialog } from "@/components/admin/users/assign-batch-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import batchQueries from "@/repo/batch-queries/batch-queries";
import { useToast } from "@/hooks/use-toast";

function useUsersForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>,
) {
  return useUsers(search, page - 1, pageSize, columnFilters, sortBy, sortOrder);
}

useUsersForDataTable.isQueryHook = true;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<(string | number)[]>(
    [],
  );

  const columsWrapper = () => {
    return getColumns();
  };
  const columnFilterOptions = [
    {
      columnId: "role",
      title: "Role",
      options: [
        { label: "Student", value: "STUDENT" },
        { label: "Admin", value: "ADMIN" },
        { label: "Faculty", value: "FACULTY" },
        { label: "Manager", value: "MANAGER" },
      ],
    },
  ];

  const deleteMutation = useMutation<void, Error, (string | number)[]>({
    mutationFn: (userIds) => userQueries.bulkDeleteUsers(userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      success("Users deleted successfully");
    },
    onError: (err) => {
      error(err.message || "Failed to delete users");
    },
  });

  const assignMutation = useMutation<
    void,
    Error,
    { userIds: (string | number)[]; batchId: string }
  >({
    mutationFn: (data) => batchQueries.assignUsersToBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      success("Users assigned successfully");
      setIsAssignDialogOpen(false);
    },
    onError: (err) => {
      error(err.message || "Failed to assign users");
    },
  });

  const handleDelete = (userIds: (string | number)[]): Promise<void> => {
    return deleteMutation.mutateAsync(userIds);
  };

  const handleAssignClick = (userIds: (string | number)[]): Promise<void> => {
    setSelectedUserIds(userIds);
    setIsAssignDialogOpen(true);
    return Promise.resolve();
  };

  const handleAssign = (batchId: string) => {
    assignMutation.mutate({ userIds: selectedUserIds, batchId });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      <div>
        <AssignBatchDialog
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          onAssign={handleAssign}
          isAssigning={assignMutation.isPending}
        />
        <UserDialog />
        <DataTable
          config={{
            enableUrlState: false,
            enableDateFilter: false,
            enableColumnFilters: true,
            enableAssign: true,
            enableDelete: false,
          }}
          exportConfig={{
            entityName: "users",
            columnMapping: {},
            columnWidths: [],
            headers: [],
          }}
          getColumns={columsWrapper}
          fetchDataFn={useUsersForDataTable}
          idField="id"
          columnFilterOptions={columnFilterOptions}
          deleteFn={handleDelete}
          assignFn={handleAssignClick}
        />
      </div>
    </div>
  );
}
