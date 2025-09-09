"use client";

import React from "react";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import QuestionCreation from "@/components/question-creation/question-creation";

type Props = {
  params: Promise<{
    courseId: string;
    quizId: string;
  }>;
};

export default function CreateQuizQuestionPage({ params }: Props) {
  const param = use(params);
  const { quizId, courseId } = param;
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("sectionId");

  if (!sectionId) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Missing Section
          </h1>
          <p className="text-muted-foreground">
            Section ID is required to create a quiz question.
          </p>
        </div>
      </div>
    );
  }

  const config = {
    isQuiz: true,
    quizId: quizId,
    sectionId: sectionId,
    courseId: courseId, // Include courseId in config
  };

  const handleSaveAndNew = () => {
    // Simply refresh the current page to create a new question
    // This will reset the form while keeping the same route and parameters
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Create Quiz Question
        </h1>
        <p className="text-muted-foreground">
          Create a new question for this quiz section.
        </p>
      </div>
      <QuestionCreation
        config={config}
        onSaveAndNew={handleSaveAndNew}
      />
    </div>
  );
}
