"use client";

import { useState, useCallback } from "react";
import { ColumnSizingState } from "@tanstack/react-table";

/**
 * Custom hook to manage table column sizing with in-memory state
 *
 * @param enableResizing Whether column resizing is enabled
 * @returns An object with column sizing state and setter
 */
export function useTableColumnResize(enableResizing: boolean = false) {
  // Column sizing state
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // Custom setter for column sizing
  const handleSetColumnSizing = useCallback(
    (
      newSizing:
        | ColumnSizingState
        | ((prev: ColumnSizingState) => ColumnSizingState),
    ) => {
      if (enableResizing) {
        setColumnSizing(newSizing);
      }
    },
    [enableResizing],
  );

  // Function to reset column sizes
  const resetColumnSizing = useCallback(() => {
    if (enableResizing) {
      setColumnSizing({});
    }
  }, [enableResizing]);

  return {
    columnSizing,
    setColumnSizing: handleSetColumnSizing,
    resetColumnSizing,
  };
}
