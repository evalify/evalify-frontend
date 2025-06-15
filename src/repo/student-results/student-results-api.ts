// Minimal stub for useRecentTestResults to fix import error
import { useMemo } from "react";

export function useRecentTestResults() {
  // Return empty data and loading false for now
  return useMemo(() => ({ data: [], isLoading: false, isError: false }), []);
}
