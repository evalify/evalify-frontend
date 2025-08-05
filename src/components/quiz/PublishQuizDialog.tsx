"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Globe, Lock, AlertTriangle, CheckCircle } from "lucide-react";

interface PublishQuizDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  isPublished: boolean;
  quizName: string;
}

export function PublishQuizDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
  isPublished,
  quizName,
}: PublishQuizDialogProps) {
  const [hasReadWarning, setHasReadWarning] = useState(false);

  const handleClose = () => {
    setHasReadWarning(false);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    setHasReadWarning(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isPublished ? (
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            ) : (
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <DialogTitle className="text-left">
                {isPublished ? "Unpublish Quiz" : "Publish Quiz"}
              </DialogTitle>
              <DialogDescription className="text-left">
                {isPublished
                  ? "Make this quiz unavailable to students"
                  : "Make this quiz available to students"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Quiz: {quizName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isPublished
                ? "Currently published and visible to students"
                : "Currently unpublished and hidden from students"}
            </p>
          </div>

          {isPublished ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Unpublishing this quiz will:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Hide the quiz from all students</li>
                  <li>• Allow you to edit quiz settings and questions again</li>
                  <li>• Preserve any existing student responses</li>
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Publishing this quiz will:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Make the quiz visible to assigned students</li>
                  <li>• Lock the quiz from further editing</li>
                  <li>• Enable students to take the quiz based on schedule</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {!isPublished && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Once published, you will not be able
                to edit the quiz settings or questions until you unpublish it.
                Please review your quiz carefully before publishing.
              </AlertDescription>
            </Alert>
          )}

          {!isPublished && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <input
                type="checkbox"
                id="readWarning"
                checked={hasReadWarning}
                onChange={(e) => setHasReadWarning(e.target.checked)}
                className="mt-1"
              />
              <label
                htmlFor="readWarning"
                className="text-sm text-amber-800 dark:text-amber-200 cursor-pointer"
              >
                I understand that publishing this quiz will lock it from editing
                and make it available to students according to the scheduled
                time.
              </label>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || (!isPublished && !hasReadWarning)}
            variant={isPublished ? "destructive" : "default"}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPublished ? "Unpublish Quiz" : "Publish Quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
