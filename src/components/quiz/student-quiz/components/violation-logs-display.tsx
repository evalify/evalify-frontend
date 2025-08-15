"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Shield,
  Clock,
  Eye,
  Keyboard,
  MousePointer,
  Copy,
} from "lucide-react";
import { ViolationLog } from "../hooks/use-fullscreen-tracking";

interface ViolationLogsProps {
  violations: ViolationLog[];
  violationCount: number;
}

const getViolationIcon = (type: ViolationLog["type"]) => {
  switch (type) {
    case "TAB_SWITCH":
      return <Eye className="w-4 h-4" />;
    case "FULLSCREEN_EXIT":
      return <Shield className="w-4 h-4" />;
    case "KEYBOARD_SHORTCUT":
      return <Keyboard className="w-4 h-4" />;
    case "COPY_PASTE":
      return <Copy className="w-4 h-4" />;
    case "RIGHT_CLICK":
      return <MousePointer className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: ViolationLog["severity"]) => {
  switch (severity) {
    case "HIGH":
      return "destructive";
    case "MEDIUM":
      return "secondary";
    case "LOW":
      return "outline";
    default:
      return "outline";
  }
};

const ViolationLogsDisplay: React.FC<ViolationLogsProps> = ({
  violations,
  violationCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getViolationTitle = (type: ViolationLog["type"]) => {
    switch (type) {
      case "TAB_SWITCH":
        return "Tab Switch Detected";
      case "FULLSCREEN_EXIT":
        return "Fullscreen Mode Exited";
      case "KEYBOARD_SHORTCUT":
        return "Forbidden Shortcut Used";
      case "COPY_PASTE":
        return "Copy/Paste Attempted";
      case "RIGHT_CLICK":
        return "Context Menu Accessed";
      default:
        return "Security Violation";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`fixed top-4 right-60 z-50 ${
            violationCount > 0
              ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              : ""
          }`}
        >
          <Shield className="w-4 h-4 mr-1" />
          <span className="font-mono text-xs">
            {violationCount > 0 ? violationCount : "0"} Violations
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] sm:w-[500px] p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Monitoring
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Security violations and monitoring events
            </p>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {violations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="font-medium text-green-700 mb-2">All Clear!</h3>
                <p className="text-sm text-muted-foreground">
                  No security violations detected during this quiz session.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {violations
                  .slice()
                  .reverse()
                  .map((violation) => (
                    <div
                      key={violation.id}
                      className="flex gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div
                        className={`flex-shrink-0 mt-0.5 ${
                          violation.severity === "HIGH"
                            ? "text-red-500"
                            : violation.severity === "MEDIUM"
                              ? "text-orange-500"
                              : "text-gray-500"
                        }`}
                      >
                        {getViolationIcon(violation.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">
                            {getViolationTitle(violation.type)}
                          </h4>
                          <Badge
                            variant={
                              getSeverityColor(violation.severity) as
                                | "destructive"
                                | "secondary"
                                | "outline"
                                | "default"
                            }
                            className="text-xs"
                          >
                            {violation.severity}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2">
                          {violation.details}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(violation.timestamp)}</span>
                          <span>•</span>
                          <span>{formatDate(violation.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </ScrollArea>

          {violations.length > 0 && (
            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• All violations are automatically logged and monitored</p>
                <p>• Excessive violations may result in quiz termination</p>
                <p>• Contact support if you believe any logs are in error</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViolationLogsDisplay;
