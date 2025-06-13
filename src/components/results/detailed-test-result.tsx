"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Target,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import { DetailedTestResult, QuestionResult } from "./types";

interface DetailedTestResultProps {
  result: DetailedTestResult;
  onBack: () => void;
}

export const DetailedTestResultView: React.FC<DetailedTestResultProps> = ({
  result,
  onBack,
}) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getQuestionIcon = (isCorrect: boolean, questionType: string) => {
    if (questionType === "descriptive" || questionType === "coding") {
      return <HelpCircle className="h-4 w-4 text-yellow-500" />;
    }
    return isCorrect ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const renderAnswer = (question: QuestionResult) => {
    switch (question.questionType) {
      case "mcq":
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div
                key={option.id}
                className={`p-2 rounded border ${
                  option.isCorrect
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : question.studentAnswer === option.id
                      ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                      : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option.text}</span>
                  {option.isCorrect && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-green-100 text-green-800"
                    >
                      Correct
                    </Badge>
                  )}
                  {question.studentAnswer === option.id &&
                    !option.isCorrect && (
                      <Badge
                        variant="secondary"
                        className="ml-auto bg-red-100 text-red-800"
                      >
                        Your Answer
                      </Badge>
                    )}
                </div>
              </div>
            ))}
          </div>
        );

      case "true-false":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span>
                Your Answer:{" "}
                <Badge
                  variant="outline"
                  className={
                    question.isCorrect
                      ? "ml-2 text-green-600"
                      : "ml-2 text-red-600"
                  }
                >
                  {typeof question.studentAnswer === "boolean"
                    ? question.studentAnswer
                      ? "True"
                      : "False"
                    : String(question.studentAnswer)}
                </Badge>
              </span>
              <span>
                Correct Answer:
                <Badge variant="outline" className="ml-2 text-green-600">
                  {typeof question.correctAnswer === "boolean"
                    ? question.correctAnswer
                      ? "True"
                      : "False"
                    : String(question.correctAnswer)}
                </Badge>
              </span>
            </div>
          </div>
        );

      case "fillup":
        return (
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">
                Your Answer:
              </span>{" "}
              <p
                className={`mt-1 p-2 rounded border ${
                  question.isCorrect
                    ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800"
                }`}
              >
                {!question.studentAnswer
                  ? "No answer provided"
                  : Array.isArray(question.studentAnswer)
                    ? question.studentAnswer.join(", ")
                    : typeof question.studentAnswer === "object"
                      ? JSON.stringify(question.studentAnswer)
                      : String(question.studentAnswer)}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                Correct Answer:
              </span>{" "}
              <p className="mt-1 p-2 rounded border bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800">
                {Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.join(", ")
                  : typeof question.correctAnswer === "object"
                    ? JSON.stringify(question.correctAnswer)
                    : String(question.correctAnswer)}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-3 bg-muted rounded border">
            <p className="text-sm text-muted-foreground">
              Answer review not available for this question type
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tests
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{result.testName}</h1>
            <p className="text-muted-foreground">
              {result.courseName} ({result.courseCode})
            </p>
          </div>
        </div>
      </div>

      {/* Test Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Test Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Score */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Final Score
              </div>
              <div
                className={`text-3xl font-bold ${getScoreColor(result.percentage)}`}
              >
                {result.score}/{result.maxScore}
              </div>
              <div
                className={`text-lg font-medium ${getScoreColor(result.percentage)}`}
              >
                {result.percentage}%
              </div>
              <Progress value={result.percentage} className="w-full" />
            </div>

            {/* Time */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Time Taken
              </div>
              <div className="text-2xl font-bold">{result.timeTaken}m</div>
              <div className="text-sm text-muted-foreground">
                of {result.totalTime}m allocated
              </div>
            </div>

            {/* Questions */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Questions
              </div>
              <div className="text-2xl font-bold text-green-600">
                {result.summary.correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">
                of {result.summary.totalQuestions} correct
              </div>
            </div>

            {/* Date */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Completed
              </div>
              <div className="text-lg font-medium">
                {new Date(result.completedAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(result.completedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                {result.summary.correctAnswers}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">
                {result.summary.incorrectAnswers}
              </div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-600">
                {result.summary.unanswered}
              </div>
              <div className="text-xs text-muted-foreground">Unanswered</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">
                {result.summary.timePerQuestion.toFixed(1)}m
              </div>
              <div className="text-xs text-muted-foreground">Avg Time/Q</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question by Question Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Question-wise Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {result.questions.map((question, index) => (
              <div
                key={question.questionId}
                className="border rounded-lg p-4 space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getQuestionIcon(question.isCorrect, question.questionType)}
                    <div className="space-y-1">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {question.questionType.toUpperCase()}
                        </Badge>
                        <span>{question.marks} marks</span>
                        <span>•</span>
                        <span>{question.timeTaken}s</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={question.isCorrect ? "default" : "destructive"}
                    className={question.isCorrect ? "bg-green-600" : ""}
                  >
                    {question.isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>

                {/* Question Text */}
                <div className="prose prose-sm max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: question.questionText }}
                    className="text-foreground"
                  />
                </div>

                {/* Answer Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">
                    Your Answer vs Correct Answer
                  </h4>
                  {renderAnswer(question)}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Explanation
                    </h4>
                    <div className="p-3 bg-blue-50 rounded border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: question.explanation,
                        }}
                        className="text-sm text-blue-800 dark:text-blue-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
