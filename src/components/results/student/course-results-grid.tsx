"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CourseResult } from "./types";
import { CourseCard } from "./course-card";

interface CourseResultsGridProps {
  courses: CourseResult[];
  onViewCourse: (courseId: string) => void;
  onViewTest?: (testId: string) => void;
}

export function CourseResultsGrid({
  courses,
  onViewCourse,
  onViewTest,
}: CourseResultsGridProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            onViewCourse={onViewCourse}
            onViewTest={onViewTest}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No courses found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
