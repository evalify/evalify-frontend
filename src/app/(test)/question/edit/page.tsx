"use client";

import React from "react";
import QuestionCreationPage from "@/components/question_creation/question-creation-page";
import { QuestionData } from "@/components/question_creation/question-editor";

// Sample data for testing edit mode
const sampleQuestionData: QuestionData = {
  type: "fillup",
  question:
    "The capital of France is ___ and it is located in the ___ part of the country.",
  explanation:
    "Paris is the capital and largest city of France, located in the north-central part of the country.",
  showExplanation: true,
  blanks: [
    {
      id: "blank-1",
      position: 1,
      acceptedAnswers: ["Paris", "paris"],
    },
    {
      id: "blank-2",
      position: 2,
      acceptedAnswers: ["northern", "north", "north-central"],
    },
  ],
};

const sampleQuestionSettings = {
  marks: 3,
  difficulty: "easy",
  bloomsTaxonomy: "Remember",
  courseOutcome: "CO1",
  topics: [
    { value: "geography", label: "Geography" },
    { value: "france", label: "France" },
  ],
};

export default function QuestionEditTestPage() {
  return (
    <div className="min-h-screen">
      <QuestionCreationPage
        isEdit={true}
        initialQuestionData={sampleQuestionData}
        initialQuestionSettings={sampleQuestionSettings}
        questionId="test-question-123"
      />
    </div>
  );
}
