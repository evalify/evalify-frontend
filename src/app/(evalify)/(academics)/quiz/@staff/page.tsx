"use client";

import Quiz from "@/repo/quiz/quiz";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["quizCreationData"],
    queryFn: Quiz.getAllQuizzes,
  });
  return (
    <div>
      <h1>Quiz Staff Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
