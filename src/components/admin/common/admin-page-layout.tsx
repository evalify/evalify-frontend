"use client";

import React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

// Import the data fetch types from the data-table component
interface DataFetchParams {
  page: number;
  limit: number;
  search: string;
  from_date: string;
  to_date: string;
  sort_by: string;
  sort_order: string;
  column_filters?: Record<string, string[]>;
}

interface DataFetchResult<TData> {
  success: boolean;
  data: TData[];
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_items: number;
  };
}

interface AdminPageLayoutProps<TData> {
  title: string;
  description?: string;
  createButtonText?: string;
  onCreateClick?: () => void;
  showCreateButton?: boolean;
  config?: {
    enableUrlState?: boolean;
    enableDateFilter?: boolean;
    enableColumnFilters?: boolean;
    enableDelete?: boolean;
    enableAssign?: boolean;
    enableExport?: boolean;
    enablePagination?: boolean;
    enableSearch?: boolean;
    enableToolbar?: boolean;
    enableColumnVisibility?: boolean;
    size?: "sm" | "default" | "lg";
  };
  exportConfig: {
    entityName: string;
    columnMapping: Record<string, string>;
    columnWidths: Array<{ wch: number }>;
    headers: string[];
  };
  getColumns: () => ColumnDef<TData>[];
  fetchDataFn:
    | ((params: DataFetchParams) => Promise<DataFetchResult<TData>>)
    | ((
        page: number,
        pageSize: number,
        search: string,
        dateRange: { from_date: string; to_date: string },
        sortBy: string,
        sortOrder: string,
      ) => unknown);
  idField: keyof TData;
  columnFilterOptions?: Array<{
    columnId: string;
    title: string;
    options: Array<{ label: string; value: string }>;
  }>;
  deleteFn?: (ids: (string | number)[]) => Promise<void>;
  assignFn?: (ids: (string | number)[]) => Promise<void>;
  onRowClick?: (data: TData) => void;
  renderToolbarContent?: () => React.ReactNode;
  children?: React.ReactNode;
}

export function AdminPageLayout<TData>({
  title,
  description,
  createButtonText = "Add New",
  onCreateClick,
  showCreateButton = true,
  config = {
    enableUrlState: true,
    enableDateFilter: false,
    enableColumnFilters: true,
    enableDelete: false,
    enableAssign: false,
    enableExport: false,
    enablePagination: true,
    enableSearch: true,
    enableToolbar: true,
    enableColumnVisibility: true,
    size: "default",
  },
  exportConfig,
  getColumns,
  fetchDataFn,
  idField,
  columnFilterOptions,
  deleteFn,
  assignFn,
  onRowClick,
  renderToolbarContent,
  children,
}: AdminPageLayoutProps<TData>) {
  const defaultConfig = {
    enableUrlState: true,
    enableDateFilter: false,
    enableColumnFilters: true,
    enableDelete: false,
    enableAssign: false,
    enableExport: false,
    enablePagination: true,
    enableSearch: true,
    enableToolbar: true,
    enableColumnVisibility: true,
    size: "default" as const,
    ...config,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {showCreateButton && onCreateClick && (
          <Button onClick={onCreateClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {createButtonText}
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <DataTable
          config={defaultConfig}
          exportConfig={exportConfig}
          getColumns={getColumns}
          fetchDataFn={fetchDataFn}
          idField={idField}
          columnFilterOptions={columnFilterOptions}
          deleteFn={deleteFn}
          assignFn={assignFn}
          onRowClick={onRowClick}
          renderToolbarContent={renderToolbarContent}
        />
      </div>

      {/* Additional content like dialogs */}
      {children}
    </div>
  );
}
