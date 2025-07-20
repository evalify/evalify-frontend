"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import QuestionCreationPage from "@/components/question_creation/question-creation-page";

export default function EditQuestionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const questionId = params.id as string;
  const quizId = searchParams.get("quizId");
  const courseId = searchParams.get("courseId");

  // Determine if this is a quiz question edit
  const config = quizId
    ? {
        isQuiz: true,
        quizId: quizId,
        courseId: courseId || undefined,
        // Note: sectionId is not needed for editing, only for creation
      }
    : { isQuiz: false };

  return (
    <div className="container mx-auto py-6">
      <QuestionCreationPage
        questionId={questionId}
        isEdit={true}
        config={config}
        // bankId might be needed for topics, you can add it based on your requirements
      />
    </div>
  );
}
