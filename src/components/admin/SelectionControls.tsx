"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Trash2, Download } from "lucide-react";

interface Course {
  code: string;
  name: string;
  semester: string;
  status: string;
  credits: number;
  description?: string;
  instructorName?: string;
  instructorEmail?: string;
  learningOutcomes?: string[];
}

interface SelectionControlsProps {
  isSelectMode: boolean;
  selectedCourses: Set<string>;
  filteredCourses: Course[];
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
}

export default function SelectionControls({
  isSelectMode,
  selectedCourses,
  filteredCourses,
  onSelectAll,
  onBulkDelete,
  onBulkExport,
}: SelectionControlsProps) {
  if (!isSelectMode) return null;

  const isAllSelected =
    filteredCourses.length > 0 &&
    filteredCourses.every((course) => selectedCourses.has(course.code));
  const isSomeSelected = selectedCourses.size > 0 && !isAllSelected;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md mb-2 mx-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        {isSomeSelected ? (
          <div className="flex items-center">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
            />
            <Minus
              className="h-3 w-3 absolute pointer-events-none text-primary-foreground"
              style={{ opacity: isSomeSelected && !isAllSelected ? 1 : 0 }}
            />
          </div>
        ) : (
          <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
        )}
        <span className="text-sm font-medium">
          {selectedCourses.size > 0
            ? `${selectedCourses.size} selected`
            : "Select all"}
        </span>
      </div>
      {selectedCourses.size > 0 && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onBulkDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
          <Button size="sm" variant="outline" onClick={onBulkExport}>
            <Download className="h-4 w-4 mr-1" />
            Export Selected
          </Button>
        </div>
      )}
    </div>
  );
}
