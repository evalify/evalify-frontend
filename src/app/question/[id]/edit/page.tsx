"use client";

import React from "react";
import { useParams } from "next/navigation";
import QuestionCreationPage from "@/components/question_creation/question-creation-page";

export default function EditQuestionPage() {
  const params = useParams();
  const questionId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <QuestionCreationPage questionId={questionId} isEdit={true} />
    </div>
  );
}
