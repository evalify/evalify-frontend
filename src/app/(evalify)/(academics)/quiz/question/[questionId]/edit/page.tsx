"use client";

import React, { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionCreation from "@/components/question-creation/question-creation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileEdit } from "lucide-react";

type Props = {
  params: Promise<{
    questionId: string;
  }>;
};

const EditQuestionPage = ({ params }: Props) => {
  const param = use(params);
  const { questionId } = param;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get quiz and course IDs from search params
  const quizId = searchParams.get("quizId");
  const courseId = searchParams.get("courseId");

  const handleSaveAndBack = () => {
    // Navigate back to the quiz view page
    if (quizId && courseId) {
      router.push(`/course/${courseId}/quiz/${quizId}/view`);
    } else {
      // Fallback: go back in history
      router.back();
    }
  };

  const handleBack = () => {
    if (quizId && courseId) {
      router.push(`/course/${courseId}/quiz/${quizId}/view`);
    } else {
      router.back();
    }
  };

  // Validate required parameters
  if (!quizId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <FileEdit className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">
                  Missing Quiz Information
                </h3>
                <p className="text-muted-foreground">
                  Quiz ID is required to edit this question.
                </p>
              </div>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quiz
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Question</h1>
              <p className="text-muted-foreground text-sm">
                Question ID: {questionId}
              </p>
            </div>
          </div>
        </div>
      </div>

      <QuestionCreation
        isEditing={true}
        questionId={questionId}
        onSaveAndBack={handleSaveAndBack}
        config={{
          isQuiz: true,
          quizId: quizId,
          courseId: courseId || undefined,
        }}
      />
    </div>
  );
};

export default EditQuestionPage;
