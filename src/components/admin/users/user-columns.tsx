"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/types";
import { useState } from "react";
import { UserDialog } from "./user-dialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userQueries from "@/repo/user-queries/user-queries";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const UserActionsCell = ({ row }: { row: Row<User> }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { error, success } = useToast();

  const deleteUserMutation = useMutation({
    mutationFn: () => userQueries.deleteUser(row.original.id),
    onSuccess: () => {
      success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (e: Error) => {
      console.error("Error deleting user:", e);
      error("Failed to delete user. Please try again later.");
    },
  });

  return (
    <div className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDialog
        user={row.original}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        mode="edit"
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteUserMutation.mutate()}
        title="Delete User"
        description={`Are you sure you want to delete ${row.original.name}? This action cannot be undone.`}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
};

export const getColumns = (): ColumnDef<User>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex justify-center p-4">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            className="rounded border-gray-300 cursor-pointer"
            aria-label="Select all rows"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="flex justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            className="rounded border-gray-300 cursor-pointer"
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="User"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        const name = user.name as string;
        const email = user.email as string;

        return (
          <Link href={`/user/${user.id}`}>
            <div className="items-center">
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-sm">{email}</div>
              </div>
            </div>
          </Link>
        );
      },
      meta: { label: "User" },
      size: 250,
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Phone"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const phoneNumber = row.getValue("phoneNumber") as string | undefined;
        return (
          <div className="flex items-center justify-center">
            <span className="text-sm">{phoneNumber || "N/A"}</span>
          </div>
        );
      },
      meta: { label: "Phone" },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Role"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const roleVariant =
          role === "ADMIN"
            ? "destructive"
            : role === "MANAGER" || role === "FACULTY"
              ? "secondary"
              : "outline";

        return (
          <div className="flex justify-center">
            <Badge variant={roleVariant} className="capitalize">
              {role.toLowerCase()}
            </Badge>
          </div>
        );
      },
      meta: { label: "Role" },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        const statusVariant = isActive ? "default" : "destructive";

        return (
          <div className="flex justify-center">
            <Badge variant={statusVariant} className="capitalize">
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
      meta: { label: "Status" },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => <UserActionsCell row={row} />,
      enableSorting: false,
      enableHiding: false,
      meta: { label: "Actions" },
    },
  ];
};
