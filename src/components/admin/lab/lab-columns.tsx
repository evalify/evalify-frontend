import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Lab } from "@/types/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LabColumnsProps {
  onEdit?: (lab: Lab) => void;
  onDelete?: (lab: Lab) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: LabColumnsProps = {}): ColumnDef<Lab>[] => {
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
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lab Name" />
      ),
      cell: ({ row }) => {
        const lab = row.original;
        return <div>{lab.name}</div>;
      },
      meta: { label: "Lab Name" },
      size: 200,
    },
    {
      accessorKey: "block",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Block"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const block = row.getValue("block") as string;
        return <div className="text-center font-medium">{block}</div>;
      },
      meta: { label: "Block" },
      size: 150,
    },
    {
      accessorKey: "ipSubnet",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="IP Subnet"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const ipSubnet = row.getValue("ipSubnet") as string;
        return <div className="text-center font-medium">{ipSubnet}</div>;
      },
      meta: { label: "IP Subnet" },
      size: 180,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const lab = row.original;

        return (
          <div onClick={(e) => e.stopPropagation()}>
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
                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(lab)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(lab)}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 100,
    },
  ];
};
