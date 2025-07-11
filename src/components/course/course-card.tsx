"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, GraduationCap, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type StaffCourse = {
  id: string;
  name: string;
  courseCode: string;
  description: string;
  quizzes?: number;
  semester: {
    id: string;
    name: string;
  };
};

interface CourseCardProps {
  course: StaffCourse;
  colorClass: string;
}

export function CourseCard({ course, colorClass }: CourseCardProps) {
  const router = useRouter();

  return (
    <Card className="group hover:shadow-lg dark:hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md dark:shadow-lg dark:shadow-black/10 bg-card dark:bg-card">
      <CardHeader className="p-0">
        {/* Course Code Banner */}
        <div
          className={`p-6 text-center ${colorClass} relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <GraduationCap className="h-8 w-8 mx-auto mb-3 opacity-90" />
            <h3 className="text-2xl font-bold tracking-wider drop-shadow-sm">
              {course.courseCode}
            </h3>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 dark:bg-black/10 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/10 dark:bg-black/10 rounded-full"></div>
        </div>

        {/* Course Info */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight flex-1">
              {course.name}
            </h4>
            <Badge variant="secondary" className="ml-2 shrink-0">
              <Calendar className="mr-1 h-3 w-3" />
              {course.semester.name}
            </Badge>
          </div>
          <div className="h-12 mb-4">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {course.quizzes !== undefined && course.quizzes > 0 && (
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span className="font-medium">{course.quizzes}</span>
                <span>Quiz{course.quizzes !== 1 ? "es" : ""}</span>
              </div>
            )}
          </div>
          <Button
            size="sm"
            className=""
            variant="ghost"
            onClick={() => {
              router.push(`/course/${course.id}/quiz`);
            }}
          >
            View Quiz
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
