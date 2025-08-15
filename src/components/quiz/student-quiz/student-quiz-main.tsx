/**
 * Main Student Quiz Component with Side Navigation
 * Provides full-screen quiz interface with navigation and question rendering
 */

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
  Moon,
  Sun,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "next-themes";
import { useQuiz } from "./quiz-context";
import ViolationLogsDisplay from "./components/violation-logs-display";
import { QuestionTypeDetector } from "./factories/question-factory";
import { TrueFalseRenderer } from "./renderers/true-false-renderer";
import { MCQRenderer } from "./renderers/mcq-renderer";
import { MMCQRenderer } from "./renderers/mmcq-renderer";
import { DescriptiveRenderer } from "./renderers/descriptive-renderer";
import { CodingRenderer } from "./renderers/coding-renderer";
import { FileUploadRenderer } from "./renderers/file-upload-renderer";
import QuizSideNavigation from "./navigation/quiz-side-navigation-grid";
import { FillUpRenderer } from "./renderers/fill-up-renderer";
import { MatchRenderer } from "./renderers/match-renderer";
import {
  TrueFalseQuestion,
  MCQQuestion,
  MMCQQuestion,
  DescriptiveQuestion,
  FillUpQuestion,
  FillUpAnswer,
  MatchQuestion,
  MatchAnswer,
  CodingQuestion,
  FileUploadQuestion,
} from "./types/quiz-types";

interface StudentQuizMainProps {
  className?: string;
}

