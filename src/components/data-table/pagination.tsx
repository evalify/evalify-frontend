"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUrlState } from "@/components/data-table/utils/url-state";

const getButtonSizeClass = (size: "sm" | "default" | "lg") => {
  switch (size) {
    case "sm":
      return "h-7 w-7 p-0";
    case "lg":
      return "h-11 w-11 p-0";
    default:
      return "h-8 w-8 p-0";
  }
};

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[]; // Custom page size options
  size?: "sm" | "default" | "lg"; // Size prop for components
  paginationLabel?: string; // Custom label for pagination (e.g., "Rows per page" or "Grids per page")
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50], // Default options if none provided
  size = "default",
  paginationLabel = "Rows per page", // Default label
}: DataTablePaginationProps<TData>) {
  // Use URL state hooks for managing pagination state in the URL
  const [, setPageSize] = useUrlState(
      "pageSize",
      table.getState().pagination.pageSize,
    ),
    [, setPage] = useUrlState(
      "page",
      table.getState().pagination.pageIndex + 1,
    );

  // Convert 'lg' size to 'default' for SelectTrigger since it only accepts 'sm' | 'default'
  const selectSize = size === "lg" ? "default" : size;
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* Selection information removed as requested */}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">
            {paginationLabel}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              // Update URL state and table state together
              setPageSize(Number(value));
              setPage(1);
              table.setPagination({
                pageIndex: 0, // Reset to first page
                pageSize: Number(value),
              });
            }}
          >
            <SelectTrigger className="cursor-pointer" size={selectSize}>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="cursor-pointer">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="cursor-pointer"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          <pre>
            Page {table.getState().pagination.pageIndex + 1} of {""}
            {table.getPageCount() || 1}
          </pre>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            className={`${getButtonSizeClass(
              size,
            )} hidden lg:flex cursor-pointer`}
            onClick={() =>
              table.setPagination({
                pageIndex: 0,
                pageSize: table.getState().pagination.pageSize,
              })
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            className={`${getButtonSizeClass(size)} cursor-pointer`}
            onClick={() =>
              table.setPagination({
                pageIndex: table.getState().pagination.pageIndex - 1,
                pageSize: table.getState().pagination.pageSize,
              })
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            className={`${getButtonSizeClass(size)} cursor-pointer`}
            onClick={() =>
              table.setPagination({
                pageIndex: table.getState().pagination.pageIndex + 1,
                pageSize: table.getState().pagination.pageSize,
              })
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            className={`${getButtonSizeClass(
              size,
            )} hidden lg:flex cursor-pointer`}
            onClick={() =>
              table.setPagination({
                pageIndex: table.getPageCount() - 1,
                pageSize: table.getState().pagination.pageSize,
              })
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
