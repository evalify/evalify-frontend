"use client";

import React, { useState, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileUploadQuestion,
  FileUploadAnswer,
  QuestionConfig,
  QuestionActions,
} from "../types";
import { cn } from "@/lib/utils";
import { Upload, File, X } from "lucide-react";

/**
 * Props for FileUploadRenderer component
 */
interface FileUploadRendererProps {
  question: FileUploadQuestion;
  config: QuestionConfig;
  actions?: QuestionActions;
  onAnswerChange?: (answer: FileUploadAnswer) => void;
  questionNumber?: number;
  className?: string;
}

/**
 * File Upload Question Renderer Component
 *
 * Renders file upload questions where students can upload files as their answers.
 * Supports multiple file types and file size validation.
 *
 * Features:
 * - Drag and drop file upload
 * - File type validation
 * - File size validation
 * - Multiple file support
 * - Preview of uploaded files
 * - Expected answer and guidelines display
 *
 * @param question - The file upload question data from backend
 * @param config - Display configuration and mode settings
 * @param actions - Optional action handlers (edit, delete, etc.)
 * @param onAnswerChange - Callback when user answers change
 * @param questionNumber - Optional question number for display
 * @param className - Additional CSS classes
 */
const FileUploadRenderer: React.FC<FileUploadRendererProps> = ({
  question,
  config,
  actions,
  onAnswerChange,
  questionNumber,
  className,
}) => {
  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Format file size for display
   */
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  /**
   * Validate file type
   */
  const isValidFileType = useCallback(
    (file: File): boolean => {
      if (
        !question.allowedFileTypes ||
        question.allowedFileTypes.length === 0
      ) {
        return true; // No restrictions
      }

      const fileExtension = file.name.toLowerCase().split(".").pop();
      return question.allowedFileTypes.some((type) =>
        type.toLowerCase().includes(fileExtension || ""),
      );
    },
    [question.allowedFileTypes],
  );

  /**
   * Validate file size
   */
  const isValidFileSize = useCallback(
    (file: File): boolean => {
      if (!question.maxFileSize) {
        return true; // No size limit
      }
      return file.size <= question.maxFileSize;
    },
    [question.maxFileSize],
  );

  /**
   * Handle file selection/upload
   */
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const validFiles: File[] = [];
      const errors: string[] = [];

      Array.from(files).forEach((file) => {
        if (!isValidFileType(file)) {
          errors.push(`${file.name}: Invalid file type`);
          return;
        }

        if (!isValidFileSize(file)) {
          errors.push(
            `${file.name}: File too large (max ${formatFileSize(question.maxFileSize || 0)})`,
          );
          return;
        }

        validFiles.push(file);
      });

      if (errors.length > 0) {
        // You might want to show these errors using a toast or alert
        console.warn("File upload errors:", errors);
      }

      const newFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(newFiles);

      // Trigger answer change callback
      if (onAnswerChange) {
        const answer: FileUploadAnswer = {
          files: newFiles,
        };
        onAnswerChange(answer);
      }
    },
    [
      uploadedFiles,
      isValidFileType,
      isValidFileSize,
      onAnswerChange,
      question.maxFileSize,
      formatFileSize,
    ],
  );

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles],
  );

  /**
   * Handle drag events
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  /**
   * Handle drop event
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  /**
   * Remove uploaded file
   */
  const removeFile = useCallback(
    (index: number) => {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);

      // Trigger answer change callback
      if (onAnswerChange) {
        const answer: FileUploadAnswer = {
          files: newFiles,
        };
        onAnswerChange(answer);
      }
    },
    [uploadedFiles, onAnswerChange],
  );

  /**
   * Open file selector
   */
  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={cn("file-upload-question space-y-4", className)}>
      {/* Question Text */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {questionNumber && (
            <span className="text-sm font-medium text-gray-600 mr-2">
              Q{questionNumber}.
            </span>
          )}
          <div className="text-base leading-relaxed">{question.question}</div>
        </div>

        {/* Marks Display */}
        {config.showMarks && (
          <Badge variant="secondary" className="ml-2">
            {question.marks} mark{question.marks !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* File Upload Area */}
      {config.mode === "student" && !config.readOnly && (
        <div className="space-y-4">
          {/* Upload Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileSelector}
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or click to select files
            </p>

            {/* File Restrictions */}
            <div className="text-xs text-gray-500 space-y-1">
              {question.allowedFileTypes &&
                question.allowedFileTypes.length > 0 && (
                  <p>Allowed types: {question.allowedFileTypes.join(", ")}</p>
                )}
              {question.maxFileSize && (
                <p>Max file size: {formatFileSize(question.maxFileSize)}</p>
              )}
            </div>
          </div>

          {/* Hidden File Input */}
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept={question.allowedFileTypes?.join(",") || undefined}
          />
        </div>
      )}

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
              >
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({formatFileSize(file.size)})
                  </span>
                </div>

                {config.mode === "student" && !config.readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="space-y-2">
        {/* Hint */}
        {config.showHint && question.hint && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            <strong>Hint:</strong> {question.hint}
          </div>
        )}

        {/* Guidelines */}
        {question.guidelines && (
          <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded">
            <strong>Guidelines:</strong> {question.guidelines}
          </div>
        )}

        {/* Expected Answer (in display/review mode) */}
        {config.mode !== "student" && question.expectedAnswer && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
            <strong>Expected Answer:</strong> {question.expectedAnswer}
          </div>
        )}

        {/* Topics */}
        {config.showTopics && question.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {question.topics.map((topic) => (
              <Badge key={topic.id} variant="outline" className="text-xs">
                {topic.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Difficulty and Bloom's Taxonomy */}
        {(config.showDifficulty || config.showBloomsTaxonomy) && (
          <div className="flex gap-2">
            {config.showDifficulty && (
              <Badge variant="secondary" className="text-xs">
                {question.difficulty}
              </Badge>
            )}
            {config.showBloomsTaxonomy && (
              <Badge variant="secondary" className="text-xs">
                {question.bloomsTaxonomy}
              </Badge>
            )}
          </div>
        )}

        {/* Explanation */}
        {config.showExplanation && question.explanation && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
            <strong>Explanation:</strong> {question.explanation}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {config.showActions && actions && (
        <div className="flex gap-2 pt-2 border-t">
          {actions.onEdit && (
            <button
              onClick={() => actions.onEdit!(question.questionId)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          )}
          {actions.onDelete && (
            <button
              onClick={() => actions.onDelete!(question.questionId)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadRenderer;
