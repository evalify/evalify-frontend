"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ROLE_OPTIONS = [
  { value: "ALL", label: "All Roles" },
  { value: "STUDENT", label: "Students" },
  { value: "FACULTY", label: "Faculty" },
  { value: "ADMIN", label: "Administrators" },
  { value: "MANAGER", label: "Managers" },
];

interface RoleFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RoleFilter: React.FC<RoleFilterProps> = ({
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label
        htmlFor="role-filter"
        className="text-sm font-medium whitespace-nowrap"
      >
        Filter by Role:
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]" id="role-filter">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface RoleFilterButtonsProps {
  value: string;
  onChange: (value: string) => void;
  userCounts?: Record<string, number>;
  className?: string;
}

export const RoleFilterButtons: React.FC<RoleFilterButtonsProps> = ({
  value,
  onChange,
  userCounts = {},
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {ROLE_OPTIONS.map((option) => {
        const count = userCounts[option.value] || 0;
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
              isActive
                ? "bg-primary/10 border-primary text-primary"
                : "bg-background border-border hover:bg-muted"
            }`}
          >
            <span>{option.label}</span>
            {count > 0 && (
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="text-xs"
              >
                {count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default RoleFilter;
