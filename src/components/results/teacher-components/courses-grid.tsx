"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { TeacherCourseOverview } from "../teacher-types";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, ChevronRight, Users } from "lucide-react";

// Function to get a color for the course card based on course code
const getCourseColor = (courseCode: string): string => {
  // Extract the first letter or number from the course code
  const firstChar = courseCode.charAt(0).toLowerCase();

  // Assign colors based on the first character
  if (["a", "b", "c"].includes(firstChar))
    return "border-blue-500 bg-blue-50 dark:bg-blue-950/30";
  if (["d", "e", "f"].includes(firstChar))
    return "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
  if (["g", "h", "i"].includes(firstChar))
    return "border-violet-500 bg-violet-50 dark:bg-violet-950/30";
  if (["j", "k", "l"].includes(firstChar))
    return "border-amber-500 bg-amber-50 dark:bg-amber-950/30";
  if (["m", "n", "o"].includes(firstChar))
    return "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30";
  if (["p", "q", "r"].includes(firstChar))
    return "border-rose-500 bg-rose-50 dark:bg-rose-950/30";
  if (["s", "t", "u"].includes(firstChar))
    return "border-green-500 bg-green-50 dark:bg-green-950/30";
  if (["v", "w", "x", "y", "z"].includes(firstChar))
    return "border-orange-500 bg-orange-50 dark:bg-orange-950/30";

  // Default for numbers or other characters
  return "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30";
};

interface CoursesGridProps {
  courses: TeacherCourseOverview[];
  onViewCourse: (courseId: string) => void;
}

export function CoursesGrid({ courses, onViewCourse }: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No courses found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const colorClass = getCourseColor(course.courseCode);

        return (
          <Card
            key={course.courseId}
            className={`hover:shadow-md transition-shadow duration-200 overflow-hidden border-t-4 ${colorClass}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{course.courseName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {course.courseCode}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-full p-1.5">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-muted-foreground text-xs">Students</p>
                    <p className="font-medium">{course.totalStudents}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-muted-foreground text-xs">Tests</p>
                    <p className="font-medium">{course.totalTests}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-muted-foreground text-xs">Average</p>
                    <p className="font-medium">
                      {course.averageScore.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-full h-4 w-4 bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-500 text-[10px] font-bold">
                      %
                    </span>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Completion</p>
                    <p className="font-medium">{course.completionRate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                variant="ghost"
                onClick={() => onViewCourse(course.courseId)}
                className="w-full text-primary justify-between hover:bg-primary/5"
              >
                View Course Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
