"use client";
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface SemesterAlertsProps {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  hasCreateError: boolean;
  hasUpdateError: boolean;
  hasDeleteError: boolean;
}

export function SemesterAlerts({
  isCreating,
  isUpdating,
  isDeleting,
  hasCreateError,
  hasUpdateError,
  hasDeleteError,
}: SemesterAlertsProps) {
  return (
    <>
      {(isCreating || isUpdating || isDeleting) && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            {isCreating && "Creating semester..."}
            {isUpdating && "Updating semester..."}
            {isDeleting && "Deleting semester..."}
          </AlertDescription>
        </Alert>
      )}

      {(hasCreateError || hasUpdateError || hasDeleteError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {hasCreateError && "Failed to create semester"}
            {hasUpdateError && "Failed to update semester"}
            {hasDeleteError && "Failed to delete semester"}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
