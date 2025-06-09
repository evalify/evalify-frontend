"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Quiz from "@/repo/quiz/quiz";

export default function Page() {
  const { data, isPending, error } = useQuery({
    queryKey: ["quiz"],
    queryFn: Quiz.getAllQuizzes,
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
