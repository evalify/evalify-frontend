"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import StudentQuiz from "@/repo/student/quiz/student-quiz";
import { QuizProvider } from "@/components/quiz/student-quiz/quiz-context";
import { StudentQuizMain } from "@/components/quiz/student-quiz/student-quiz-main";
import { QuizInterface } from "@/components/quiz/student-quiz/types/quiz-types";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

const QuizPage = ({ params }: Props) => {
  const param = use(params);
  const { quizId } = param;

  const {
    data: quizData,
    isLoading,
    isError,
    error,
  } = useQuery<QuizInterface>({
    queryKey: ["quiz", quizId, "started"],
    queryFn: async () => {
      return await StudentQuiz.startQuiz(quizId);
    },
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-primary mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-primary/30 mx-auto animate-ping"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Starting Your Quiz
              </h2>
              <p className="text-sm text-muted-foreground">
                Setting up your exam environment and loading questions...
              </p>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Alert className="border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Failed to load quiz</strong>
                <br />
                {error instanceof Error
                  ? error.message
                  : "Unable to access quiz"}
                <br />
                <br />
                Please go back to the quiz instructions and start the quiz
                properly.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validate quiz data structure
  if (!quizData.quizInfo?.quizId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Alert className="border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Invalid quiz data</strong>
                <br />
                The quiz data is incomplete. Please try starting the quiz again
                from the instructions page.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state - render quiz
  return (
    <QuizProvider quizData={quizData}>
      <StudentQuizMain />
    </QuizProvider>
  );
};

export default QuizPage;
