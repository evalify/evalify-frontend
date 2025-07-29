"use client";

import { Card } from "@/components/ui/card";
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
  MoreVertical,
  Edit,
  Eye,
  Copy,
  Trash2,
  FileText,
  Settings,
  PauseCircle,
  CheckCircle,
  XCircle,
  Globe,
  Lock,
  BookOpen,
  Timer,
  Activity,
  Zap,
  Share,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: {
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
  };
  onEdit?: (quizId: string) => void;
  onView?: (quizId: string) => void;
  onDuplicate?: (quizId: string) => void;
  onDelete?: (quizId: string) => void;
  onManage?: (quizId: string) => void;
  onShare?: (quizId: string) => void;
  isShared?: boolean;
}

const statusConfig = {
  DRAFT: {
    color: "bg-slate-500 dark:bg-slate-400",
    textColor: "text-slate-700 dark:text-slate-200",
    bgColor:
      "bg-slate-50/80 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-700/60",
    icon: FileText,
    label: "Draft",
    iconBg: "bg-slate-100/80 dark:bg-slate-800/50",
    iconColor: "text-slate-600 dark:text-slate-300",
    dotColor: "bg-slate-400 dark:bg-slate-500",
  },
  SCHEDULED: {
    color: "bg-blue-500 dark:bg-blue-400",
    textColor: "text-blue-700 dark:text-blue-200",
    bgColor:
      "bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-800/60",
    icon: Calendar,
    label: "Scheduled",
    iconBg: "bg-blue-100/80 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-300",
    dotColor: "bg-blue-500 dark:bg-blue-400",
  },
  ACTIVE: {
    color: "bg-emerald-500 dark:bg-emerald-400",
    textColor: "text-emerald-700 dark:text-emerald-200",
    bgColor:
      "bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-800/60",
    icon: Activity,
    label: "Live",
    iconBg: "bg-emerald-100/80 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-300",
    dotColor: "bg-emerald-500 dark:bg-emerald-400",
  },
  PAUSED: {
    color: "bg-amber-500 dark:bg-amber-400",
    textColor: "text-amber-700 dark:text-amber-200",
    bgColor:
      "bg-amber-50/80 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-800/60",
    icon: PauseCircle,
    label: "Paused",
    iconBg: "bg-amber-100/80 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-300",
    dotColor: "bg-amber-500 dark:bg-amber-400",
  },
  COMPLETED: {
    color: "bg-violet-500 dark:bg-violet-400",
    textColor: "text-violet-700 dark:text-violet-200",
    bgColor:
      "bg-violet-50/80 dark:bg-violet-900/20 border-violet-200/60 dark:border-violet-800/60",
    icon: CheckCircle,
    label: "Completed",
    iconBg: "bg-violet-100/80 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-300",
    dotColor: "bg-violet-500 dark:bg-violet-400",
  },
  CANCELLED: {
    color: "bg-red-500 dark:bg-red-400",
    textColor: "text-red-700 dark:text-red-200",
    bgColor:
      "bg-red-50/80 dark:bg-red-900/20 border-red-200/60 dark:border-red-800/60",
    icon: XCircle,
    label: "Cancelled",
    iconBg: "bg-red-100/80 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-300",
    dotColor: "bg-red-500 dark:bg-red-400",
  },
};

