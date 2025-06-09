"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import NewCourse from "./NewCourse";

interface Course {
  code: string;
  name: string;
  semester: string;
  status: string;
  credits: number;
}

interface CourseManagementProps {
  onAddCourse: (course: Course) => void;
}

export default function CourseManagement({
  onAddCourse,
}: CourseManagementProps) {
  const [showNewCourse, setShowNewCourse] = useState(false);

  const handleCreateCourse = () => {
    setShowNewCourse(true);
  };

  const handleCloseNewCourse = () => {
    setShowNewCourse(false);
  };

  const handleCourseCreated = (course: Course) => {
    onAddCourse(course);
  };

  return (
    <div className="w-full j flex justify-end p-8">
      <div className="m-0">
        <Button variant="outline" onClick={handleCreateCourse}>
          Create new course
        </Button>
      </div>

      <NewCourse
        isOpen={showNewCourse}
        onClose={handleCloseNewCourse}
        onCreateCourse={handleCourseCreated}
      />
    </div>
  );
}
