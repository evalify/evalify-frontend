"use client";

import React from "react";
import { BankSchema } from "@/repo/bank/bank";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Calendar,
  SortAsc,
  SortDesc,
  FileQuestion,
  Hash,
  Database,
} from "lucide-react";

type SortField =
  | "name"
  | "courseCode"
  | "semester"
  | "questions"
  | "topics"
  | "created_at";
type SortOrder = "asc" | "desc";

interface BankTableProps {
  banks: BankSchema[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  getColorForBank: (bankId: string) => string;
}

export function BankTable({
  banks,
  sortField,
  sortOrder,
  onSort,
  getColorForBank,
}: BankTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 dark:bg-muted/20">
            <TableHead
              className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-semibold"
              onClick={() => onSort("courseCode")}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Code
                {sortField === "courseCode" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-semibold"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Bank Name
                {sortField === "name" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-semibold"
              onClick={() => onSort("semester")}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Semester
                {sortField === "semester" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 text-center font-semibold"
              onClick={() => onSort("questions")}
            >
              <div className="flex items-center justify-center gap-2">
                <FileQuestion className="h-4 w-4" />
                Questions
                {sortField === "questions" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 text-center font-semibold"
              onClick={() => onSort("topics")}
            >
              <div className="flex items-center justify-center gap-2">
                <Hash className="h-4 w-4" />
                Topics
                {sortField === "topics" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-semibold"
              onClick={() => onSort("created_at")}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created
                {sortField === "created_at" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banks.map((bank) => (
            <TableRow
              key={bank.id}
              className="hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors"
            >
              <TableCell>
                <div
                  className={`flex h-10 w-20 items-center justify-center rounded-md text-sm font-bold shadow-sm ${getColorForBank(bank.id)}`}
                >
                  {bank.courseCode}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-foreground">{bank.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium">
                  <Calendar className="mr-1 h-3 w-3" />
                  Sem {bank.semester}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">{bank.questions}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">{bank.topics}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatDate(bank.created_at)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
