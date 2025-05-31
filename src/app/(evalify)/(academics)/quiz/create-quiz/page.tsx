"use client";

import React from "react";
import { QuizCreationTabs } from "@/components/quiz-creation/quiz-creation-tabs";

export default function QuizPage() {
  return (
    <div className="h-screen max-h-screen overflow-hidden">
      <QuizCreationTabs />
    </div>
  );
}