export function QuizCard({
  quiz,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
  onManage,
  onShare,
  isShared = false,
}: QuizCardProps) {
  const currentStatus =
    statusConfig[quiz.status as keyof typeof statusConfig] ||
    statusConfig.DRAFT;
  const StatusIcon = currentStatus.icon;

  const formatDuration = (nanoseconds: number) => {
    const seconds = Math.floor(nanoseconds / 1000000000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const isActive = quiz.status === "ACTIVE";
  const isCompleted = quiz.status === "COMPLETED";
  const isScheduled = new Date(quiz.startTime) > new Date();
  const isLive = quiz.status === "ACTIVE";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-z-2",
        "  backdrop-blur-sm border ",
      )}
    >
      {/* Header Section */}
      <div className="relative p-6 pb-4">
        {/* Live Pulse Animation */}
        {isLive && (
          <div className="absolute -top-1 -right-1 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 dark:bg-red-400 rounded-full animate-ping" />
              <div className="relative w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full" />
            </div>
          </div>
        )}

        {/* Top Row: Status and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Status Icon */}
            <div
              className={cn("relative p-2.5 rounded-xl", currentStatus.iconBg)}
            >
              <StatusIcon className={cn("h-5 w-5", currentStatus.iconColor)} />
              {isLive && (
                <div
                  className={cn(
                    "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse",
                    currentStatus.dotColor,
                  )}
                />
              )}
            </div>

            {/* Status Badge */}
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-semibold px-3 py-1",
                currentStatus.bgColor,
                currentStatus.textColor,
              )}
            >
              {currentStatus.label}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Security Indicators */}
            <div className="flex items-center gap-1.5">
              {quiz.isProtected && (
                <div className="group/tooltip relative">
                  <div className="p-1.5 rounded-lg bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200/60 dark:border-amber-800/60">
                    <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs py-1.5 px-2.5 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 font-medium">
                    Password Protected
                  </div>
                </div>
              )}

              {quiz.publishResult && (
                <div className="group/tooltip relative">
                  <div className="p-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/60">
                    <Globe className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs py-1.5 px-2.5 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 font-medium">
                    Results Published
                  </div>
                </div>
              )}
            </div>

            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-60 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                >
                  <MoreVertical className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {!isShared && (
                  <DropdownMenuItem onClick={() => onEdit?.(quiz.id)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Quiz
                  </DropdownMenuItem>
                )}
                {!isShared && (
                  <DropdownMenuItem onClick={() => onManage?.(quiz.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    View Questions
                  </DropdownMenuItem>
                )}
                {!isShared && (
                  <DropdownMenuItem onClick={() => onShare?.(quiz.id)}>
                    <Share className="h-4 w-4 mr-2" />
                    Share Quiz
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onView?.(quiz.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Results
                </DropdownMenuItem>
                {!isShared && <DropdownMenuSeparator />}
                {!isShared && (
                  <DropdownMenuItem
                    onClick={() => onDuplicate?.(quiz.id)}
                    disabled
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                {!isShared && <DropdownMenuSeparator />}
                {!isShared && (
                  <DropdownMenuItem
                    onClick={() => onDelete?.(quiz.id)}
                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quiz Title */}
        <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-3">
          {quiz.name}
        </h3>

        {/* Description */}
        {quiz.description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
            {quiz.description}
          </p>
        )}

        {/* Course Codes */}
        {quiz.courseCodes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {quiz.courseCodes.slice(0, 2).map((code) => (
              <div
                key={code}
                className="inline-flex items-center gap-1.5 bg-neutral-100/80 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 rounded-lg px-2.5 py-1.5"
              >
                <BookOpen className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {code}
                </span>
              </div>
            ))}
            {quiz.courseCodes.length > 2 && (
              <div className="inline-flex items-center bg-neutral-200/80 dark:bg-neutral-700/50 border border-neutral-300/60 dark:border-neutral-600/60 rounded-lg px-2.5 py-1.5">
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  +{quiz.courseCodes.length - 2}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Section with Grid Layout */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Start Time */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200/40 dark:border-blue-800/40">
            <div className="p-2 bg-blue-500/10 dark:bg-blue-400/20 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider">
                Start
              </p>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 truncate">
                {format(new Date(quiz.startTime), "MMM dd")}
              </p>
              <p className="text-xs text-blue-700/70 dark:text-blue-300/70">
                {format(new Date(quiz.startTime), "h:mm a")}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200/40 dark:border-emerald-800/40">
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-400/20 rounded-lg">
              <Timer className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider">
                Duration
              </p>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                {formatDuration(quiz.duration)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {(isActive || !isScheduled || !isCompleted || !isActive) && (
            <Button
              size="sm"
              className="flex-1 dark:bg-slate-800 dark:text-white font-medium shadow-lg hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 transition-shadow"
              onClick={() => onManage?.(quiz.id)}
            >
              <Zap className="h-3.5 w-3.5 mr-2" />
              View Questions
            </Button>
          )}

          {isCompleted && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 font-medium"
              onClick={() => onView?.(quiz.id)}
            >
              <Eye className="h-3.5 w-3.5 mr-2" />
              Results
            </Button>
          )}

          {!isShared && (
            <Button
              size="sm"
              variant="ghost"
              className="px-3"
              onClick={() => onEdit?.(quiz.id)}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
