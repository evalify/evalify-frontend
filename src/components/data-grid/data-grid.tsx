"use client";

import type * as React from "react";
import {
  type ColumnSizingState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useCallback, useMemo, useState } from "react";

import { DataTablePagination } from "@/components/data-table/pagination";
import { DataTableToolbar } from "@/components/data-table/toolbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  useTableConfig,
  type TableConfig,
} from "@/components/data-table/utils/table-config";
import { preprocessSearch } from "@/components/data-table/utils/search";
import {
  createSortingHandler,
  createColumnFiltersHandler,
  createColumnVisibilityHandler,
  createSortingState,
} from "@/components/data-table/utils/table-state-handlers";
import { createConditionalStateHook } from "@/components/data-table/utils/conditional-state";
import { GridItemSkeleton } from "./grid-item";

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

// Types for table handlers
type PaginationUpdater = (prev: { pageIndex: number; pageSize: number }) => {
  pageIndex: number;
  pageSize: number;
};
type RowSelectionUpdater = (
  prev: Record<string, boolean>,
) => Record<string, boolean>;

interface DataGridProps<TData, TValue> {
  // Allow overriding the table configuration
  config?: Partial<TableConfig>;

  // Column definitions generator (for filtering/sorting metadata)
  getColumns: (
    handleRowDeselection: ((rowId: string) => void) | null | undefined,
  ) => ColumnDef<TData, TValue>[];

  // Custom grid item renderer
  renderGridItem: (
    item: TData,
    index: number,
    isSelected: boolean,
    onToggleSelect: () => void,
    onEdit?: (item: TData) => void,
    onDelete?: (item: TData) => void,
  ) => React.ReactNode;

  // Data fetching function
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

  // Function to fetch specific items by their IDs
  fetchByIdsFn?: (ids: number[] | string[]) => Promise<TData[]>;

  // Export configuration
  exportConfig: {
    entityName: string;
    columnMapping: Record<string, string>;
    columnWidths: Array<{ wch: number }>;
    headers: string[];
  };

  // ID field in TData for tracking selected items
  idField: keyof TData;
  // Custom page size options
  pageSizeOptions?: number[];

  // Custom pagination label (e.g., "Rows per page" or "Grids per page")
  paginationLabel?: string;

  // Custom toolbar content render function
  renderToolbarContent?: (props: {
    selectedRows: TData[];
    allSelectedIds: (string | number)[];
    totalSelectedCount: number;
    resetSelection: () => void;
  }) => React.ReactNode;

  // Column filters configuration
  columnFilterOptions?: Array<{
    columnId: string;
    title: string;
    options: Array<{
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }>;
  }>;

  // Grid layout configuration
  gridConfig?: {
    columns?: {
      default: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      "2xl"?: number;
    };
    gap?: number;
  };

  // Optional edit and delete functions
  onEdit?: (item: TData) => void;
  onDelete?: (item: TData) => void;
}

