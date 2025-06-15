"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getScoreTextColor } from "@/lib/utils/score-colors";
import {
  ArrowLeft,
  Clock,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import type { DetailedTestResult, QuestionResult } from "./types";

// Mock data for detailed test result
const mockDetailedTestResult: DetailedTestResult = {
  testId: "mock-test-123",
  testName: "Data Structures and Algorithms - Final Exam",
  courseName: "Computer Science",
  courseId: "CS301",
  courseCode: "CS301",
  completedAt: "2025-06-15T10:30:00Z",
  timeSpent: 45,
  score: 85,
  maxScore: 100,
  percentage: 85,
  questionCount: 20,
  correctCount: 17,
  passingScore: 60,
  questions: [
    {
      questionId: "q1",
      questionText: "What is the time complexity of binary search?",
      questionType: "mcq",
      marks: 5,
      studentAnswer: "a",
      correctAnswer: "a",
      isCorrect: true,
      timeTaken: 2,
      explanation:
        "Binary search has O(log n) time complexity as it divides the search space in half with each iteration.",
      options: [
        { id: "a", text: "O(log n)", isCorrect: true },
        { id: "b", text: "O(n)", isCorrect: false },
        { id: "c", text: "O(n log n)", isCorrect: false },
        { id: "d", text: "O(n²)", isCorrect: false },
      ],
    },
    {
      questionId: "q2",
      questionText: "Which data structure follows LIFO principle?",
      questionType: "mcq",
      marks: 5,
      studentAnswer: "b",
      correctAnswer: "a",
      isCorrect: false,
      timeTaken: 3,
      explanation:
        "Stack follows Last In First Out (LIFO) principle where the last element added is the first one to be removed.",
      options: [
        { id: "a", text: "Stack", isCorrect: true },
        { id: "b", text: "Queue", isCorrect: false },
        { id: "c", text: "Array", isCorrect: false },
        { id: "d", text: "Linked List", isCorrect: false },
      ],
    },
    {
      questionId: "q3",
      questionText: "Is a binary tree with only one node considered balanced?",
      questionType: "true-false",
      marks: 3,
      studentAnswer: true,
      correctAnswer: true,
      isCorrect: true,
      timeTaken: 1,
      explanation:
        "A tree with only one node is considered balanced as the height difference between left and right subtrees is 0.",
    },
    {
      questionId: "q4",
      questionText:
        "Complete the function to find the maximum element in an array:",
      questionType: "fillup",
      marks: 7,
      studentAnswer: "Math.max(...arr)",
      correctAnswer: "Math.max(...arr)",
      isCorrect: true,
      timeTaken: 4,
      explanation:
        "Math.max(...arr) uses the spread operator to pass all array elements as arguments to Math.max().",
    },
    {
      questionId: "q5",
      questionText: "Explain the difference between BFS and DFS algorithms.",
      questionType: "descriptive",
      marks: 10,
      studentAnswer:
        "BFS explores nodes level by level using a queue, while DFS goes as deep as possible using a stack or recursion.",
      correctAnswer:
        "BFS (Breadth-First Search) explores all neighbors at the current depth before moving to nodes at the next depth level, typically using a queue. DFS (Depth-First Search) explores as far as possible along each branch before backtracking, typically using a stack or recursion.",
      isCorrect: true,
      timeTaken: 8,
      explanation:
        "Good explanation covering the key differences in traversal order and data structures used.",
    },
  ],
};

interface DetailedTestResultProps {
  result?: DetailedTestResult;
  onBack: () => void;
}

export const DetailedTestResultView: React.FC<DetailedTestResultProps> = ({
  onBack,
}) => {
  // Use mock data for now
  const result = mockDetailedTestResult; // No longer needed - imported at the top
  const getQuestionIcon = (isCorrect: boolean, questionType: string) => {
    if (questionType === "descriptive" || questionType === "coding") {
      return <HelpCircle className="h-4 w-4 text-amber-600" />;
    }
    return isCorrect ? (
      <CheckCircle className="h-4 w-4 text-emerald-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
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
                    ? "bg-emerald-100 border-emerald-300 dark:bg-green-900/20 dark:border-green-800"
                    : question.studentAnswer === option.id
                      ? "bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-800"
                      : "bg-slate-100 border-slate-300 dark:bg-gray-900/20 dark:border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option.text}</span>{" "}
                  {option.isCorrect && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-emerald-100 border border-emerald-300 text-emerald-800"
                    >
                      Correct
                    </Badge>
                  )}
                  {question.studentAnswer === option.id &&
                    !option.isCorrect && (
                      <Badge
                        variant="secondary"
                        className="ml-auto bg-red-100 border border-red-300 text-red-800"
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
                Your Answer:
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
              </span>
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
              </span>
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
      {/* Header */}{" "}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {" "}
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tests
          </Button>
        </div>
      </div>
      {/* Test Overview */}
      <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent p-6 rounded-lg border border-blue-200 dark:border-blue-900/30 mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{result.testName}</h1>
            <p className="text-muted-foreground">
              {result.courseName} ({result.courseCode})
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(result.completedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{result.timeSpent} min</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4 shadow-sm">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Score</p>
              <div className="flex items-baseline gap-2">
                {" "}
                <span
                  className={`text-2xl font-bold ${getScoreTextColor(result.percentage)}`}
                >
                  {result.percentage.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  ({result.score}/{result.maxScore})
                </span>
              </div>
            </div>{" "}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3 mb-1">
                <p className="text-sm text-muted-foreground">
                  Question Results
                </p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/40">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {result.correctCount}
                </p>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                  correct
                </p>
              </div>
              <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md border border-red-200 dark:bg-red-900/20 dark:border-red-800/40">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {result.questions.filter((q) => q.isCorrect === false).length}
                </p>
                <p className="text-xs text-red-600/80 dark:text-red-400/80">
                  wrong
                </p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40">
                <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />{" "}
                <p className="text-amber-700 dark:text-amber-300 font-medium">
                  {
                    result.questions.filter(
                      (q) =>
                        q.studentAnswer === undefined ||
                        q.studentAnswer === null ||
                        q.studentAnswer === "" ||
                        (Array.isArray(q.studentAnswer) &&
                          q.studentAnswer.length === 0) ||
                        (typeof q.studentAnswer === "object" &&
                          Object.keys(q.studentAnswer).length === 0),
                    ).length
                  }
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                  unanswered
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Questions */}
      <div className="mb-4">
        {" "}
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Questions & Answers</h2>
        </div>
        <div className="space-y-6">
          {result.questions.map((question, index) => (
            <Card key={question.questionId} className="overflow-hidden">
              {" "}
              <CardHeader className="bg-muted/30 py-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        {getQuestionIcon(
                          question.isCorrect,
                          question.questionType,
                        )}{" "}
                        <Badge
                          variant="outline"
                          className={`font-normal text-xs ${
                            question.questionType === "mcq"
                              ? "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/50 dark:text-violet-300"
                              : question.questionType === "fillup"
                                ? "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300"
                                : question.questionType === "true-false"
                                  ? "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/50 dark:text-teal-300"
                                  : question.questionType === "descriptive"
                                    ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300"
                                    : question.questionType === "coding"
                                      ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300"
                                      : question.questionType === "file-upload"
                                        ? "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300"
                                        : question.questionType === "match"
                                          ? "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-950/50 dark:text-pink-300"
                                          : "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-950/50 dark:text-gray-300"
                          }`}
                        >
                          {question.questionType === "mcq"
                            ? "Multiple Choice"
                            : question.questionType === "fillup"
                              ? "Fill in the blank"
                              : question.questionType === "true-false"
                                ? "True or False"
                                : question.questionType === "descriptive"
                                  ? "Essay"
                                  : question.questionType === "coding"
                                    ? "Coding"
                                    : question.questionType === "file-upload"
                                      ? "File Upload"
                                      : question.questionType === "match"
                                        ? "Match Items"
                                        : "Other"}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="font-normal text-xs bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        >
                          {question.marks}{" "}
                          {question.marks === 1 ? "mark" : "marks"}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-medium mt-2">
                        {question.questionText}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {renderAnswer(question)}{" "}
                {question.explanation && (
                  <div className="mt-4 p-3 rounded bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-800">
                    <p className="text-sm font-medium mb-1 text-indigo-800 dark:text-indigo-300">
                      Explanation
                    </p>
                    <p className="text-sm text-indigo-800/90 dark:text-indigo-300/80">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
