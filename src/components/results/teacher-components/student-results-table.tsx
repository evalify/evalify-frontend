"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedTestStatistics } from "../teacher-types";
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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StudentResultsTableProps {
  statistics: DetailedTestStatistics;
  onViewStudentResult?: (studentId: string, testId: string) => void;
}

export function StudentResultsTable({ statistics }: StudentResultsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = statistics.studentResults.filter((student) =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center border rounded-md px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Time Taken</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-center">Attempts</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.studentId}>
                    <TableCell>{result.studentName}</TableCell>
                    <TableCell className="text-center">
                      {result.score} / {result.maxScore}
                      <p className="text-xs text-muted-foreground">
                        {result.percentage.toFixed(1)}%
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      {result.timeTaken} min
                    </TableCell>
                    <TableCell>
                      {formatRelative(new Date(result.completedAt), new Date())}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.attemptCount}
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
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
