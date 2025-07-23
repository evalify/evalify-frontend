"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type StudentCourse = {
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

interface StudentCourseCardProps {
  course: StudentCourse;
}

const courseTypeColors = {
  CORE: {
    header: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    badge:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  ELECTIVE: {
    header: "bg-gradient-to-br from-green-500 to-green-600 text-white",
    badge:
      "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  },
  LAB: {
    header: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
    badge:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  PROJECT: {
    header: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
    badge:
      "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  },
};

export function StudentCourseCard({ course }: StudentCourseCardProps) {
  const router = useRouter();

  const colors = courseTypeColors[
    course.courseType as keyof typeof courseTypeColors
  ] || {
    header: "bg-gradient-to-br from-gray-500 to-gray-600 text-white",
    badge:
      "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800",
  };

  return (
    <div className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {/* Course Code Header */}
      <div
        className={`p-6 text-center ${colors.header} relative overflow-hidden rounded-t-xl`}
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <h3 className="text-2xl font-bold tracking-wider drop-shadow-sm">
            {course.code}
          </h3>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 dark:bg-black/10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/10 dark:bg-black/10 rounded-full"></div>
      </div>

      <Card className="rounded-t-none overflow-hidden shadow-md border-t-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {course.name}
              </CardTitle>
            </div>
            <Badge
              className={`${colors.badge} text-xs font-medium border ml-2 shrink-0`}
            >
              {course.courseType}
            </Badge>
          </div>

          <CardDescription className="line-clamp-2 text-sm leading-relaxed">
            {course.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {course.semester.name} ({course.semester.year})
              </span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs"
              onClick={() => {
                router.push(`/course/${course.id}/quiz`);
              }}
            >
              View Quizzes
              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
