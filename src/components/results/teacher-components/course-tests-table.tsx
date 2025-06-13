"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestOverview } from "../teacher-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CourseTestsTableProps {
  tests: TestOverview[];
  onViewTest: (testId: string) => void;
}

export function CourseTestsTable({ tests, onViewTest }: CourseTestsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = tests.filter((test) =>
    test.testName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tests</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            No tests found for this course
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center border rounded-md px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead className="text-center">Submissions</TableHead>
                  <TableHead className="text-center">Avg. Score</TableHead>
                  <TableHead className="text-center">High Score</TableHead>
                  <TableHead className="text-center">Duration</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.testId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{test.testName}</p>
                        <p className="text-xs text-muted-foreground">
                          Created{" "}
                          {formatDistanceToNow(new Date(test.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <p>{test.totalSubmissions}</p>
                      <p className="text-xs text-muted-foreground">
                        {test.completionRate}% Completion
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <p>{test.averageScore.toFixed(1)}%</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <p>{test.highestScore}%</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <p>{test.duration} min</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewTest(test.testId)}
                        className="h-8 gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
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
