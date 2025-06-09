"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";

export interface Filters {
  courseCode: string;
  courseName: string;
  semester: string;
  status: "active" | "inactive" | "archived" | "";
}

interface FilterButtonProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onApplyFilters: () => void;
}

export default function FilterButton({
  filters,
  setFilters,
  onApplyFilters,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);

  const handleStatusFilter = (status: "active" | "inactive" | "archived") => {
    setFilters({
      ...filters,
      status: filters.status === status ? "" : status,
    });
  };

  const clearFilters = () => {
    setFilters({
      courseCode: "",
      courseName: "",
      semester: "",
      status: "",
    });
  };

  const applyFilters = () => {
    onApplyFilters();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="p-2">
          <SlidersHorizontal size={20} strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Courses</h4>
            <p className="text-sm text-muted-foreground">
              Filter courses by the criteria below
            </p>
          </div>

          <div className="grid gap-4">
            {/* Course Code */}
            <div className="space-y-2">
              <Label htmlFor="courseCode" className="text-sm font-medium">
                Course Code
              </Label>
              <Input
                id="courseCode"
                placeholder="Enter course code"
                value={filters.courseCode}
                onChange={(e) =>
                  setFilters({ ...filters, courseCode: e.target.value })
                }
              />
            </div>

            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="courseName" className="text-sm font-medium">
                Course Name
              </Label>
              <Input
                id="courseName"
                placeholder="Enter course name"
                value={filters.courseName}
                onChange={(e) =>
                  setFilters({ ...filters, courseName: e.target.value })
                }
              />
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <Label htmlFor="semester" className="text-sm font-medium">
                Semester
              </Label>
              <Input
                id="semester"
                type="number"
                placeholder="Enter semester"
                min="1"
                max="8"
                value={filters.semester}
                onChange={(e) =>
                  setFilters({ ...filters, semester: e.target.value })
                }
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex gap-2">
                <Button
                  variant={filters.status === "active" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleStatusFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={
                    filters.status === "inactive" ? "default" : "outline"
                  }
                  size="sm"
                  className="flex-1"
                  onClick={() => handleStatusFilter("inactive")}
                >
                  Inactive
                </Button>
                <Button
                  variant={
                    filters.status === "archived" ? "default" : "outline"
                  }
                  size="sm"
                  className="flex-1"
                  onClick={() => handleStatusFilter("archived")}
                >
                  Archived
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={clearFilters}
            >
              Clear
            </Button>
            <Button size="sm" className="flex-1" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
