"use client";

import { courseQueries } from "@/repo/course-queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCard } from "@/components/course/course-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Grid,
  List,
  BookOpen,
  Calendar,
  SortAsc,
  SortDesc,
  Filter,
  GraduationCap,
  Clock,
  ArrowRight,
} from "lucide-react";

type StaffCourse = {
  id: string;
  name: string;
  courseCode: string;
  description: string;
  quizzes: number;
  semester: {
    id: string;
    name: string;
  };
};

type ViewMode = "cards" | "table";
type SortField = "name" | "courseCode" | "semester" | "quizzes";
type SortOrder = "asc" | "desc";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  const courseColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white",
    "bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 text-white",
    "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 text-white",
    "bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 text-white",
    "bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500 text-white",
    "bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 text-white",
    "bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 text-white",
    "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-white",
    "bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-400 dark:to-cyan-500 text-white",
    "bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white",
    "bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 text-white",
    "bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-400 dark:to-rose-500 text-white",
  ];

  const getColorForCourse = (courseId: string) => {
    // Use multiple characters from the ID for better distribution
    const hash = courseId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % courseColors.length;
    return courseColors[index];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseQueries.getCoursesHandledByUser(),
  }) as { data: StaffCourse[] | undefined; isLoading: boolean };

  const semesters = useMemo(() => {
    if (!data) return [];
    const uniqueSemesters = Array.from(
      new Set(data.map((course: StaffCourse) => course.semester.name)),
    );
    return uniqueSemesters;
  }, [data]);

  const filteredAndSortedCourses = useMemo(() => {
    if (!data) return [];

    const filtered = data.filter((course: StaffCourse) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSemester =
        semesterFilter === "all" || course.semester.name === semesterFilter;

      return matchesSearch && matchesSemester;
    });

    filtered.sort((a: StaffCourse, b: StaffCourse) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "courseCode":
          comparison = a.courseCode.localeCompare(b.courseCode);
          break;
        case "semester":
          comparison = a.semester.name.localeCompare(b.semester.name);
          break;
        case "quizzes":
          comparison = a.quizzes - b.quizzes;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [data, searchTerm, semesterFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderContent = () => {
    if (viewMode === "cards") {
      return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              colorClass={getColorForCourse(course.id)}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 dark:bg-muted/20">
              <TableHead
                className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-semibold"
                onClick={() => toggleSort("courseCode")}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Course Code
                  {sortField === "courseCode" &&
                    (sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-semibold"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Course Name
                  {sortField === "name" &&
                    (sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-semibold"
                onClick={() => toggleSort("semester")}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Semester
                  {sortField === "semester" &&
                    (sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 text-center font-semibold"
                onClick={() => toggleSort("quizzes")}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  Quizzes
                  {sortField === "quizzes" &&
                    (sortOrder === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCourses.map((course) => (
              <TableRow
                key={course.id}
                className="hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors"
              >
                <TableCell>
                  <div
                    className={`flex h-10 w-20 items-center justify-center rounded-md text-sm font-bold shadow-sm ${getColorForCourse(course.id)}`}
                  >
                    {course.courseCode}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">
                      {course.name}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {course.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium">
                    <Calendar className="mr-1 h-3 w-3" />
                    {course.semester.name}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-medium">{course.quizzes}</span>
                    <span className="text-xs text-muted-foreground">
                      quiz{course.quizzes !== 1 ? "es" : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ArrowRight className="mr-1 h-3 w-3" />
                    View Course
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Skeleton className="h-10 w-full md:flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => ({
            id: `skeleton-${Date.now()}-${i}`,
          })).map((skeleton) => (
            <Card key={skeleton.id} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="h-12 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center space-y-6 text-center p-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-xl dark:shadow-black/20">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 dark:bg-orange-400 rounded-full flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-black/20">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            No courses found
          </h3>
          <p className="text-muted-foreground max-w-md">
            {
              "You don't have any courses assigned yet. Contact your administrator to get courses assigned to your account."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Courses
          </h1>
          <p className="text-muted-foreground">
            Manage and view your assigned courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="transition-all"
          >
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Cards</span>
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="transition-all"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Table</span>
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

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
                  {semester}
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
              <SelectItem value="courseCode-asc">Code A-Z</SelectItem>
              <SelectItem value="courseCode-desc">Code Z-A</SelectItem>
              <SelectItem value="semester-asc">Semester A-Z</SelectItem>
              <SelectItem value="semester-desc">Semester Z-A</SelectItem>
              <SelectItem value="quizzes-asc">Quizzes (Low to High)</SelectItem>
              <SelectItem value="quizzes-desc">
                Quizzes (High to Low)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredAndSortedCourses.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{data.length}</span>{" "}
          courses
        </div>
        {filteredAndSortedCourses.length > 0 && (
          <Badge variant="outline" className="font-medium">
            {viewMode === "cards" ? "Card View" : "Table View"}
          </Badge>
        )}
      </div>

      {/* Content */}
      {filteredAndSortedCourses.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 text-center rounded-lg border-2 border-dashed border-muted bg-muted/20 dark:bg-muted/10 p-8">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded-xl flex items-center justify-center shadow-lg dark:shadow-xl dark:shadow-black/20">
              <Search className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              No courses match your search
            </h3>
            <p className="text-muted-foreground max-w-md">
              {
                "Try adjusting your search terms or filters to find the courses you're looking for."
              }
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSemesterFilter("all");
            }}
            className="mt-4 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}
