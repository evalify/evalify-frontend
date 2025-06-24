"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X } from "lucide-react";
import { ValidationError } from "./validation";

interface ValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationError[];
  questionType: string;
}

const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  isOpen,
  onClose,
  errors,
  questionType,
}) => {
  // Group errors by field for better display
  const groupedErrors = errors.reduce(
    (acc, error) => {
      if (!acc[error.field]) {
        acc[error.field] = [];
      }
      acc[error.field].push(error.message);
      return acc;
    },
    {} as Record<string, string[]>,
  );
  // Field display names for better UX
  const fieldDisplayNames: Record<string, string> = {
    question: "Question Text",
    options: "Answer Options",
    language: "Programming Language",
    functionName: "Function Name",
    returnType: "Return Type",
    parameters: "Function Parameters",
    testCases: "Test Cases",
    functionMetadata: "Function Setup",
    matchItems: "Match Items",
    blanks: "Fill-in-the-Blanks",
    correctAnswer: "Correct Answer",
    allowedFileTypes: "Allowed File Types",
    maxFileSize: "Maximum File Size",
    maxFiles: "Maximum Files",
    wordLimit: "Word Limit",
    type: "Question Type",
  };

  const getFieldDisplayName = (field: string): string => {
    return fieldDisplayNames[field] || field;
  };

  const getQuestionTypeDisplayName = (type: string): string => {
    const typeNames: Record<string, string> = {
      mcq: "Multiple Choice Question",
      coding: "Coding Question",
      "match-following": "Match the Following",
      fillup: "Fill in the Blanks",
      descriptive: "Descriptive Question",
      "true-false": "True/False Question",
      "file-upload": "File Upload Question",
    };
    return typeNames[type] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Validation Errors
          </DialogTitle>
          <DialogDescription>
            Please fix the following issues before saving your
            {getQuestionTypeDisplayName(questionType)}:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {Object.entries(groupedErrors).map(([field, messages]) => (
            <Card
              key={field}
              className="border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/10"
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {getFieldDisplayName(field)}
                  </Badge>
                  <div className="flex-1">
                    <ul className="space-y-1.5">
                      {messages.map((message, index) => (
                        <li
                          key={index}
                          className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2"
                        >
                          <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          {message}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {errors.length} error{errors.length !== 1 ? "s" : ""} found
          </p>
          <Button onClick={onClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationErrorModal;
