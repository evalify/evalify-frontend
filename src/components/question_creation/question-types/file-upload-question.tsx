"use client";
import React from "react";
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
import { Upload, FileText, Image, Video, Archive, X } from "lucide-react";

interface FileUploadQuestionProps {
  question: string;
  allowedFileTypes: string[];
  maxFileSize: number; // in MB
  maxFiles: number;
  explanation?: string;
  showExplanation: boolean;
  onQuestionChange: (question: string) => void;
  onAllowedFileTypesChange: (types: string[]) => void;
  onMaxFileSizeChange: (size: number) => void;
  onMaxFilesChange: (count: number) => void;
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
  videos: {
    label: "Videos",
    icon: Video,
    types: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
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
  explanation = "",
  showExplanation,
  onQuestionChange,
  onAllowedFileTypesChange,
  onMaxFileSizeChange,
  onMaxFilesChange,
  onExplanationChange,
  onShowExplanationChange,
}) => {
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

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question</CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question}
            onUpdate={onQuestionChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      {/* File Upload Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Configuration</CardTitle>
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
                  placeholder="e.g., xlsx, ppt, etc."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value
                        .trim()
                        .toLowerCase();
                      if (value) {
                        addFileType(value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector(
                      "input",
                    ) as HTMLInputElement;
                    const value = input?.value.trim().toLowerCase();
                    if (value) {
                      addFileType(value);
                      input.value = "";
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          {/* File Size Limit */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Maximum File Size</Label>
            <Select
              value={maxFileSize.toString()}
              onValueChange={(value) => onMaxFileSizeChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select maximum file size" />
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
          </div>{" "}
          {/* Maximum Number of Files */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Maximum Number of Files
            </Label>
            <Counter
              initialValue={maxFiles}
              min={1}
              max={50}
              onChange={onMaxFilesChange}
              className="w-fit"
            />
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
                <strong>Allowed types:</strong>{" "}
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
          <CardTitle className="text-lg">Explanation (Optional)</CardTitle>
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
