"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, X, AlertCircle } from "lucide-react";
import { IQuestionRenderer } from "../interfaces/quiz-interfaces";
import { FileUploadQuestion } from "../types/quiz-types";

interface FileUploadRendererProps {
  question: FileUploadQuestion;
  answer: string | undefined; // File URL string
  onAnswerChange: (answer: string) => void;
  isReadOnly?: boolean;
}

interface StoredFileInfo {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export class FileUploadRenderer implements IQuestionRenderer {
  render(
    question: FileUploadQuestion,
    answer: string | undefined,
    onAnswerChange: (answer: string) => void,
    isReadOnly: boolean = false,
  ): React.ReactElement {
    return (
      <FileUploadRendererComponent
        question={question}
        answer={answer}
        onAnswerChange={onAnswerChange}
        isReadOnly={isReadOnly}
      />
    );
  }
}

const FileUploadRendererComponent: React.FC<FileUploadRendererProps> = ({
  question,
  answer,
  onAnswerChange,
  isReadOnly = false,
}) => {
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [fileInfo, setFileInfo] = React.useState<StoredFileInfo | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load file info from localStorage when component mounts or answer changes
  React.useEffect(() => {
    if (answer) {
      const storedInfo = localStorage.getItem(
        `file_info_${question.questionId}`,
      );
      if (storedInfo) {
        try {
          setFileInfo(JSON.parse(storedInfo));
        } catch {
          setFileInfo(null);
        }
      }
    } else {
      setFileInfo(null);
    }
  }, [answer, question.questionId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    setUploadError(null);

    // Basic file size validation (10MB limit)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSizeInBytes) {
      setUploadError("File size exceeds 10MB limit");
      return;
    }

    // Create file info object for storage
    const newFileInfo: StoredFileInfo = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      uploadedAt: new Date().toISOString(),
    };

    // In a real implementation, you would upload the file to a server
    // For now, we'll create a temporary URL and store it
    const fileUrl = URL.createObjectURL(selectedFile);

    // Store file info in localStorage
    localStorage.setItem(
      `file_info_${question.questionId}`,
      JSON.stringify(newFileInfo),
    );
    setFileInfo(newFileInfo);

    // Pass the file URL as the answer (string)
    onAnswerChange(fileUrl);
  };

  const handleRemoveFile = () => {
    if (answer) {
      // Clean up the object URL
      try {
        URL.revokeObjectURL(answer);
      } catch {
        // URL might not be a blob URL
      }
    }

    // Clear file info from localStorage
    localStorage.removeItem(`file_info_${question.questionId}`);
    setFileInfo(null);

    // Clear the answer
    onAnswerChange("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
          <Badge variant="secondary" className="text-xs">
            {question.marks} {question.marks === 1 ? "Mark" : "Marks"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Text */}
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: question.question }}
        />

        {/* Hint */}
        {question.hint && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Hint:</strong> {question.hint}
            </AlertDescription>
          </Alert>
        )}

        {/* File Requirements */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Maximum file size:</span>
            <Badge variant="outline" className="text-xs">
              10MB
            </Badge>
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          {!fileInfo ? (
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-2 transition-colors ${
                !isReadOnly
                  ? "hover:border-primary cursor-pointer"
                  : "opacity-50"
              }`}
              onClick={!isReadOnly ? handleUploadClick : undefined}
            >
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {isReadOnly ? "No file uploaded" : "Click to upload file"}
                </p>
                {!isReadOnly && (
                  <p className="text-xs text-muted-foreground">
                    or drag and drop your file here
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{fileInfo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileInfo.size)} • {fileInfo.type}
                    </p>
                  </div>
                </div>
                {!isReadOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Uploaded: {new Date(fileInfo.uploadedAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isReadOnly}
          />

          {/* Upload button for mobile/accessibility */}
          {!isReadOnly && !fileInfo && (
            <Button
              onClick={handleUploadClick}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          )}
        </div>

        {/* Error Display */}
        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadRenderer;
