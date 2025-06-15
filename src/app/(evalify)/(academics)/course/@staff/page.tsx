"use client";

import { courseQueries } from "@/repo/course-queries/course-queries";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import React from "react";

export default function Page() {
  const session = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseQueries.getActiveCourses(session.data?.user.id || ""),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (data?.length === 0) {
    return <div>No courses found</div>;
  }
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