export const StudentQuizMain: React.FC<StudentQuizMainProps> = ({
  className = "",
}) => {
  const quiz = useQuiz();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { theme, setTheme } = useTheme();

  // Timer effect
  useEffect(() => {
    const updateTimer = () => {
      const remaining = quiz.getTimeRemaining();
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [quiz]);

  if (!quiz.quizData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion =
    quiz.quizData.questions[quiz.currentQuestionIndex]?.question;
  if (!currentQuestion) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No questions available in this quiz.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const questionData = currentQuestion.questions;
  const questionType = QuestionTypeDetector.detectTypeFromData(currentQuestion);
  const currentAnswer = quiz.getCurrentAnswer(questionData.questionId);

  const renderQuestion = () => {
    switch (questionType) {
      case "TRUE_FALSE":
        const trueFalseAnswer =
          currentAnswer === "" || currentAnswer === null
            ? null
            : (currentAnswer as boolean);
        return (
          <TrueFalseRenderer
            questionData={questionData as TrueFalseQuestion}
            currentAnswer={trueFalseAnswer}
            onAnswerChange={(answer: boolean) =>
              quiz.setAnswer(questionData.questionId, answer)
            }
            isReadOnly={false}
            className="w-full"
          />
        );
      case "MCQ":
        return (
          <MCQRenderer
            questionData={questionData as MCQQuestion}
            currentAnswer={currentAnswer as string | null}
            onAnswerChange={(answer: string) =>
              quiz.setAnswer(questionData.questionId, answer)
            }
            isReadOnly={false}
            className="w-full"
          />
        );
      case "MMCQ":
        return (
          <MMCQRenderer
            questionData={questionData as MMCQQuestion}
            currentAnswer={currentAnswer as string[] | null}
            onAnswerChange={(answer: string[]) =>
              quiz.setAnswer(questionData.questionId, answer)
            }
            isReadOnly={false}
            className="w-full"
          />
        );
      case "DESCRIPTIVE":
        return (
          <DescriptiveRenderer
            questionData={questionData as DescriptiveQuestion}
            currentAnswer={currentAnswer as string | null}
            onAnswerChange={(answer: string) =>
              quiz.setAnswer(questionData.questionId, answer)
            }
            isReadOnly={false}
            className="w-full"
          />
        );
      case "FILL_UP":
        return (
          <FillUpRenderer
            questionData={questionData as FillUpQuestion}
            currentAnswer={currentAnswer as FillUpAnswer[] | null}
            onAnswerChange={(answer: FillUpAnswer[]) =>
              quiz.setAnswer(questionData.questionId, answer)
            }
            isReadOnly={false}
            className="w-full"
          />
        );
      case "MATCH":
        return (
          <MatchRenderer
            questionId={questionData.questionId}
            questionData={questionData as MatchQuestion}
            currentAnswer={currentAnswer as MatchAnswer[] | null}
            onAnswerChange={(answer: MatchAnswer[]) =>
              quiz.setAnswer(questionData.questionId, answer)
            }
            isReadOnly={false}
            className="w-full"
          />
        );
      case "CODING":
        return (
          <CodingRenderer
            questionData={questionData as CodingQuestion}
            currentAnswer={currentAnswer as string | null}
            onAnswerChange={(answer: string) =>
              quiz.setAnswer(questionData.questionId, answer)
            }
            isReadOnly={false}
            className="w-full"
          />
        );
      case "FILE_UPLOAD":
        return new FileUploadRenderer().render(
          questionData as FileUploadQuestion,
          currentAnswer as string | undefined,
          (answer: string) => quiz.setAnswer(questionData.questionId, answer),
          false,
        );
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            Unsupported question type: {questionType}
          </div>
        );
    }
  };

  return (
    <div className={`h-screen flex flex-col bg-background ${className}`}>
      {/* Top Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">
              {quiz.quizData.quizInfo.quizName}
            </h1>
            <Badge variant="outline">
              Question {quiz.currentQuestionIndex + 1} of {quiz.totalQuestions}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {quiz.userInfo && (
              <div className="flex items-center space-x-2">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-medium">
                    {quiz.userInfo.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {quiz.userInfo.profileId.split("@")[0]}
                  </span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={quiz.userInfo.image}
                    alt={quiz.userInfo.name}
                  />
                  <AvatarFallback>
                    {quiz.userInfo.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Violation Logs Display */}
      <ViolationLogsDisplay
        violations={quiz.violations}
        violationCount={quiz.violationCount}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Content - Full Width */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Question Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="h-full p-6">
              {/* Fullscreen Violation Warning */}
              {quiz.quizData.quizInfo.fullScreen && !quiz.isFullScreen && (
                <Alert className="mb-6" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>
                      This quiz requires fullscreen mode. Please enable
                      fullscreen to continue.
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={quiz.requestFullScreen}
                    >
                      Enter Fullscreen
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Question Content */}
              <div className="h-full flex flex-col">
                {/* Section Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 justify-between">
                  <div>
                    <Badge variant="outline" className="text-lg font-semibold">
                      Question {quiz.currentQuestionIndex + 1} of{" "}
                      {quiz.totalQuestions}
                    </Badge>
                  </div>
                  <span className="text-lg ">
                    {currentQuestion.section.name}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {questionData.marks}{" "}
                      {questionData.marks === 1 ? "Mark" : "Marks"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {questionData.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Question Renderer - Take remaining height */}
                <div className="flex-1 overflow-auto">{renderQuestion()}</div>
              </div>
            </div>
          </div>

          {/* Fixed Navigation Controls at Bottom */}
          <div className="border-t bg-background p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={quiz.goToPrevious}
                disabled={!quiz.canNavigateBack}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to clear your answer for this question?",
                      )
                    ) {
                      // Clear answer based on question type
                      switch (questionType) {
                        case "TRUE_FALSE":
                        case "MCQ":
                        case "DESCRIPTIVE":
                        case "CODING":
                        case "FILE_UPLOAD":
                          quiz.setAnswer(questionData.questionId, "");
                          break;
                        case "MMCQ":
                          quiz.setAnswer(questionData.questionId, []);
                          break;
                        case "FILL_UP":
                        case "MATCH":
                          quiz.setAnswer(questionData.questionId, []);
                          break;
                        default:
                          quiz.setAnswer(questionData.questionId, "");
                      }
                    }
                  }}
                  disabled={!quiz.hasAnswer(questionData.questionId)}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear Answer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => quiz.toggleReviewMark(questionData.questionId)}
                  className="gap-2"
                >
                  <Flag
                    className={`w-4 h-4 ${
                      quiz.navigationState.sections
                        .flatMap((s) => s.questions)
                        .find((q) => q.questionId === questionData.questionId)
                        ?.status.isMarkedForReview
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  />
                  {quiz.navigationState.sections
                    .flatMap((s) => s.questions)
                    .find((q) => q.questionId === questionData.questionId)
                    ?.status.isMarkedForReview
                    ? "Marked for Review"
                    : "Mark for Review"}
                </Button>
                <Button
                  variant="outline"
                  onClick={quiz.goToNext}
                  disabled={!quiz.canNavigateForward}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Side Navigation */}
        <aside className="w-80 border-l bg-muted/10">
          <QuizSideNavigation
            navigationState={quiz.navigationState}
            onQuestionSelect={quiz.goToQuestionById}
            timeRemaining={timeLeft}
            startTime={quiz.quizData.quizStudentInfo.startTime}
            endTime={quiz.quizData.quizStudentInfo.endTime}
            className="h-full"
          />
        </aside>
      </div>
    </div>
  );
};

export default StudentQuizMain;
