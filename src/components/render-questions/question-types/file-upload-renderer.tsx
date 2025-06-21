import React from "react";
import { FileUploadQuestion, QuestionConfig, FileUploadAnswer } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { cn } from "@/lib/utils";
import { Upload, File, X, FileCheck, AlertCircle } from "lucide-react";

interface FileUploadRendererProps {
  question: FileUploadQuestion;
  config: QuestionConfig;
  onAnswerChange?: (answer: FileUploadAnswer) => void;
}

export const FileUploadRenderer: React.FC<FileUploadRendererProps> = ({
  question,
  config,
  onAnswerChange,
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    if (config.readOnly) return;

    const newFiles = Array.from(fileList);
    setFiles(newFiles);

    if (onAnswerChange) {
      onAnswerChange({ files: newFiles });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    if (config.readOnly) return;

    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    if (onAnswerChange) {
      onAnswerChange({ files: newFiles });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Load user answers if available
  React.useEffect(() => {
    if (config.userAnswers && "files" in config.userAnswers) {
      setFiles(config.userAnswers.files);
    }
  }, [config.userAnswers]);

  return (
    <div className="space-y-4">
      {/* Guidelines */}
      {question.guidelines && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Guidelines:
              </p>
              <ContentPreview
                content={question.guidelines}
                className="border-none p-0 bg-transparent text-blue-800 dark:text-blue-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* File upload area */}
      {!config.readOnly && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Drag and drop files or click the button below
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mb-2"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Uploaded files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <File className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Badge variant="outline" className="flex-shrink-0">
                  <FileCheck className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
                {!config.readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expected answer in display mode */}
      {config.showCorrectAnswers && question.expectedAnswer && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Expected File Description:
              </h4>
              <div className="text-sm text-green-800 dark:text-green-200">
                <ContentPreview
                  content={question.expectedAnswer}
                  className="border-none p-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation settings */}
      {!config.compact && question.strictness !== undefined && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Evaluation Strictness: {Math.round(question.strictness * 100)}%
        </div>
      )}
    </div>
  );
};
