"use client";

import React, { use, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Settings,
  Plus,
  Grid3X3,
  List,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Quiz {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  totalMarks: number;
  duration: number; // in minutes
  sections: number;
  createdAt: string;
  status: "draft" | "published" | "archived";
  participants: number;
  difficulty: "easy" | "medium" | "hard";
}

// Mock data for quizzes
const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "General Knowledge Quiz",
    description:
      "A comprehensive quiz covering various topics including geography, history, and science.",
    totalQuestions: 25,
    totalMarks: 100,
    duration: 60,
    sections: 3,
    createdAt: "2024-01-15",
    status: "published",
    participants: 142,
    difficulty: "medium",
  },
  {
    id: "2",
    title: "Mathematics Fundamentals",
    description:
      "Test your knowledge of basic mathematical concepts and problem-solving skills.",
    totalQuestions: 30,
    totalMarks: 150,
    duration: 90,
    sections: 4,
    createdAt: "2024-01-10",
    status: "published",
    participants: 89,
    difficulty: "hard",
  },
  {
    id: "3",
    title: "Science Quiz",
    description:
      "Explore various scientific concepts from physics, chemistry, and biology.",
    totalQuestions: 20,
    totalMarks: 80,
    duration: 45,
    sections: 2,
    createdAt: "2024-01-20",
    status: "draft",
    participants: 0,
    difficulty: "easy",
  },
  {
    id: "4",
    title: "History and Culture",
    description:
      "Journey through important historical events and cultural milestones.",
    totalQuestions: 35,
    totalMarks: 140,
    duration: 75,
    sections: 5,
    createdAt: "2024-01-12",
    status: "published",
    participants: 67,
    difficulty: "medium",
  },
  {
    id: "5",
    title: "Programming Concepts",
    description:
      "Test your understanding of programming fundamentals and algorithms.",
    totalQuestions: 40,
    totalMarks: 200,
    duration: 120,
    sections: 6,
    createdAt: "2024-01-08",
    status: "archived",
    participants: 234,
    difficulty: "hard",
  },
];

const getStatusColor = (status: Quiz["status"]) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "draft":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getDifficultyColor = (difficulty: Quiz["difficulty"]) => {
  switch (difficulty) {
    case "easy":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "medium":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "hard":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const param = use(params);
  const { courseId } = param;
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);

  const handleManageQuiz = (quizId: string) => {
    router.push(`/course/${courseId}/quiz/${quizId}/manage`);
  };

  const handleCreateQuiz = () => {
    router.push(`/course/${courseId}/quiz/create/manage`);
  };

  const handleSelectQuiz = (quizId: string, checked: boolean) => {
    if (checked) {
      setSelectedQuizzes((prev) => [...prev, quizId]);
    } else {
      setSelectedQuizzes((prev) => prev.filter((id) => id !== quizId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuizzes(mockQuizzes.map((quiz) => quiz.id));
    } else {
      setSelectedQuizzes([]);
    }
  };

  const isAllSelected = selectedQuizzes.length === mockQuizzes.length;
  const isIndeterminate =
    selectedQuizzes.length > 0 && selectedQuizzes.length < mockQuizzes.length;

  const QuizGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockQuizzes.map((quiz) => (
        <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {quiz.title}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(quiz.status)}>
                  {quiz.status}
                </Badge>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {quiz.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{quiz.totalQuestions} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{quiz.duration} mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{quiz.participants} Participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleManageQuiz(quiz.id)}
                className="flex-1"
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const QuizTable = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all quizzes"
                className={
                  isIndeterminate
                    ? "data-[state=checked]:bg-muted data-[state=checked]:border-primary"
                    : ""
                }
              />
            </TableHead>
            <TableHead>Quiz Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockQuizzes.map((quiz) => (
            <TableRow
              key={quiz.id}
              className={selectedQuizzes.includes(quiz.id) ? "bg-muted/50" : ""}
            >
              <TableCell>
                <Checkbox
                  checked={selectedQuizzes.includes(quiz.id)}
                  onCheckedChange={(checked) =>
                    handleSelectQuiz(quiz.id, checked as boolean)
                  }
                  aria-label={`Select ${quiz.title}`}
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{quiz.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {quiz.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(quiz.status)}>
                  {quiz.status}
                </Badge>
              </TableCell>
              <TableCell>{quiz.totalQuestions}</TableCell>
              <TableCell>{quiz.duration} mins</TableCell>
              <TableCell>{quiz.participants}</TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(quiz.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleManageQuiz(quiz.id)}
                  variant="outline"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quiz Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and organize your quizzes
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreateQuiz}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {selectedQuizzes.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedQuizzes.length} quiz
                {selectedQuizzes.length === 1 ? "" : "s"} selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedQuizzes([])}
              >
                Clear Selection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Handle bulk actions here
                  console.log("Bulk action on:", selectedQuizzes);
                }}
              >
                Bulk Actions
              </Button>
            </div>
          </div>
        )}
        {viewMode === "grid" ? <QuizGrid /> : <QuizTable />}
      </div>
    </div>
  );
}
