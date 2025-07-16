"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import type { FilterState } from "@/components/quiz/quiz-view/quiz-filters";

interface UseQuizStateOptions {
  defaultSort?: string;
}

export function useQuizState(options: UseQuizStateOptions = {}) {
  const { defaultSort = "startTime" } = options;
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Get URL params for search and sort
  const searchFromUrl = searchParams.get("search") || "";
  const sortFromUrl = searchParams.get("sort") || defaultSort;
  const statusFromUrl =
    searchParams.get("status")?.split(",").filter(Boolean) || [];
  const courseCodeFromUrl =
    searchParams.get("courses")?.split(",").filter(Boolean) || [];

  // Get view preference from localStorage
  const getViewPreference = useCallback((): "grid" | "table" => {
    if (typeof window === "undefined" || !session?.user?.id) return "grid";

    const stored = localStorage.getItem(`quiz-staff-view-${session.user.id}`);
    return (stored as "grid" | "table") || "grid";
  }, [session?.user?.id]);

  // State
  const [viewMode, setViewMode] = useState<"grid" | "table">(
    getViewPreference(),
  );
  const [sortBy, setSortBy] = useState(sortFromUrl);
  const [filters, setFilters] = useState<FilterState>({
    search: searchFromUrl,
    status: statusFromUrl,
    courseCode: courseCodeFromUrl,
    dateRange: { from: null, to: null },
  });

  // Update URL params when filters or sort change
  const updateUrlParams = useCallback(
    (newFilters: FilterState, newSortBy: string) => {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams();

      if (newFilters.search.trim()) {
        params.set("search", newFilters.search.trim());
      }

      if (newSortBy !== defaultSort) {
        params.set("sort", newSortBy);
      }

      if (newFilters.status.length > 0) {
        params.set("status", newFilters.status.join(","));
      }

      if (newFilters.courseCode.length > 0) {
        params.set("courses", newFilters.courseCode.join(","));
      }

      const paramString = params.toString();
      const newUrl = paramString ? `?${paramString}` : window.location.pathname;

      // Use replace to avoid adding to browser history for every filter change
      window.history.replaceState({}, "", newUrl);
    },
    [defaultSort],
  );

  // Save view preference to localStorage
  const saveViewPreference = useCallback(
    (mode: "grid" | "table") => {
      if (typeof window !== "undefined" && session?.user?.id) {
        localStorage.setItem(`quiz-staff-view-${session.user.id}`, mode);
      }
    },
    [session?.user?.id],
  );

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (mode: "grid" | "table") => {
      setViewMode(mode);
      saveViewPreference(mode);
    },
    [saveViewPreference],
  );

  // Handle filters change with URL update
  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      updateUrlParams(newFilters, sortBy);
    },
    [sortBy, updateUrlParams],
  );

  // Handle sort change with URL update
  const handleSortChange = useCallback(
    (newSortBy: string) => {
      setSortBy(newSortBy);
      updateUrlParams(filters, newSortBy);
    },
    [filters, updateUrlParams],
  );

  // Initialize view preference from localStorage on session load
  useEffect(() => {
    if (session?.user?.id) {
      const preference = getViewPreference();
      setViewMode(preference);
    }
  }, [session?.user?.id, getViewPreference]);

  // Sync state with URL params when they change externally
  useEffect(() => {
    const newSearch = searchParams.get("search") || "";
    const newSort = searchParams.get("sort") || defaultSort;
    const newStatus =
      searchParams.get("status")?.split(",").filter(Boolean) || [];
    const newCourseCode =
      searchParams.get("courses")?.split(",").filter(Boolean) || [];

    setFilters((prev) => ({
      ...prev,
      search: newSearch,
      status: newStatus,
      courseCode: newCourseCode,
    }));
    setSortBy(newSort);
  }, [searchParams, defaultSort]);

  return {
    viewMode,
    sortBy,
    filters,
    handleViewModeChange,
    handleFiltersChange,
    handleSortChange,
  };
}
