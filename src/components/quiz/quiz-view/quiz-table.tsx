"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Eye,
  Copy,
  Trash2,
  Settings,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  XCircle,
  FileText,
  Globe,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

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

interface QuizTableProps {
  quizzes: Quiz[];
  onEdit?: (quizId: string) => void;
  onView?: (quizId: string) => void;
  onDuplicate?: (quizId: string) => void;
  onDelete?: (quizId: string) => void;
  onManage?: (quizId: string) => void;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const statusConfig = {
  DRAFT: {
    color: "bg-gray-500",
    textColor: "text-gray-700 bg-gray-50 border-gray-200",
    icon: FileText,
    label: "Draft",
  },
  SCHEDULED: {
    color: "bg-blue-500",
    textColor: "text-blue-700 bg-blue-50 border-blue-200",
    icon: Calendar,
    label: "Scheduled",
  },
  ACTIVE: {
    color: "bg-green-500",
    textColor: "text-green-700 bg-green-50 border-green-200",
    icon: PlayCircle,
    label: "Active",
  },
  PAUSED: {
    color: "bg-yellow-500",
    textColor: "text-yellow-700 bg-yellow-50 border-yellow-200",
    icon: PauseCircle,
    label: "Paused",
  },
  COMPLETED: {
    color: "bg-purple-500",
    textColor: "text-purple-700 bg-purple-50 border-purple-200",
    icon: CheckCircle,
    label: "Completed",
  },
  CANCELLED: {
    color: "bg-red-500",
    textColor: "text-red-700 bg-red-50 border-red-200",
    icon: XCircle,
    label: "Cancelled",
  },
};

export function QuizTable({
  quizzes,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
  onManage,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
}: QuizTableProps) {
  const formatDuration = (nanoseconds: number) => {
    const seconds = Math.floor(nanoseconds / 1000000000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getColumns = (): ColumnDef<Quiz>[] => [
    {
      accessorKey: "name",
      header: "Quiz Name",
      cell: ({ row }) => {
        const quiz = row.original;
        return (
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium truncate">{quiz.name}</span>
              {quiz.isProtected && (
                <Lock className="h-3 w-3 text-amber-600 flex-shrink-0" />
              )}
              {quiz.publishResult && (
                <Globe className="h-3 w-3 text-green-600 flex-shrink-0" />
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.DRAFT;
        const StatusIcon = config.icon;

        return (
          <Badge className={cn("gap-1.5", config.textColor)}>
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "courseCodes",
      header: "Courses",
      cell: ({ getValue }) => {
        const codes = getValue() as string[];
        if (codes.length === 0) return <span className="text-gray-400">-</span>;

        return (
          <div className="flex flex-wrap gap-1">
            {codes.slice(0, 2).map((code) => (
              <Badge key={code} variant="outline" className="text-xs">
                {code}
              </Badge>
            ))}
            {codes.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{codes.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
      cell: ({ getValue }) => {
        const startTime = getValue() as string;
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-3 w-3 text-blue-500" />
            {format(new Date(startTime), "MMM dd, HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ getValue }) => {
        const duration = getValue() as number;
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className="h-3 w-3 text-green-500" />
            {formatDuration(duration)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const quiz = row.original;
        const isActive = quiz.status === "ACTIVE";
        const isCompleted = quiz.status === "COMPLETED";
        const isScheduled = new Date(quiz.startTime) > new Date();

        return (
          <div className="flex items-center gap-1">
            {/* Quick action buttons */}
            {isScheduled && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => onEdit?.(quiz.id)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}

            {isActive && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                onClick={() => onManage?.(quiz.id)}
              >
                <Settings className="h-3 w-3" />
              </Button>
            )}

            {isCompleted && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => onView?.(quiz.id)}
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}

            {/* More actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView?.(quiz.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(quiz.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Quiz
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onManage?.(quiz.id)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDuplicate?.(quiz.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(quiz.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Mock fetch function for DataTable
  const fetchData = async () => {
    return {
      success: true,
      data: quizzes,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total_pages: totalPages,
        total_items: totalItems,
      },
    };
  };

  const exportConfig = {
    entityName: "Quiz",
    columnMapping: {
      name: "Quiz Name",
      status: "Status",
      courseCodes: "Course Codes",
      startTime: "Start Time",
      duration: "Duration",
    },
    columnWidths: [
      { wch: 25 }, // name
      { wch: 12 }, // status
      { wch: 15 }, // courseCodes
      { wch: 18 }, // startTime
      { wch: 12 }, // duration
    ],
    headers: ["Quiz Name", "Status", "Course Codes", "Start Time", "Duration"],
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No quizzes found
            </h3>
            <p className="text-gray-500 dark:text-gray-200">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      getColumns={getColumns}
      fetchDataFn={fetchData}
      exportConfig={exportConfig}
      idField="id"
      config={{
        enableRowSelection: false,
        enableToolbar: false,
        enablePagination: true,
        enableColumnResizing: true,
        size: "sm",
      }}
      onRowClick={(quiz) => onView?.(quiz.id)}
    />
  );
}
