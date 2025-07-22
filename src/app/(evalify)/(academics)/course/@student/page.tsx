"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import StudentCourse from "@/repo/student/course/student-course";

export default function Page() {
  const { data, isPending, error } = useQuery({
    queryKey: ["course"],
    queryFn: StudentCourse.getAllStudentCourses,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Quiz Student Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
