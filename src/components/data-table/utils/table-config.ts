/**
 * Table configuration options
 * This file provides centralized configuration for the data table features
 */
export interface TableConfig {
  // Enable/disable row selection
  enableRowSelection: boolean;

  // Enable/disable clicking a row to select it
  enableClickRowSelect: boolean;

  // Enable/disable pagination
  enablePagination: boolean;

  // Enable/disable search
  enableSearch: boolean;

  // Enable/disable column filters
  enableColumnFilters: boolean;

  // Enable/disable date range filter
  enableDateFilter: boolean;

  // Enable/disable column visibility options
  enableColumnVisibility: boolean;

  // Enable/disable data export
  enableExport: boolean;

  // Enable/disable URL state persistence
  enableUrlState: boolean;

  // Enable/disable column resizing
  enableColumnResizing: boolean;

  // Enable/disable toolbar
  enableToolbar: boolean;

  // Enable/disable assign action
  enableAssign: boolean;

  // Enable/disable delete action
  enableDelete: boolean;

  // Control the size of buttons and inputs throughout the table
  // sm: small, default: standard, lg: large
  size: "sm" | "default" | "lg";
}

// Default configuration
const defaultConfig: TableConfig = {
  enableRowSelection: true, // Row selection enabled by default
  enableClickRowSelect: false, // Clicking row to select disabled by default
  enablePagination: true, // Pagination enabled by default
  enableSearch: true, // Search enabled by default
  enableColumnFilters: true, // Column filters enabled by default
  enableDateFilter: false, // Date filter disabled by default
  enableColumnVisibility: true, // Column visibility options enabled by default
  enableExport: true, // Data export enabled by default
  enableUrlState: true, // URL state persistence enabled by default
  enableColumnResizing: true, // Column resizing enabled by default
  enableToolbar: true, // Toolbar enabled by default
  enableAssign: false, // Assign action disabled by default
  enableDelete: false, // Delete action disabled by default
  size: "default", // Default size for buttons and inputs
};

/**
 * Hook to provide table configuration
 * Allows overriding default configuration
 */
export function useTableConfig(
  overrideConfig?: Partial<TableConfig>,
): TableConfig {
  // Merge default config with any overrides
  const config = { ...defaultConfig, ...overrideConfig };

  return config;
}
