"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Eye,
  Copy,
  MousePointer,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Violation } from "@/components/quiz/hooks/use-fullscreen-enforcement";

interface ViolationsTrackerProps {
  violations: Violation[];
  violationCount: number;
  className?: string;
}

const violationIcons = {
  "fullscreen-exit": Eye,
  "copy-attempt": Copy,
  "context-menu": MousePointer,
} as const;

const violationColors = {
  "fullscreen-exit": "destructive" as const,
  "copy-attempt": "secondary" as const,
  "context-menu": "outline" as const,
};

export function ViolationsTracker({
  violations,
  violationCount,
  className,
}: ViolationsTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getViolationSummary = () => {
    const summary = violations.reduce(
      (acc, violation) => {
        acc[violation.type] = (acc[violation.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return summary;
  };

  const summary = getViolationSummary();

  if (violationCount === 0) {
    return (
      <Card className={`border-green-200 dark:border-green-800 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full" />
            Security Status: Clear
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <p className="text-xs text-green-600 dark:text-green-400">
            No violations detected
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-red-200 dark:border-red-800 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Violations: {violationCount}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3 space-y-2">
        {/* Summary badges */}
        <div className="flex flex-wrap gap-1">
          {Object.entries(summary).map(([type, count]) => {
            const Icon = violationIcons[type as keyof typeof violationIcons];
            return (
              <Badge
                key={type}
                variant={violationColors[type as keyof typeof violationColors]}
                className="text-xs px-2 py-1 flex items-center gap-1"
              >
                <Icon className="h-3 w-3" />
                {count}
              </Badge>
            );
          })}
        </div>

        {/* Expandable details */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-xs p-1 h-auto"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>View Details</span>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
          {isExpanded && (
            <div className="space-y-1 mt-2">
              <div className="max-h-24 overflow-y-auto space-y-1">
                {violations.slice(-5).map((violation) => {
                  const Icon = violationIcons[violation.type];
                  return (
                    <div
                      key={violation.id}
                      className="text-xs p-2 bg-muted/30 rounded border flex items-start gap-2"
                    >
                      <Icon className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {violation.description}
                        </div>
                        <div className="text-muted-foreground">
                          {formatTime(violation.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {violations.length > 5 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    ... and {violations.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
