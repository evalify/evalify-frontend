"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen, GraduationCap, X } from "lucide-react";
import StudentCourse from "@/repo/student/course/student-course";
import { StudentCourseCard } from "@/components/student/course/course-card";
import { useDebounce } from "@/hooks/use-debounce";

type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  courseType: string;
  semester: {
    id: string;
    name: string;
    year: number;
  };
};

export default function StudentCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedSemester, setSelectedSemester] = useState<string>(
    searchParams.get("semester") || "all",
  );
  const [selectedCourseType, setSelectedCourseType] = useState<string>(
    searchParams.get("type") || "all",
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    }

    if (selectedSemester !== "all") {
      params.set("semester", selectedSemester);
    }

    if (selectedCourseType !== "all") {
      params.set("type", selectedCourseType);
    }

    const paramString = params.toString();
    const newUrl = paramString ? `?${paramString}` : "/course";

    router.replace(newUrl, { scroll: false });
  }, [debouncedSearchQuery, selectedSemester, selectedCourseType, router]);

  // Function to clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSemester("all");
    setSelectedCourseType("all");
  };

  const { data: courses = [], error } = useQuery({
    queryKey: ["student-courses"],
    queryFn: StudentCourse.getAllStudentCourses,
  });

  // Get unique semesters and course types for filtering
  const { semesters, courseTypes } = useMemo(() => {
    if (!courses || courses.length === 0)
      return {
        semesters: [] as Array<{ id: string; name: string; year: number }>,
        courseTypes: [] as string[],
      };

    const semesterStrings = new Set(
      courses.map((course: Course) =>
        JSON.stringify({
          id: course.semester.id,
          name: course.semester.name,
          year: course.semester.year,
        }),
      ),
    );

    const uniqueSemesters = Array.from(semesterStrings).map(
      (str) =>
        JSON.parse(str as string) as { id: string; name: string; year: number },
    );

    const courseTypeStrings = new Set(
      courses.map((course: Course) => course.courseType),
    );
    const uniqueCourseTypes = Array.from(courseTypeStrings) as string[];

    return { semesters: uniqueSemesters, courseTypes: uniqueCourseTypes };
  }, [courses]);

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course: Course) => {
      const matchesSearch =
        debouncedSearchQuery === "" ||
        course.name
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        course.code
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase());

      const matchesSemester =
        selectedSemester === "all" || course.semester.id === selectedSemester;

      const matchesCourseType =
        selectedCourseType === "all" ||
        course.courseType === selectedCourseType;

      return matchesSearch && matchesSemester && matchesCourseType;
    });
  }, [courses, debouncedSearchQuery, selectedSemester, selectedCourseType]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-destructive text-lg font-semibold mb-2">
              Error Loading Courses
            </div>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-muted-foreground">
              Manage and access your enrolled courses
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-3 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />

          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name} ({semester.year})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCourseType}
            onValueChange={setSelectedCourseType}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {courseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filteredCourses.length} course
            {filteredCourses.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {(debouncedSearchQuery ||
          selectedSemester !== "all" ||
          selectedCourseType !== "all") && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filters:</span>
            {debouncedSearchQuery && (
              <Badge variant="secondary" className="text-xs">
                Search: {debouncedSearchQuery}
              </Badge>
            )}
            {selectedSemester !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {semesters.find((s) => s.id === selectedSemester)?.name}
              </Badge>
            )}
            {selectedCourseType !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {selectedCourseType}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-muted/30 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground max-w-md">
            {debouncedSearchQuery ||
            selectedSemester !== "all" ||
            selectedCourseType !== "all"
              ? "Try adjusting your search or filter criteria."
              : "You haven't enrolled in any courses yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course: Course) => (
            <StudentCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
