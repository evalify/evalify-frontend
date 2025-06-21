"use client";
import React, { useRef, useState } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/counter";
import {
  Upload,
  FileText,
  Image,
  Archive,
  X,
  Download,
  Edit3,
  Settings,
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileUploadQuestionProps {
  question: string;
  allowedFileTypes: string[];
  maxFileSize: number; // in MB
  maxFiles: number;
  uploadedFiles?: UploadedFile[];
  explanation?: string;
  showExplanation: boolean;
  onQuestionChange: (question: string) => void;
  onAllowedFileTypesChange: (types: string[]) => void;
  onMaxFileSizeChange: (size: number) => void;
  onMaxFilesChange: (count: number) => void;
  onUploadedFilesChange?: (files: UploadedFile[]) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (show: boolean) => void;
}

const fileTypeCategories = {
  documents: {
    label: "Documents",
    icon: FileText,
    types: ["pdf", "doc", "docx", "txt", "rtf", "odt"],
  },
  images: {
    label: "Images",
    icon: Image,
    types: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"],
  },
  archives: {
    label: "Archives",
    icon: Archive,
    types: ["zip", "rar", "7z", "tar", "gz"],
  },
  code: {
    label: "Code Files",
    icon: FileText,
    types: ["js", "ts", "py", "java", "cpp", "c", "html", "css", "sql"],
  },
};

const fileSizeOptions = [
  { value: 1, label: "1 MB" },
  { value: 5, label: "5 MB" },
  { value: 10, label: "10 MB" },
  { value: 25, label: "25 MB" },
  { value: 50, label: "50 MB" },
  { value: 100, label: "100 MB" },
];

const FileUploadQuestion: React.FC<FileUploadQuestionProps> = ({
  question,
  allowedFileTypes,
  maxFileSize,
  maxFiles,
  uploadedFiles = [],
  explanation = "",
  showExplanation,
  onQuestionChange,
  onAllowedFileTypesChange,
  onMaxFileSizeChange,
  onMaxFilesChange,
  onUploadedFilesChange,
  onExplanationChange,
  onShowExplanationChange,
}) => {
  const customTypeInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const addFileType = (type: string) => {
    if (!allowedFileTypes.includes(type)) {
      onAllowedFileTypesChange([...allowedFileTypes, type]);
    }
  };

  const removeFileType = (type: string) => {
    onAllowedFileTypesChange(allowedFileTypes.filter((t) => t !== type));
  };

  const addCategoryTypes = (types: string[]) => {
    const newTypes = types.filter((type) => !allowedFileTypes.includes(type));
    if (newTypes.length > 0) {
      onAllowedFileTypesChange([...allowedFileTypes, ...newTypes]);
    }
  };

  const handleFileUpload = (files: FileList) => {
    if (!onUploadedFilesChange) return;

    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(
          `File "${file.name}" exceeds the maximum size of ${maxFileSize} MB`,
        );
        return;
      }

      // Check file type if restrictions exist
      if (allowedFileTypes.length > 0) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (!fileExtension || !allowedFileTypes.includes(fileExtension)) {
          alert(`File "${file.name}" type is not allowed`);
          return;
        }
      }

      // Check total file count
      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        alert(`Maximum number of files (${maxFiles}) reached`);
        return;
      }

      // Create file URL (in a real app, you'd upload to a server)
      const fileUrl = URL.createObjectURL(file);

      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
      });
    });

    if (newFiles.length > 0) {
      onUploadedFilesChange([...uploadedFiles, ...newFiles]);
    }
  };

  const removeUploadedFile = (fileId: string) => {
    if (!onUploadedFilesChange) return;

    const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
    if (fileToRemove) {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(fileToRemove.url);
    }

    onUploadedFilesChange(uploadedFiles.filter((f) => f.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question}
            onUpdate={onQuestionChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      {/* Question Files Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Question Files (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload files that students can download as part of the question
            (e.g., datasets, templates, reference materials)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">
              Click to upload or drag and drop files here
            </p>
            <p className="text-xs text-muted-foreground">
              Files uploaded here will be available for students to download
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files);
                e.target.value = ""; // Reset input
              }
            }}
          />

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Uploaded Files:</Label>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Download/view file
                          const link = document.createElement("a");
                          link.href = file.url;
                          link.download = file.name;
                          link.click();
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadedFile(file.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {uploadedFiles.length} of {maxFiles} files uploaded
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Upload Configuration
          </CardTitle>
          <div className="flex items-center gap-6">
            {/* File Size Limit */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium whitespace-nowrap">
                Max File Size:
              </Label>
              <Select
                value={maxFileSize.toString()}
                onValueChange={(value) => onMaxFileSizeChange(Number(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fileSizeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Maximum Number of Files */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium whitespace-nowrap">
                Max Files:
              </Label>
              <Counter
                initialValue={maxFiles}
                min={1}
                max={50}
                onChange={onMaxFilesChange}
                className="w-fit"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Type Restrictions */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Allowed File Types</Label>

            {/* Current allowed types */}
            {allowedFileTypes.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Selected Types:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {allowedFileTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      .{type}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeFileType(type)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* File type categories */}
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">
                Quick Add by Category:
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(fileTypeCategories).map(([key, category]) => {
                  const Icon = category.icon;
                  const hasAllTypes = category.types.every((type) =>
                    allowedFileTypes.includes(type),
                  );

                  return (
                    <Button
                      key={key}
                      variant={hasAllTypes ? "default" : "outline"}
                      size="sm"
                      onClick={() => addCategoryTypes(category.types)}
                      className="justify-start gap-2 h-auto p-3"
                      disabled={hasAllTypes}
                    >
                      <Icon className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{category.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {category.types.join(", ")}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Custom file type input */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Add Custom Type:
              </Label>
              <div className="flex gap-2">
                <Input
                  ref={customTypeInputRef}
                  placeholder="e.g., xlsx, ppt, etc."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = customTypeInputRef.current?.value
                        .trim()
                        .toLowerCase();
                      if (value && customTypeInputRef.current) {
                        addFileType(value);
                        customTypeInputRef.current.value = "";
                      }
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const value = customTypeInputRef.current?.value
                      .trim()
                      .toLowerCase();
                    if (value && customTypeInputRef.current) {
                      addFileType(value);
                      customTypeInputRef.current.value = "";
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Area Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/10">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Files</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>Allowed types:</strong>
                {allowedFileTypes.length > 0
                  ? allowedFileTypes.map((type) => `.${type}`).join(", ")
                  : "All file types"}
              </p>
              <p>
                <strong>Maximum file size:</strong> {maxFileSize} MB
              </p>
              <p>
                <strong>Maximum files:</strong> {maxFiles}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Explanation (Optional)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-explanation" className="text-sm">
              Include explanation
            </Label>
            <Switch
              id="show-explanation"
              checked={showExplanation}
              onCheckedChange={onShowExplanationChange}
            />
          </div>
        </CardHeader>
        {showExplanation && (
          <CardContent>
            <TiptapEditor
              initialContent={explanation}
              onUpdate={onExplanationChange}
              className="min-h-[150px]"
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FileUploadQuestion;
