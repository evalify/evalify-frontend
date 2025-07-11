"use client";
import Quiz from "@/repo/quiz/quiz";
import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";

type Props = {
  params: Promise<{
    courseId: string;
  }>;
};

export default function Page({ params }: Props) {
  const { courseId } = use(params);

  const { data } = useQuery({
    queryKey: ["quizzes", courseId],
    queryFn: () => Quiz.getQuizzesByCourseId(courseId),
  });

  return <div>{data && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>;
}
