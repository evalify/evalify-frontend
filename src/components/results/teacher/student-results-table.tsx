"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedTestStatistics, StudentTestResult } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRelative } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StudentResultsTableProps {
  statistics?: DetailedTestStatistics;
  onViewStudentResult?: (studentId: string) => void;
}

type SortField =
  | "studentName"
  | "rollNumber"
  | "score"
  | "percentage"
  | "correctAnswers"
  | "wrongAnswers"
  | "unansweredQuestions"
  | "submittedAt";
type SortDirection = "asc" | "desc";

// Mock data for student results
const mockStudentResults: StudentTestResult[] = [
  {
    studentId: "1",
    studentName: "Alice Johnson",
    rollNumber: "CS2021001",
    score: 85,
    maxScore: 100,
    percentage: 85,
    timeTaken: 45,
    completedAt: "2025-06-15T10:30:00Z",
    status: "completed",
    attemptCount: 1,
    correctAnswers: 17,
    wrongAnswers: 2,
    unansweredQuestions: 1,
    submittedAt: "2025-06-15T10:30:00Z",
  },
  {
    studentId: "2",
    studentName: "Bob Smith",
    rollNumber: "CS2021002",
    score: 92,
    maxScore: 100,
    percentage: 92,
    timeTaken: 38,
    completedAt: "2025-06-15T09:45:00Z",
    status: "completed",
    attemptCount: 1,
    correctAnswers: 18,
    wrongAnswers: 1,
    unansweredQuestions: 1,
    submittedAt: "2025-06-15T09:45:00Z",
  },
  {
    studentId: "3",
    studentName: "Carol Davis",
    rollNumber: "CS2021003",
    score: 78,
    maxScore: 100,
    percentage: 78,
    timeTaken: 52,
    completedAt: "2025-06-15T11:15:00Z",
    status: "completed",
    attemptCount: 2,
    correctAnswers: 15,
    wrongAnswers: 3,
    unansweredQuestions: 2,
    submittedAt: "2025-06-15T11:15:00Z",
  },
  {
    studentId: "4",
    studentName: "David Wilson",
    rollNumber: "CS2021004",
    score: 95,
    maxScore: 100,
    percentage: 95,
    timeTaken: 42,
    completedAt: "2025-06-15T10:00:00Z",
    status: "completed",
    attemptCount: 1,
    correctAnswers: 19,
    wrongAnswers: 1,
    unansweredQuestions: 0,
    submittedAt: "2025-06-15T10:00:00Z",
  },
  {
    studentId: "5",
    studentName: "Emma Brown",
    rollNumber: "CS2021005",
    score: 67,
    maxScore: 100,
    percentage: 67,
    timeTaken: 58,
    completedAt: "2025-06-15T12:00:00Z",
    status: "completed",
    attemptCount: 1,
    correctAnswers: 13,
    wrongAnswers: 5,
    unansweredQuestions: 2,
    submittedAt: "2025-06-15T12:00:00Z",
  },
  {
    studentId: "6",
    studentName: "Frank Miller",
    rollNumber: "CS2021006",
    score: 88,
    maxScore: 100,
    percentage: 88,
    timeTaken: 40,
    completedAt: "2025-06-15T09:30:00Z",
    status: "completed",
    attemptCount: 1,
    correctAnswers: 17,
    wrongAnswers: 2,
    unansweredQuestions: 1,
    submittedAt: "2025-06-15T09:30:00Z",
  },
  {
    studentId: "7",
    studentName: "Grace Lee",
    rollNumber: "CS2021007",
    score: 73,
    maxScore: 100,
    percentage: 73,
    timeTaken: 48,
    completedAt: "2025-06-15T11:45:00Z",
    status: "completed",
    attemptCount: 1,
    correctAnswers: 14,
    wrongAnswers: 4,
    unansweredQuestions: 2,
    submittedAt: "2025-06-15T11:45:00Z",
  },
  {
    studentId: "8",
    studentName: "Henry Chen",
    rollNumber: "CS2021008",
    score: 91,
    maxScore: 100,
    percentage: 91,
    timeTaken: 35,
    completedAt: "2025-06-15T08:45:00Z",
    status: "completed",
    attemptCount: 1,
    correctAnswers: 18,
    wrongAnswers: 1,
    unansweredQuestions: 1,
    submittedAt: "2025-06-15T08:45:00Z",
  },
  {
    studentId: "9",
    studentName: "Isabella Rodriguez",
    rollNumber: "CS2021009",
    score: 56,
    maxScore: 100,
    percentage: 56,
    timeTaken: 60,
    completedAt: "2025-06-15T13:30:00Z",
    status: "completed",
    attemptCount: 3,
    correctAnswers: 11,
    wrongAnswers: 7,
    unansweredQuestions: 2,
    submittedAt: "2025-06-15T13:30:00Z",
  },
  {
    studentId: "10",
    studentName: "Jack Thompson",
    rollNumber: "CS2021010",
    score: 82,
    maxScore: 100,
    percentage: 82,
    timeTaken: 44,
    completedAt: "2025-06-15T10:15:00Z",
    status: "completed",
    attemptCount: 1,
    correctAnswers: 16,
    wrongAnswers: 3,
    unansweredQuestions: 1,
    submittedAt: "2025-06-15T10:15:00Z",
  },
];

