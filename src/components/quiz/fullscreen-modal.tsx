"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize, AlertTriangle } from "lucide-react";

// Simple Alert component for this modal
const Alert = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`rounded-lg border p-4 ${className}`}>{children}</div>;

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

interface FullScreenModalProps {
  isOpen: boolean;
  onRequestFullScreen: () => Promise<void>;
  isFullScreenSupported: boolean;
  onDismiss?: () => void;
  isRequired?: boolean; // New prop to indicate if full-screen is required
}

export function FullScreenModal({
  isOpen,
  onRequestFullScreen,
  isFullScreenSupported,
  onDismiss,
  isRequired = false, // Default to false for backward compatibility
}: FullScreenModalProps) {
  useEffect(() => {
    // Prevent background scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isFullScreenSupported) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Full-Screen Not Supported
            </DialogTitle>
            <DialogDescription>
              Your browser does not support full-screen mode. Please use a
              modern browser to take this quiz.
            </DialogDescription>
          </DialogHeader>
          <Alert className="mt-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <AlertDescription>
                Supported browsers: Chrome, Firefox, Safari, Edge (latest
                versions)
              </AlertDescription>
            </div>
          </Alert>
          {onDismiss && !isRequired && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={onDismiss}>
                Continue Anyway
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Maximize className="h-5 w-5 text-primary" />
            Full-Screen Required
          </DialogTitle>
          <DialogDescription>
            This quiz requires full-screen mode for security and focus. Please
            enter full-screen mode to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <AlertDescription>
                <strong>Security Notice:</strong> Exiting full-screen mode or
                attempting to copy content will be tracked as violations.
              </AlertDescription>
            </div>
          </Alert>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>While in full-screen mode:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You cannot switch tabs or applications</li>
              <li>Copy/paste operations are blocked</li>
              <li>Right-click context menu is disabled</li>
              <li>All interactions are monitored</li>
            </ul>
          </div>
          <div className="flex justify-end gap-2">
            {onDismiss && !isRequired && (
              <Button variant="outline" onClick={onDismiss}>
                Continue Anyway
              </Button>
            )}
            <Button
              onClick={onRequestFullScreen}
              className="flex items-center gap-2"
            >
              <Maximize className="h-4 w-4" />
              Enter Full-Screen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
