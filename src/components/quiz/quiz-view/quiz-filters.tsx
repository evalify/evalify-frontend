"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Users,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  status: string[];
  courseCode: string[];
  publishStatus: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export interface SortOption {
  value: string;
  label: string;
}

interface QuizFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  availableStatuses: string[];
  availableCourseCodes: string[];
  sortOptions: SortOption[];
  totalQuizzes: number;
  filteredCount: number;
  className?: string;
}

export function QuizFilters({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  availableStatuses,
  availableCourseCodes,
  sortOptions,
  totalQuizzes,
  filteredCount,
  className,
}: QuizFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({
      ...filters,
      search: value,
    });
  };

  const toggleStatusFilter = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];

    onFiltersChange({
      ...filters,
      status: newStatuses,
    });
  };

  const toggleCourseFilter = (courseCode: string) => {
    const newCourses = filters.courseCode.includes(courseCode)
      ? filters.courseCode.filter((c) => c !== courseCode)
      : [...filters.courseCode, courseCode];

    onFiltersChange({
      ...filters,
      courseCode: newCourses,
    });
  };

  const togglePublishStatusFilter = (publishStatus: string) => {
    const newPublishStatuses = filters.publishStatus.includes(publishStatus)
      ? filters.publishStatus.filter((p) => p !== publishStatus)
      : [...filters.publishStatus, publishStatus];

    onFiltersChange({
      ...filters,
      publishStatus: newPublishStatuses,
    });
  };

  const clearAllFilters = () => {
    setSearchValue("");
    onFiltersChange({
      search: "",
      status: [],
      courseCode: [],
      publishStatus: [],
      dateRange: { from: null, to: null },
    });
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    filters.status.length +
    filters.courseCode.length +
    filters.publishStatus.length +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0);

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-300",
    SCHEDULED: "bg-blue-100 text-blue-700 border-blue-300",
    ACTIVE: "bg-green-100 text-green-700 border-green-300",
    PAUSED: "bg-yellow-100 text-yellow-700 border-yellow-300",
    COMPLETED: "bg-purple-100 text-purple-700 border-purple-300",
    CANCELLED: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Top row with search and view controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search quizzes..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => handleSearchChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View mode toggle */}
          <div className="flex border rounded-md p-1 bg-muted/50">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Status
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Filter by Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filters.status.includes(status)}
                onCheckedChange={() => toggleStatusFilter(status)}
              >
                <span className="capitalize">{status.toLowerCase()}</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Course filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Users className="h-4 w-4 mr-2" />
              Course
              {filters.courseCode.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                  {filters.courseCode.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Filter by Course
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableCourseCodes.map((code) => (
              <DropdownMenuCheckboxItem
                key={code}
                checked={filters.courseCode.includes(code)}
                onCheckedChange={() => toggleCourseFilter(code)}
              >
                {code}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Publish Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Settings className="h-4 w-4 mr-2" />
              Visibility
              {filters.publishStatus.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                  {filters.publishStatus.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Filter by Visibility
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.publishStatus.includes("published")}
              onCheckedChange={() => togglePublishStatusFilter("published")}
            >
              Published
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.publishStatus.includes("unpublished")}
              onCheckedChange={() => togglePublishStatusFilter("unpublished")}
            >
              Unpublished
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear filters button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear {activeFiltersCount} filter
            {activeFiltersCount !== 1 ? "s" : ""}
          </Button>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-600 ml-auto">
          {filteredCount === totalQuizzes ? (
            <span>
              {totalQuizzes} quiz{totalQuizzes !== 1 ? "es" : ""}
            </span>
          ) : (
            <span>
              {filteredCount} of {totalQuizzes} quiz
              {totalQuizzes !== 1 ? "es" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {`"${filters.search}"`}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => handleSearchChange("")}
              />
            </Badge>
          )}

          {filters.status.map((status) => (
            <Badge
              key={status}
              className={cn(
                "gap-1",
                statusColors[status] || statusColors.DRAFT,
              )}
            >
              {status.toLowerCase()}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => toggleStatusFilter(status)}
              />
            </Badge>
          ))}

          {filters.courseCode.map((code) => (
            <Badge key={code} variant="outline" className="gap-1">
              {code}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => toggleCourseFilter(code)}
              />
            </Badge>
          ))}

          {filters.publishStatus.map((status) => (
            <Badge
              key={status}
              variant="outline"
              className="gap-1 bg-blue-50 text-blue-700 border-blue-300"
            >
              {status}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => togglePublishStatusFilter(status)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