export function StudentResultsTable({
  onViewStudentResult,
}: StudentResultsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
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
  const sortedAndFilteredResults = useMemo(() => {
    const filtered = mockStudentResults.filter(
      (student) =>
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case "studentName":
          aValue = a.studentName.toLowerCase();
          bValue = b.studentName.toLowerCase();
          break;
        case "rollNumber":
          aValue = a.rollNumber.toLowerCase();
          bValue = b.rollNumber.toLowerCase();
          break;
        case "score":
          aValue = a.score;
          bValue = b.score;
          break;
        case "percentage":
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        case "correctAnswers":
          aValue = a.correctAnswers || 0;
          bValue = b.correctAnswers || 0;
          break;
        case "wrongAnswers":
          aValue = a.wrongAnswers || 0;
          bValue = b.wrongAnswers || 0;
          break;
        case "unansweredQuestions":
          aValue = a.unansweredQuestions || 0;
          bValue = b.unansweredQuestions || 0;
          break;
        case "submittedAt":
          aValue = new Date(a.submittedAt || a.completedAt);
          bValue = new Date(b.submittedAt || b.completedAt);
          break;
        default:
          aValue = a.score;
          bValue = b.score;
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
  const handleRowClick = (student: StudentTestResult) => {
    if (onViewStudentResult) {
      onViewStudentResult(student.studentId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Student Results ({sortedAndFilteredResults.length} students)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center border rounded-md px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("studentName")}
                    >
                      Student Name
                      {getSortIcon("studentName")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("rollNumber")}
                    >
                      Roll Number
                      {getSortIcon("rollNumber")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("score")}
                    >
                      Score
                      {getSortIcon("score")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("correctAnswers")}
                    >
                      Correct
                      {getSortIcon("correctAnswers")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("wrongAnswers")}
                    >
                      Wrong
                      {getSortIcon("wrongAnswers")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("unansweredQuestions")}
                    >
                      Unanswered
                      {getSortIcon("unansweredQuestions")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                      onClick={() => handleSort("submittedAt")}
                    >
                      Submitted At
                      {getSortIcon("submittedAt")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredResults.map((result) => (
                  <TableRow
                    key={result.studentId}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(result)}
                  >
                    <TableCell className="font-medium">
                      {result.studentName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {result.rollNumber || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-semibold">
                          {result.score} / {result.maxScore}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm font-semibold">
                        {result.correctAnswers || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm font-semibold">
                        {result.wrongAnswers || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-sm font-semibold">
                        {result.unansweredQuestions || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatRelative(
                            new Date(result.submittedAt || result.completedAt),
                            new Date(),
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(
                            result.submittedAt || result.completedAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {result.status === "completed" ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                        >
                          Completed
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                        >
                          {result.status}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {sortedAndFilteredResults.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchQuery
                        ? "No students found matching your search."
                        : "No student results available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {sortedAndFilteredResults.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              Click on any row to view detailed student answers
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
