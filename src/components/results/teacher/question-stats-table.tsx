"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedTestStatistics, QuestionStat } from "./types";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuestionStatsTableProps {
  statistics?: DetailedTestStatistics;
}

type SortField =
  | "questionNumber"
  | "questionText"
  | "questionType"
  | "difficulty"
  | "averageScore"
  | "correctPercentage"
  | "attemptedCount"
  | "skippedCount";
type SortDirection = "asc" | "desc";

// Mock data for question stats
const mockQuestionStats: QuestionStat[] = [
  {
    questionId: "q1",
    questionNumber: 1,
    questionText:
      "What is the time complexity of binary search algorithm when searching in a sorted array?",
    questionType: "mcq",
    difficulty: "medium",
    averageScore: 4.2,
    correctPercentage: 85,
    attemptedCount: 10,
    skippedCount: 0,
  },
  {
    questionId: "q2",
    questionNumber: 2,
    questionText:
      "Which data structure follows the Last In First Out (LIFO) principle?",
    questionType: "mcq",
    difficulty: "easy",
    averageScore: 4.8,
    correctPercentage: 95,
    attemptedCount: 10,
    skippedCount: 0,
  },
  {
    questionId: "q3",
    questionNumber: 3,
    questionText:
      "Is a binary tree with only one node considered balanced according to AVL tree definition?",
    questionType: "true-false",
    difficulty: "medium",
    averageScore: 2.4,
    correctPercentage: 80,
    attemptedCount: 10,
    skippedCount: 0,
  },
  {
    questionId: "q4",
    questionNumber: 4,
    questionText: "Complete the function: def find_max(arr): return ___",
    questionType: "fillup",
    difficulty: "easy",
    averageScore: 6.3,
    correctPercentage: 90,
    attemptedCount: 9,
    skippedCount: 1,
  },
  {
    questionId: "q5",
    questionNumber: 5,
    questionText:
      "Explain the difference between Breadth-First Search (BFS) and Depth-First Search (DFS) algorithms. Include their time complexities and use cases.",
    questionType: "descriptive",
    difficulty: "hard",
    averageScore: 7.5,
    correctPercentage: 75,
    attemptedCount: 8,
    skippedCount: 2,
  },
  {
    questionId: "q6",
    questionNumber: 6,
    questionText:
      "Implement a function to reverse a linked list iteratively in Python.",
    questionType: "coding",
    difficulty: "hard",
    averageScore: 6.8,
    correctPercentage: 68,
    attemptedCount: 7,
    skippedCount: 3,
  },
  {
    questionId: "q7",
    questionNumber: 7,
    questionText: "What is the space complexity of merge sort algorithm?",
    questionType: "mcq",
    difficulty: "medium",
    averageScore: 3.5,
    correctPercentage: 70,
    attemptedCount: 10,
    skippedCount: 0,
  },
  {
    questionId: "q8",
    questionNumber: 8,
    questionText:
      "Can a hash table have O(n) worst-case time complexity for search operations?",
    questionType: "true-false",
    difficulty: "hard",
    averageScore: 2.1,
    correctPercentage: 70,
    attemptedCount: 10,
    skippedCount: 0,
  },
  {
    questionId: "q9",
    questionNumber: 9,
    questionText:
      "Write a function to check if a string is a palindrome: def is_palindrome(s): ___",
    questionType: "fillup",
    difficulty: "easy",
    averageScore: 4.8,
    correctPercentage: 96,
    attemptedCount: 9,
    skippedCount: 1,
  },
  {
    questionId: "q10",
    questionNumber: 10,
    questionText:
      "Implement a binary search tree (BST) class with insert, search, and delete methods in your preferred programming language.",
    questionType: "coding",
    difficulty: "advanced",
    averageScore: 5.2,
    correctPercentage: 52,
    attemptedCount: 6,
    skippedCount: 4,
  },
];

export function QuestionStatsTable({}: QuestionStatsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("questionNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
      case "hard":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
      case "advanced":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    }
  };

  const sortedAndFilteredQuestions = useMemo(() => {
    // Use mock data for now
    const questionsData = mockQuestionStats;

    const filtered = questionsData.filter(
      (question) =>
        question.questionType
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.questionText
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        question.difficulty.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "questionNumber":
          aValue = a.questionNumber;
          bValue = b.questionNumber;
          break;
        case "questionText":
          aValue = a.questionText.toLowerCase();
          bValue = b.questionText.toLowerCase();
          break;
        case "questionType":
          aValue = a.questionType.toLowerCase();
          bValue = b.questionType.toLowerCase();
          break;
        case "difficulty":
          // Custom sorting for difficulty
          const difficultyOrder = { easy: 1, medium: 2, hard: 3, advanced: 4 };
          aValue =
            difficultyOrder[
              a.difficulty.toLowerCase() as keyof typeof difficultyOrder
            ] || 5;
          bValue =
            difficultyOrder[
              b.difficulty.toLowerCase() as keyof typeof difficultyOrder
            ] || 5;
          break;
        case "averageScore":
          aValue = a.averageScore;
          bValue = b.averageScore;
          break;
        case "correctPercentage":
          aValue = a.correctPercentage;
          bValue = b.correctPercentage;
          break;
        case "attemptedCount":
          aValue = a.attemptedCount;
          bValue = b.attemptedCount;
          break;
        case "skippedCount":
          aValue = a.skippedCount;
          bValue = b.skippedCount;
          break;
        default:
          aValue = a.questionNumber;
          bValue = b.questionNumber;
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [searchQuery, sortField, sortDirection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question Analysis ({sortedAndFilteredQuestions.length} questions)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center border rounded-md px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by question text, type, or difficulty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("questionNumber")}
                    >
                      Q#
                      {getSortIcon("questionNumber")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("questionText")}
                    >
                      Question Text
                      {getSortIcon("questionText")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("questionType")}
                    >
                      Type
                      {getSortIcon("questionType")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("difficulty")}
                    >
                      Difficulty
                      {getSortIcon("difficulty")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("correctPercentage")}
                    >
                      Correct %{getSortIcon("correctPercentage")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("averageScore")}
                    >
                      Avg Score
                      {getSortIcon("averageScore")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("attemptedCount")}
                    >
                      Attempted
                      {getSortIcon("attemptedCount")}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredQuestions.map((question) => (
                  <TableRow key={question.questionId}>
                    <TableCell className="text-center font-medium">
                      {question.questionNumber}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div
                        className="font-medium"
                        title={question.questionText}
                      >
                        {truncateText(question.questionText)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {question.questionType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(question.difficulty)}
                      >
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold">
                            {question.correctPercentage}%
                          </span>
                        </div>
                        <Progress
                          value={question.correctPercentage}
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-semibold">
                        {question.averageScore.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-semibold">
                          {question.attemptedCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {question.skippedCount} skipped
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedAndFilteredQuestions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchQuery
                        ? "No questions found matching your search."
                        : "No question data available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {sortedAndFilteredQuestions.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              Hover over question text to see the full question
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