export function DataGrid<TData, TValue>({
  config = {},
  getColumns,
  renderGridItem,
  fetchDataFn,
  fetchByIdsFn,
  exportConfig,
  idField = "id" as keyof TData,
  pageSizeOptions,
  paginationLabel,
  renderToolbarContent,
  columnFilterOptions,
  gridConfig = {
    columns: { default: 1, sm: 2, lg: 3, "2xl": 4 },
    gap: 4,
  },
  onEdit,
  onDelete,
}: DataGridProps<TData, TValue>) {
  // Load table configuration with any overrides
  const tableConfig = useTableConfig(config);

  // Column sizing state (no localStorage persistence)
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // Create conditional URL state hook based on config
  const useConditionalUrlState = createConditionalStateHook(
    tableConfig.enableUrlState,
  );

  // States for API parameters using conditional URL state
  const [page, setPage] = useConditionalUrlState("page", 1);
  const [pageSize, setPageSize] = useConditionalUrlState("pageSize", 12); // Default to 12 for grid
  const [search, setSearch] = useConditionalUrlState("search", "");
  const [dateRange, setDateRange] = useConditionalUrlState<{
    from_date: string;
    to_date: string;
  }>("dateRange", { from_date: "", to_date: "" });
  const [sortBy, setSortBy] = useConditionalUrlState("sortBy", "created_at");
  const [sortOrder, setSortOrder] = useConditionalUrlState<"asc" | "desc">(
    "sortOrder",
    "desc",
  );
  const [columnVisibility, setColumnVisibility] = useConditionalUrlState<
    Record<string, boolean>
  >("columnVisibility", {});
  const [columnFilters, setColumnFilters] = useConditionalUrlState<
    Array<{ id: string; value: unknown }>
  >("columnFilters", []);

  // Internal states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<{
    data: TData[];
    pagination: {
      page: number;
      limit: number;
      total_pages: number;
      total_items: number;
    };
  } | null>(null); // PERFORMANCE FIX: Use only one selection state as the source of truth
  const [selectedItemIds, setSelectedItemIds] = useState<
    Record<string | number, boolean>
  >({});

  // For server-side sorting, derive sorting state from URL parameters
  const sorting = useMemo(
    () => createSortingState(sortBy, sortOrder),
    [sortBy, sortOrder],
  );

  // Convert column filters to server format
  const serverColumnFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    columnFilters.forEach((filter) => {
      if (
        filter.value &&
        Array.isArray(filter.value) &&
        filter.value.length > 0
      ) {
        filters[filter.id] = filter.value as string[];
      }
    });
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [columnFilters]);

  // Get current data items - memoize to avoid recalculations
  const dataItems = useMemo(() => data?.data || [], [data?.data]);

  // PERFORMANCE FIX: Derive rowSelection from selectedItemIds using memoization
  const rowSelection = useMemo(() => {
    if (!dataItems.length) return {};

    // Map selectedItemIds to row indices for the table
    const selection: Record<string, boolean> = {};

    dataItems.forEach((item, index) => {
      const itemId = String(item[idField]);
      if (selectedItemIds[itemId]) {
        selection[String(index)] = true;
      }
    });

    return selection;
  }, [dataItems, selectedItemIds, idField]);

  // Calculate total selected items - memoize to avoid recalculation
  const totalSelectedItems = useMemo(
    () => Object.keys(selectedItemIds).length,
    [selectedItemIds],
  );

  // PERFORMANCE FIX: Optimized row deselection handler
  const handleRowDeselection = useCallback(
    (rowId: string) => {
      if (!dataItems.length) return;

      const rowIndex = Number.parseInt(rowId, 10);
      const item = dataItems[rowIndex];

      if (item) {
        const itemId = String(item[idField]);
        setSelectedItemIds((prev) => {
          // Remove this item ID from selection
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
      }
    },
    [dataItems, idField],
  );

  // Clear all selections
  const clearAllSelections = useCallback(() => {
    setSelectedItemIds({});
  }, []);

  // PERFORMANCE FIX: Optimized row selection handler
  const handleRowSelectionChange = useCallback(
    (updaterOrValue: RowSelectionUpdater | Record<string, boolean>) => {
      // Determine the new row selection value
      const newRowSelection =
        typeof updaterOrValue === "function"
          ? updaterOrValue(rowSelection)
          : updaterOrValue;

      // Batch update selectedItemIds based on the new row selection
      setSelectedItemIds((prev) => {
        const next = { ...prev };

        // Process changes for current page
        if (dataItems.length) {
          // First handle explicit selections in newRowSelection
          for (const [rowId, isSelected] of Object.entries(newRowSelection)) {
            const rowIndex = Number.parseInt(rowId, 10);
            if (rowIndex >= 0 && rowIndex < dataItems.length) {
              const item = dataItems[rowIndex];
              const itemId = String(item[idField]);

              if (isSelected) {
                next[itemId] = true;
              } else {
                delete next[itemId];
              }
            }
          }

          // Then handle implicit deselection (rows that were selected but aren't in newRowSelection)
          dataItems.forEach((item, index) => {
            const itemId = String(item[idField]);
            const rowId = String(index);

            // If item was selected but isn't in new selection, deselect it
            if (prev[itemId] && newRowSelection[rowId] === undefined) {
              delete next[itemId];
            }
          });
        }

        return next;
      });
    },
    [dataItems, rowSelection, idField],
  );

  // Get selected items data
  const getSelectedItems = useCallback(async () => {
    // If nothing is selected, return empty array
    if (totalSelectedItems === 0) {
      return [];
    }

    // Get IDs of selected items
    const selectedIdsArray = Object.keys(selectedItemIds).map((id) =>
      typeof id === "string" ? Number.parseInt(id, 10) : (id as number),
    );

    // Find items from current page that are selected
    const itemsInCurrentPage = dataItems.filter(
      (item) => selectedItemIds[String(item[idField])],
    );

    // Get IDs of items on current page
    const idsInCurrentPage = itemsInCurrentPage.map(
      (item) => item[idField] as unknown as number,
    );

    // Find IDs that need to be fetched (not on current page)
    const idsToFetch = selectedIdsArray.filter(
      (id) => !idsInCurrentPage.includes(id),
    );

    // If all selected items are on current page or we can't fetch by IDs
    if (idsToFetch.length === 0 || !fetchByIdsFn) {
      return itemsInCurrentPage;
    }

    try {
      // Fetch missing items in a single batch
      const fetchedItems = await fetchByIdsFn(idsToFetch);

      // Combine current page items with fetched items
      return [...itemsInCurrentPage, ...fetchedItems];
    } catch (error) {
      console.error("Error fetching selected items:", error);
      return itemsInCurrentPage;
    }
  }, [dataItems, selectedItemIds, totalSelectedItems, fetchByIdsFn, idField]);

  // Get all items on current page
  const getAllItems = useCallback((): TData[] => {
    // Return current page data
    return dataItems;
  }, [dataItems]);

  // Fetch data
  useEffect(() => {
    // Check if the fetchDataFn is a query hook
    const isQueryHook =
      (fetchDataFn as { isQueryHook?: boolean }).isQueryHook === true;

    if (!isQueryHook) {
      // Create refs to capture the current sort values at the time of fetching
      const currentSortBy = sortBy;
      const currentSortOrder = sortOrder;

      const fetchData = async () => {
        try {
          setIsLoading(true);
          const result = await (
            fetchDataFn as (
              params: DataFetchParams,
            ) => Promise<DataFetchResult<TData>>
          )({
            page,
            limit: pageSize,
            search: preprocessSearch(search),
            from_date: dateRange.from_date,
            to_date: dateRange.to_date,
            sort_by: currentSortBy,
            sort_order: currentSortOrder,
            column_filters: serverColumnFilters,
          });
          setData(result);
          setIsError(false);
          setError(null);
        } catch (err) {
          setIsError(true);
          setError(err instanceof Error ? err : new Error("Unknown error"));
          console.error("Error fetching data:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [
    page,
    pageSize,
    search,
    dateRange,
    sortBy,
    sortOrder,
    serverColumnFilters,
    fetchDataFn,
  ]);
  // If fetchDataFn is a React Query hook, call it directly with parameters
  const queryResult =
    (fetchDataFn as { isQueryHook?: boolean }).isQueryHook === true
      ? (
          fetchDataFn as (
            page: number,
            pageSize: number,
            search: string,
            dateRange: { from_date: string; to_date: string },
            sortBy: string,
            sortOrder: string,
            columnFilters?: Record<string, string[]>,
          ) => {
            isLoading: boolean;
            isSuccess: boolean;
            isError: boolean;
            data?: DataFetchResult<TData>;
            error?: Error;
          }
        )(
          page,
          pageSize,
          search,
          dateRange,
          sortBy,
          sortOrder,
          serverColumnFilters,
        )
      : null;

  // If using React Query, update state based on query result
  useEffect(() => {
    if (queryResult) {
      setIsLoading(queryResult.isLoading);
      if (queryResult.isSuccess && queryResult.data) {
        setData(queryResult.data);
        setIsError(false);
        setError(null);
      }
      if (queryResult.isError) {
        setIsError(true);
        setError(
          queryResult.error instanceof Error
            ? queryResult.error
            : new Error("Unknown error"),
        );
      }
    }
  }, [queryResult]);

  // Memoized pagination state
  const pagination = useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize,
    }),
    [page, pageSize],
  );

  // Get columns with the deselection handler (memoize to avoid recreation on render)
  const columns = useMemo(() => {
    // Only pass deselection handler if row selection is enabled
    return getColumns(
      tableConfig.enableRowSelection ? handleRowDeselection : null,
    );
  }, [getColumns, handleRowDeselection, tableConfig.enableRowSelection]);

  const handleColumnFiltersChange = useCallback(
    (
      updaterOrValue:
        | import("@tanstack/react-table").ColumnFiltersState
        | import("@tanstack/react-table").Updater<
            import("@tanstack/react-table").ColumnFiltersState
          >,
    ) => {
      const handler = createColumnFiltersHandler(setColumnFilters);
      return handler(updaterOrValue);
    },
    [setColumnFilters],
  );
  const handleColumnVisibilityChange = useCallback(
    (
      updaterOrValue:
        | import("@tanstack/react-table").VisibilityState
        | import("@tanstack/react-table").Updater<
            import("@tanstack/react-table").VisibilityState
          >,
    ) => {
      const handler = createColumnVisibilityHandler(setColumnVisibility);
      return handler(updaterOrValue);
    },
    [setColumnVisibility],
  );

  // Add sorting handler for server-side sorting
  const handleSortingChange = useCallback(
    (
      updaterOrValue:
        | import("@tanstack/react-table").SortingState
        | import("@tanstack/react-table").Updater<
            import("@tanstack/react-table").SortingState
          >,
    ) => {
      const handler = createSortingHandler(setSortBy, setSortOrder, sorting);
      return handler(updaterOrValue);
    },
    [setSortBy, setSortOrder, sorting],
  );

  const handlePaginationChange = useCallback(
    (
      updaterOrValue:
        | PaginationUpdater
        | { pageIndex: number; pageSize: number },
    ) => {
      // Extract the new pagination state
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue({ pageIndex: page - 1, pageSize })
          : updaterOrValue;

      // Special handling: When page size changes, always reset to page 1
      if (newPagination.pageSize !== pageSize) {
        Promise.all([setPageSize(newPagination.pageSize), setPage(1)]).catch(
          console.error,
        );

        return;
      }

      // Only update page if it's changed - this handles normal page navigation
      if (newPagination.pageIndex + 1 !== page) {
        const setPagePromise = setPage(newPagination.pageIndex + 1);
        if (setPagePromise && typeof setPagePromise.catch === "function") {
          setPagePromise.catch((err) => {
            console.error("Failed to update page param:", err);
          });
        }
      }
    },
    [page, pageSize, setPage, setPageSize],
  );
  // Column sizing change handler (not used in grid, but kept for consistency)
  const handleColumnSizingChange = useCallback(
    (
      updaterOrValue:
        | ColumnSizingState
        | ((prev: ColumnSizingState) => ColumnSizingState),
    ) => {
      if (typeof updaterOrValue === "function") {
        setColumnSizing((current) => updaterOrValue(current));
      } else {
        setColumnSizing(updaterOrValue);
      }
    },
    [setColumnSizing],
  );

  // Suppress unused variable warning
  void handleColumnSizingChange;

  // Set up the table with memoized state (for filtering/sorting logic)
  const table = useReactTable<TData>({
    data: dataItems,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      columnSizing,
    },
    pageCount: data?.pagination?.total_pages || 0,
    enableRowSelection: tableConfig.enableRowSelection,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  // Add an effect to validate page number when page size changes
  useEffect(() => {
    // This effect ensures page is valid after page size changes
    const totalPages = data?.pagination?.total_pages || 0;

    if (totalPages > 0 && page > totalPages) {
      setPage(1);
    }
  }, [data?.pagination?.total_pages, page, setPage]);

  // Generate grid class names based on configuration
  const gridClasses = useMemo(() => {
    const baseClass = "grid";
    const gapClass = `gap-${gridConfig.gap || 4}`;

    const colClasses = [];
    if (gridConfig.columns?.default) {
      colClasses.push(`grid-cols-${gridConfig.columns.default}`);
    }
    if (gridConfig.columns?.sm) {
      colClasses.push(`sm:grid-cols-${gridConfig.columns.sm}`);
    }
    if (gridConfig.columns?.md) {
      colClasses.push(`md:grid-cols-${gridConfig.columns.md}`);
    }
    if (gridConfig.columns?.lg) {
      colClasses.push(`lg:grid-cols-${gridConfig.columns.lg}`);
    }
    if (gridConfig.columns?.xl) {
      colClasses.push(`xl:grid-cols-${gridConfig.columns.xl}`);
    }
    if (gridConfig.columns?.["2xl"]) {
      colClasses.push(`2xl:grid-cols-${gridConfig.columns["2xl"]}`);
    }

    return [baseClass, gapClass, ...colClasses].join(" ");
  }, [gridConfig]);

  // Handle error state
  if (isError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load data:
          {error instanceof Error ? error.message : "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {tableConfig.enableToolbar && (
        <DataTableToolbar
          table={table}
          setSearch={setSearch}
          setDateRange={setDateRange}
          totalSelectedItems={totalSelectedItems}
          deleteSelection={clearAllSelections}
          getSelectedItems={getSelectedItems}
          getAllItems={getAllItems}
          config={tableConfig}
          resetColumnSizing={() => {}}
          resetColumnOrder={() => {}}
          entityName={exportConfig.entityName}
          columnMapping={exportConfig.columnMapping}
          columnWidths={exportConfig.columnWidths}
          headers={exportConfig.headers}
          columnFilterOptions={columnFilterOptions}
          customToolbarComponent={renderToolbarContent?.({
            selectedRows: dataItems.filter(
              (item) => selectedItemIds[String(item[idField])],
            ),
            allSelectedIds: Object.keys(selectedItemIds),
            totalSelectedCount: totalSelectedItems,
            resetSelection: clearAllSelections,
          })}
        />
      )}
      <div aria-label="Data grid">
        {isLoading ? (
          // Loading state
          <div className={gridClasses}>
            {Array.from({ length: pageSize }).map((_, index) => (
              <GridItemSkeleton key={`loading-item-${index}`} />
            ))}
          </div>
        ) : dataItems.length > 0 ? (
          // Data items
          <div className={gridClasses}>
            {table.getRowModel().rows.map((row, index) => {
              const item = row.original;
              const isSelected = row.getIsSelected();
              const onToggleSelect = () => {
                row.toggleSelected(!isSelected);
              };
              return (
                <div key={String(item[idField])}>
                  {renderGridItem(
                    item,
                    index,
                    isSelected,
                    onToggleSelect,
                    onEdit,
                    onDelete,
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // No results
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-lg font-medium">No results found</div>
              <div className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filter criteria.
              </div>
            </div>
          </div>
        )}
      </div>
      {tableConfig.enablePagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions || [12, 24, 36, 48, 60]}
          size={tableConfig.size}
          paginationLabel={paginationLabel || "Items per page"}
        />
      )}
    </div>
  );
}
