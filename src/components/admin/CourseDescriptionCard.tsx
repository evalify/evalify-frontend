"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Instructor {
  name: string;
  email: string;
}

interface Course {
  code: string;
  name: string;
  semester: string;
  status: string;
  credits: number;
  description?: string;
  instructors?: Instructor[];
  learningOutcomes?: string[];
}

interface CourseDescriptionCardProps {
  course: Course;
  isEditing: boolean;
  onInputChange: (field: keyof Course, value: string | number) => void;
}

export default function CourseDescriptionCard({
  course,
  isEditing,
  onInputChange,
}: CourseDescriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Description</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={course.description || ""}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Enter course description"
            className="min-h-[120px]"
          />
        ) : (
          <p className="leading-relaxed">
            {course.description || "No description available for this course."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
