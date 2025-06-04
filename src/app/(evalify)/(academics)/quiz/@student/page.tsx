"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Quiz from "@/repo/quiz/quiz";

export default function Page() {
  const { data, isPending } = useQuery({
    queryKey: ["quiz"],
    queryFn: Quiz.getAllQuizzes,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Quiz Student Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
