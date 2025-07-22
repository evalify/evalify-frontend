"use client";

import AuthGuard from "@/components/auth/auth-guard";
import { UserType } from "@/lib/auth/utils";
import StudentQuiz from "@/repo/student/quiz/student-quiz";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const { data: quizData } = useQuery({
    queryKey: ["studentQuizzes"],
    queryFn: StudentQuiz.getAllStudentQuizzes,
  });

  return (
    <AuthGuard requiredGroups={[UserType.STUDENT]}>
      <div>
        <pre>{JSON.stringify(quizData, null, 2)}</pre>
      </div>
    </AuthGuard>
  );
};
export default Page;
