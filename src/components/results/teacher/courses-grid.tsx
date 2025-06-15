"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherCourseOverview } from "./types";
import { BookOpen, Clock, Users, BarChart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Function to get a color for the course card based on course code
const getCourseColor = (courseCode: string): string => {
  // Extract the first letter or number from the course code
  const firstChar = courseCode.charAt(0).toLowerCase();

  // Assign colors based on the first character
  if (["a", "b", "c"].includes(firstChar))
    return "border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30";
  if (["d", "e", "f"].includes(firstChar))
    return "border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30";
  if (["g", "h", "i"].includes(firstChar))
    return "border-l-violet-500 bg-violet-50/80 dark:bg-violet-950/30";
  if (["j", "k", "l"].includes(firstChar))
    return "border-l-amber-500 bg-amber-50/80 dark:bg-amber-950/30";
  if (["m", "n", "o"].includes(firstChar))
    return "border-l-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/30";
  if (["p", "q", "r"].includes(firstChar))
    return "border-l-rose-500 bg-rose-50/80 dark:bg-rose-950/30";
  if (["s", "t", "u"].includes(firstChar))
    return "border-l-green-500 bg-green-50/80 dark:bg-green-950/30";
  if (["v", "w", "x", "y", "z"].includes(firstChar))
    return "border-l-orange-500 bg-orange-50/80 dark:bg-orange-950/30";

  // Default for numbers or other characters
  return "border-l-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/30";
};

export type SortOption =
  | "latest"
  | "oldest"
  | "code-asc"
  | "code-desc"
  | "name-asc"
  | "name-desc";

export const SortDropdown = ({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) => {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as SortOption)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latest">Latest Test</SelectItem>
        <SelectItem value="oldest">Oldest Test</SelectItem>
        <SelectItem value="code-asc">Course Code (A-Z)</SelectItem>
        <SelectItem value="code-desc">Course Code (Z-A)</SelectItem>
        <SelectItem value="name-asc">Course Name (A-Z)</SelectItem>
        <SelectItem value="name-desc">Course Name (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  );
};

interface CoursesGridProps {
  courses: TeacherCourseOverview[];
  onViewCourse: (courseId: string) => void;
  sortBy?: SortOption;
}

export function CoursesGrid({
  courses,
  onViewCourse,
  sortBy = "latest",
}: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">No courses available</p>
        </CardContent>
      </Card>
    );
  }

  // Sort courses based on selected option
  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return (
          new Date(b.lastTestDate || "").getTime() -
          new Date(a.lastTestDate || "").getTime()
        );
      case "oldest":
        return (
          new Date(a.lastTestDate || "").getTime() -
          new Date(b.lastTestDate || "").getTime()
        );
      case "code-asc":
        return a.courseCode.localeCompare(b.courseCode);
      case "code-desc":
        return b.courseCode.localeCompare(a.courseCode);
      case "name-asc":
        return a.courseName.localeCompare(b.courseName);
      case "name-desc":
        return b.courseName.localeCompare(a.courseName);
      default:
        return 0;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedCourses.map((course) => {
        const colorClass = getCourseColor(course.courseCode);
        return (
          <Card
            key={course.courseId}
            className="hover:shadow-md transition-all cursor-pointer overflow-hidden"
            onClick={() => onViewCourse(course.courseId)}
          >
            {/* Apply the color class to the entire header and remove padding-top to ensure color extends to top */}
            <CardHeader className={`pt-0 pb-2 border-l-4 ${colorClass}`}>
              <div className="pt-4">
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{course.courseName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.courseCode}
                    </p>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Students
                  </div>
                  <p className="font-medium">{course.totalStudents}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Tests
                  </div>
                  <p className="font-medium">{course.totalTests}</p>
                </div>{" "}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BarChart className="h-4 w-4 mr-2" />
                    Avg Score
                  </div>
                  <p className="font-medium">
                    {course.averageScore.toFixed(1)}%
                  </p>
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Last Test
                  </div>
                  <p className="font-medium text-sm">
                    {course.lastTestDate
                      ? formatDistanceToNow(new Date(course.lastTestDate), {
                          addSuffix: true,
                        })
                      : "None"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
