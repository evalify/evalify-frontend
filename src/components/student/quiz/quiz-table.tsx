"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Lock,
  Timer,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { QuizData } from "../quiz/quiz-card";

interface QuizTableProps {
  quizzes: QuizData[];
  onTakeQuiz?: (quizId: string) => void;
  onViewResults?: (quizId: string) => void;
}

const getStatusConfig = (status: QuizData["status"]) => {
  switch (status) {
    case "LIVE":
      return {
        badge: "bg-green-500 hover:bg-green-600 text-white",
        icon: Play,
      };
    case "UPCOMING":
      return {
        badge: "bg-blue-500 hover:bg-blue-600 text-white",
        icon: Clock,
      };
    case "COMPLETED":
      return {
        badge: "bg-emerald-500 hover:bg-emerald-600 text-white",
        icon: CheckCircle,
      };
    case "MISSED":
      return {
        badge: "bg-red-500 hover:bg-red-600 text-white",
        icon: XCircle,
      };
    default:
      return {
        badge: "bg-gray-500 hover:bg-gray-600 text-white",
        icon: Clock,
      };
  }
};

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / (1000 * 60 * 60 * 1000000));
  const minutes = Math.floor(
    (duration % (1000 * 60 * 60 * 1000000)) / (1000 * 60 * 1000000),
  );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const QuizTable: React.FC<QuizTableProps> = ({
  quizzes,
  onTakeQuiz,
  onViewResults,
}) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Quiz Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead className="text-center">Duration</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Security</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No quizzes found</p>
                <p className="text-sm">
                  Try adjusting your filters or search criteria
                </p>
              </TableCell>
            </TableRow>
          ) : (
            quizzes.map((quiz) => {
              const statusConfig = getStatusConfig(quiz.status);
              const StatusIcon = statusConfig.icon;
              const startDate = new Date(quiz.startTime);
              const endDate = new Date(quiz.endTime);

              const isLive = quiz.status === "LIVE";
              const isCompleted = quiz.status === "COMPLETED";
              const canTakeQuiz = isLive && onTakeQuiz;
              const canViewResults = isCompleted && onViewResults;

              return (
                <TableRow key={quiz.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{quiz.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {quiz.description}
                      </div>
                      {quiz.quizTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {quiz.quizTags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs h-5"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {quiz.quizTags.length > 2 && (
                            <Badge variant="secondary" className="text-xs h-5">
                              +{quiz.quizTags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig.badge}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {quiz.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{format(startDate, "MMM dd, yyyy")}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(startDate, "hh:mm a")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{format(endDate, "MMM dd, yyyy")}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(endDate, "hh:mm a")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Timer className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDuration(quiz.duration)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {quiz.linearQuiz ? "Linear" : "Non-linear"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {quiz.protected ? (
                      <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30">
                          <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          Open
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      {canTakeQuiz && (
                        <Button
                          onClick={() => onTakeQuiz(quiz.id)}
                          size="sm"
                          className="h-8"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Take
                        </Button>
                      )}

                      {canViewResults && (
                        <Button
                          onClick={() => onViewResults(quiz.id)}
                          variant="outline"
                          size="sm"
                          className="h-8"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Results
                        </Button>
                      )}

                      {quiz.status === "UPCOMING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          disabled
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Upcoming
                        </Button>
                      )}

                      {quiz.status === "MISSED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          disabled
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Missed
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuizTable;
