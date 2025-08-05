"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, SortAsc, SortDesc } from "lucide-react";

type SortField =
  | "name"
  | "courseCode"
  | "semester"
  | "questions"
  | "topics"
  | "created_at";
type SortOrder = "asc" | "desc";

interface BankSearchFiltersProps {
  semesters: string[];
  semesterFilter: string;
  setSemesterFilter: (value: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
}

export function BankSearchFilters({
  semesters,
  semesterFilter,
  setSemesterFilter,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
}: BankSearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={semesterFilter} onValueChange={setSemesterFilter}>
        <SelectTrigger className="w-40">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Filter by semester" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Semesters</SelectItem>
          {semesters.map((semester) => (
            <SelectItem key={semester} value={semester}>
              Semester {semester}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={`${sortField}-${sortOrder}`}
        onValueChange={(value) => {
          const [field, order] = value.split("-") as [SortField, SortOrder];
          setSortField(field);
          setSortOrder(order);
        }}
      >
        <SelectTrigger className="w-40">
          {sortOrder === "asc" ? (
            <SortAsc className="mr-2 h-4 w-4" />
          ) : (
            <SortDesc className="mr-2 h-4 w-4" />
          )}
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name A-Z</SelectItem>
          <SelectItem value="name-desc">Name Z-A</SelectItem>
          <SelectItem value="courseCode-asc">Course Code A-Z</SelectItem>
          <SelectItem value="courseCode-desc">Course Code Z-A</SelectItem>
          <SelectItem value="semester-asc">Semester (Low to High)</SelectItem>
          <SelectItem value="semester-desc">Semester (High to Low)</SelectItem>
          <SelectItem value="questions-asc">Questions (Low to High)</SelectItem>
          <SelectItem value="questions-desc">
            Questions (High to Low)
          </SelectItem>
          <SelectItem value="topics-asc">Topics (Low to High)</SelectItem>
          <SelectItem value="topics-desc">Topics (High to Low)</SelectItem>
          <SelectItem value="created_at-asc">Oldest First</SelectItem>
          <SelectItem value="created_at-desc">Newest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
