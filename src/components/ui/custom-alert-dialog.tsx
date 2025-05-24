"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CustomAlertDialogProps {
  /** The title of the alert dialog */
  title: string;
  /** The message/description of the alert dialog */
  message: string;
  /** Callback function to be executed when the "Continue" (accept) button is clicked */
  onAccept: () => void;
  /** Optional: The text for the confirm button (defaults to "Continue") */
  confirmButtonText?: string;
  /** Optional: The text for the cancel button (defaults to "Cancel") */
  cancelButtonText?: string;
  /** Optional: A child element that will trigger the dialog (e.g., a Button).
   * If not provided, you will need to control `isOpen` externally or use a ref. */
  children?: React.ReactNode;
  /** Optional: Control the open state of the dialog from outside.
   * If provided, the component will be in controlled mode. */
  isOpen?: boolean;
  /** Optional: Callback for when the open state changes (only for controlled mode). */
  onOpenChange?: (open: boolean) => void;
}

/**
 * A customizable Shadcn Alert Dialog component for confirmations or alerts.
 * It can be used as a trigger-based dialog (by passing `children`)
 * or as a programmatically controlled dialog (by passing `isOpen` and `onOpenChange`).
 */
export function ConfirmationDialog({
  title,
  message,
  onAccept,
  confirmButtonText = "Continue",
  cancelButtonText = "Cancel",
  children,
  isOpen,
  onOpenChange,
}: CustomAlertDialogProps) {
  // If isOpen and onOpenChange are provided, we are in controlled mode
  const isControlled = isOpen !== undefined && onOpenChange !== undefined;

  // Use internal state if not controlled externally
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);

  const handleOpenChange = (open: boolean) => {
    if (isControlled) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const handleAccept = () => {
    onAccept();
    // Close the dialog after accepting, if not externally controlled
    if (!isControlled) {
      setInternalIsOpen(false);
    }
  };

  const currentIsOpen = isControlled ? isOpen : internalIsOpen;

  return (
    <AlertDialog open={currentIsOpen} onOpenChange={handleOpenChange}>
      {/* If children are provided, they will act as the trigger */}
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleOpenChange(false)}>
            {cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept}>
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
