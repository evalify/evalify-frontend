"use client";

import { QuizCard } from "./quiz-card";
import { FileText } from "lucide-react";

interface Quiz {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  isProtected: boolean;
  publishResult: boolean;
  courseCodes: string[];
}

interface QuizGridProps {
  quizzes: Quiz[];
  onEdit?: (quizId: string) => void;
  onView?: (quizId: string) => void;
  onDuplicate?: (quizId: string) => void;
  onDelete?: (quizId: string) => void;
  onManage?: (quizId: string) => void;
  onShare?: (quizId: string) => void;
  isLoading?: boolean;
}

export function QuizGrid({
  quizzes,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
  onManage,
  onShare,
  isLoading = false,
}: QuizGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first quiz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onEdit={onEdit}
          onView={onView}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onManage={onManage}
          onShare={onShare}
        />
      ))}
    </div>
  );
}
