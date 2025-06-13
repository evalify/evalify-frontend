"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedTestStatistics } from "../teacher-types";
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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QuestionStatsTableProps {
  statistics: DetailedTestStatistics;
}

export function QuestionStatsTable({ statistics }: QuestionStatsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = statistics.questionStats.filter((question) =>
    question.questionType.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center border rounded-md px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by question type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Q#</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Difficulty</TableHead>
                  <TableHead>Correct %</TableHead>
                  <TableHead className="text-center">Attempted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.questionId}>
                    <TableCell className="text-center font-medium">
                      {question.questionNumber}
                    </TableCell>
                    <TableCell>{question.questionType}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(question.difficulty)}
                      >
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-between mb-1 text-xs">
                        <span>{question.correctPercentage}%</span>
                      </div>
                      <Progress
                        value={question.correctPercentage}
                        className="h-2"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {question.attemptedCount}
                      <p className="text-xs text-muted-foreground">
                        ({question.skippedCount} skipped)
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
