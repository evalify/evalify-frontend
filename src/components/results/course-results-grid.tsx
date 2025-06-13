"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { CourseResult } from "./types";
import { CourseCard } from "./course-card";

interface CourseResultsGridProps {
  courses: CourseResult[];
  onViewCourse: (courseId: string) => void;
}

export const CourseResultsGrid: React.FC<CourseResultsGridProps> = ({
  courses,
  onViewCourse,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Course-wise Results</h2>
        <Badge variant="outline">{courses.length} Courses</Badge>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Course Results</h3>
            <p className="text-muted-foreground text-center">
              You haven&apos;t taken any tests yet. Start with your first quiz!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
          {courses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              onViewCourse={onViewCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
};
