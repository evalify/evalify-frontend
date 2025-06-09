import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Batch } from "@/types/types";

export const getColumns = (
  onEdit?: (batch: Batch) => void,
  onDelete?: (batchId: string) => void,
): ColumnDef<Batch>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex justify-center p-2">
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
          className="flex justify-center p-2"
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
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Batch Name" />
      ),
      cell: ({ row }) => {
        const batch = row.original;
        return <div>{batch.name}</div>;
      },
      meta: { label: "Batch Name" },
      size: 200,
    },
    {
      accessorKey: "graduationYear",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Graduation Year"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const graduationYear = row.getValue("graduationYear") as number;
        return <div className="text-center font-medium">{graduationYear}</div>;
      },
      meta: { label: "Graduation Year" },
      size: 100,
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Department"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const department = row.original.department?.name;
        return (
          <div className="text-center font-medium">{department || "-"}</div>
        );
      },
      meta: { label: "Department" },
      size: 150,
    },
    {
      accessorKey: "section",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Section"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const section = row.getValue("section") as string;
        return <div className="text-center font-medium">{section}</div>;
      },
      meta: { label: "Section" },
      size: 100,
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
        return (
          <div className="text-center">
            <Badge variant={isActive ? "default" : "destructive"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
      meta: { label: "Status" },
      size: 100,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const batch = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(batch)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Batch
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete?.(batch.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      meta: { label: "Actions" },
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
