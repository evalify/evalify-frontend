"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestOverview } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  Calendar,
  Users,
  BarChart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseTestsTableProps {
  tests: TestOverview[];
  onViewTest: (testId: string) => void;
}

type SortField = "createdAt" | "testName" | "totalSubmissions" | "averageScore";
type SortDirection = "asc" | "desc";

export function CourseTestsTable({ tests, onViewTest }: CourseTestsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc"); // desc = newest first

  // Function to get badge color based on average score
  const getScoreBadgeColor = (score: number): string => {
    if (score >= 90)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (score >= 80)
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (score >= 70)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    if (score >= 60)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default direction
      setSortField(field);
      // Default to desc for dates (newest first), asc for names
      setSortDirection(field === "createdAt" ? "desc" : "asc");
    }
  };

  // Get sorting indicator
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;

    return sortDirection === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 ml-1 inline" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 ml-1 inline" />
    );
  };

  // Filter and sort tests
  const filteredAndSortedTests = [...tests]
    .filter((test) =>
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "createdAt":
          comparison =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "testName":
          comparison = a.testName.localeCompare(b.testName);
          break;
        case "totalSubmissions":
          comparison = a.totalSubmissions - b.totalSubmissions;
          break;
        case "averageScore":
          comparison = a.averageScore - b.averageScore;
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tests</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <BarChart className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No tests found for this course
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tests administered for this course will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tests..."
            className="pl-9 bg-muted/30 border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>{" "}
        <div className="overflow-hidden rounded-md border">
          <Table>
            {/* Prevent extra whitespace inside table components */}
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent w-full justify-start"
                    onClick={() => handleSort("testName")}
                  >
                    Test Name {getSortIcon("testName")}
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent w-full justify-start"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created {getSortIcon("createdAt")}
                  </Button>
                </TableHead>{" "}
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent w-full justify-center"
                    onClick={() => handleSort("totalSubmissions")}
                  >
                    Submissions {getSortIcon("totalSubmissions")}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent w-full justify-center"
                    onClick={() => handleSort("averageScore")}
                  >
                    Avg. Score {getSortIcon("averageScore")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTests.map((test) => {
                const scoreBadgeColor = getScoreBadgeColor(test.averageScore);
                return (
                  <TableRow
                    key={test.testId}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onViewTest(test.testId)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{test.testName}</p>
                        <p className="text-sm text-muted-foreground">
                          {test.courseCode}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {formatDistanceToNow(new Date(test.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </TableCell>{" "}
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-blue-600" />
                          <span className="whitespace-nowrap font-medium">
                            {test.totalSubmissions}
                          </span>
                        </div>{" "}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          of{" "}
                          {Math.round(
                            test.totalSubmissions /
                              (test.completionRate > 0
                                ? test.completionRate / 100
                                : 1),
                          )}{" "}
                          students
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <Badge
                        variant="secondary"
                        className={`${scoreBadgeColor} text-xs px-2 py-0.5`}
                      >
                        {test.averageScore.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>{" "}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
