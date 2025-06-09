import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Semester } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";

type SemesterAction = (semester: Semester, action: string) => void;

export const getColumns = (onAction: SemesterAction): ColumnDef<Semester>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Semester Name"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const semester = row.original;
        const name = semester.name as string;

        return (
          <div className="items-center space-x-3">
            <div>
              <div className="font-medium">{name}</div>
            </div>
          </div>
        );
      },
      meta: { label: "Semester Name" },
      size: 200,
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Year"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const year = row.getValue("year") as number;
        return <div className="text-center font-medium">{year}</div>;
      },
      meta: { label: "Year" },
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
        const statusVariant = isActive ? "default" : "secondary";

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
      cell: ({ row }) => {
        const semester = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onAction(semester, "edit")}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction(semester, "delete")}
                className="cursor-pointer text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
      meta: { label: "Actions" },
    },
  ];
};
