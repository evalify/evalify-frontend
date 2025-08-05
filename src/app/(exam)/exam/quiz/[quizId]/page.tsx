"use client";

import StudentQuiz from "@/repo/student/quiz/student-quiz";
import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

const Page = ({ params }: Props) => {
  const param = use(params);
  const { quizId } = param;
  const { data: quizData } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      return StudentQuiz.startQuiz(quizId);
    },
    refetchOnWindowFocus: false,
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quiz {quizId}</h1>
      <p className="text-gray-700">
        This is the quiz page for quiz ID: {quizId}
      </p>
      {/* Add your quiz content here */}
      <p className="text-lg">This page is under construction.</p>
      <pre>{JSON.stringify(quizData, null, 2)}</pre>
    </div>
  );
};

export default Page;
