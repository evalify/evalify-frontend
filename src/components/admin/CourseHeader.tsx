"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import FilterButton, { type Filters } from "@/components/admin/FilterButton";

interface CourseHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onApplyFilters: () => void;
  isSelectMode: boolean;
  onToggleSelectMode: () => void;
}

export default function CourseHeader({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  onApplyFilters,
  isSelectMode,
  onToggleSelectMode,
}: CourseHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full gap-4 flex-nowrap mb-6 px-4 flex-shrink-0">
      <div className="text-sm font-medium whitespace-nowrap">Course Name</div>

      <div className="flex items-center gap-2">
        <div className="w-[350px]">
          <Command>
            <CommandInput
              placeholder="Search courses..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </Command>
        </div>
        <FilterButton
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={onApplyFilters}
        />

        <Button variant="outline" onClick={onToggleSelectMode}>
          {isSelectMode ? "Cancel" : "Select"}
        </Button>
      </div>
    </div>
  );
}
