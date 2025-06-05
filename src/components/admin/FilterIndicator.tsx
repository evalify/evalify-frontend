"use client";

import { Button } from "@/components/ui/button";
import type { Filters } from "@/components/admin/FilterButton";

interface FilterIndicatorProps {
  filters: Filters;
  onClearFilters: () => void;
}

export default function FilterIndicator({
  filters,
  onClearFilters,
}: FilterIndicatorProps) {
  const hasActiveFilters =
    filters.courseCode ||
    filters.courseName ||
    filters.semester ||
    filters.status;

  if (!hasActiveFilters) return null;

  return (
    <div className="mt-2 px-4 pb-4 text-xs text-muted-foreground flex gap-2 flex-shrink-0">
      <span>Active filters:</span>
      {filters.courseCode && <span>Code: {filters.courseCode}</span>}
      {filters.courseName && <span>Name: {filters.courseName}</span>}
      {filters.semester && <span>Semester: {filters.semester}</span>}
      {filters.status && <span>Status: {filters.status}</span>}
      <Button
        variant="link"
        className="text-xs p-0 h-auto"
        onClick={onClearFilters}
      >
        Clear all
      </Button>
    </div>
  );
}
