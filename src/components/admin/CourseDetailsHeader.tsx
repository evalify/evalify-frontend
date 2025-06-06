"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit, Save, X } from "lucide-react";

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

interface CourseDetailsHeaderProps {
  course: Course;
  isEditing: boolean;
  onBack: () => void;
  onEditToggle: () => void;
  onSave: () => void;
  onInputChange: (field: keyof Course, value: string | number) => void;
  showEditControls?: boolean;
}

export default function CourseDetailsHeader({
  course,
  isEditing,
  onBack,
  onEditToggle,
  onSave,
  onInputChange,
  showEditControls = true,
}: CourseDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={course.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                className="text-2xl font-bold h-auto p-2"
                placeholder="Course Name"
              />
              <Input
                value={course.code}
                onChange={(e) => onInputChange("code", e.target.value)}
                className="text-sm h-auto p-1"
                placeholder="Course Code"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{course.name}</h1>
              <p className="text-sm">{course.code}</p>
            </>
          )}
        </div>
      </div>
      {showEditControls && (
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={onEditToggle}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={onEditToggle}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Course
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
