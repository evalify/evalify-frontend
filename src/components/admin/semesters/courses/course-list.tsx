"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CourseListProps {
  courses: Course[];
  onDelete: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onDelete }) => {
  const router = useRouter();

  if (!courses || courses.length === 0) {
    return <p>No courses found for this semester.</p>;
  }

  const handleCardClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <Card
          key={course.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(course.id)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(course);
                }}
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p>{course.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;
