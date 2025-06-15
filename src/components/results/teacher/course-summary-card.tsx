"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeacherCourseOverview } from "./types";
import { Users, BookOpen, Award } from "lucide-react";

interface CourseSummaryCardProps {
  course: TeacherCourseOverview;
  onViewCourse: (courseId: string) => void;
}

export function CourseSummaryCard({
  course,
  onViewCourse,
}: CourseSummaryCardProps) {
  return (
    <Card
      className="hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={() => onViewCourse(course.courseId)}
    >
      <CardHeader className="pb-2 bg-primary/10">
        <CardTitle className="text-lg font-semibold">
          {course.courseName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{course.courseCode}</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Students</span>
                <p className="font-medium">{course.totalStudents}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Tests</span>
                <p className="font-medium">{course.totalTests}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">High Score</span>
                <p className="font-medium">{course.highestScore}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
