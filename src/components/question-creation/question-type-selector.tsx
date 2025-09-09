import React from "react";
import { Button } from "@/components/ui/button";
import {
  Save,
  CircleDot,
  FileInput,
  Network,
  FileText,
  ToggleLeft,
  Code,
  Upload,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type QuestionType =
  | "MCQ"
  | "MMCQ"
  | "TRUEFALSE"
  | "FILL_UP"
  | "MATCH_THE_FOLLOWING"
  | "CODING"
  | "file-upload"
  | "DESCRIPTIVE";

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onTypeSelect: (type: QuestionType) => void;
  onSaveAndBack?: () => void;
  onSave?: () => void;
  onSaveAndNew?: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
  hasChanges?: boolean;
  canSave?: boolean;
  className?: string;
}

const questionTypes: {
  type: QuestionType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
    {
      type: "MCQ",
      label: "Multiple Choice",
      icon: <CircleDot className="h-4 w-4" />,
      description: "Single correct answer",
    },
    {
      type: "TRUEFALSE",
      label: "True or False",
      icon: <ToggleLeft className="h-4 w-4" />,
      description: "Binary choice question",
    },
    {
      type: "FILL_UP",
      label: "Fill in Blanks",
      icon: <FileInput className="h-4 w-4" />,
      description: "Complete the sentence",
    },
    {
      type: "MATCH_THE_FOLLOWING",
      label: "Match Following",
      icon: <Network className="h-4 w-4" />,
      description: "Connect related items",
    },
    {
      type: "CODING",
      label: "Coding",
      icon: <Code className="h-4 w-4" />,
      description: "Programming challenge",
    },
    {
      type: "file-upload",
      label: "File Upload",
      icon: <Upload className="h-4 w-4" />,
      description: "Submit a file",
    },
    {
      type: "DESCRIPTIVE",
      label: "Descriptive",
      icon: <FileText className="h-4 w-4" />,
      description: "Long form answer",
    },
  ];

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  onSaveAndBack,
  onSave,
  onSaveAndNew,
  isLoading = false,
  isEdit = false,
  hasChanges = false,
  canSave = true,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10",
        className,
      )}
    >
      {/* Question Type Pills */}
      <div className="flex flex-wrap gap-2">
        {questionTypes.map(({ type, label, icon, description }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeSelect(type)}
            className={cn(
              "min-w-fit flex items-center gap-2 transition-all duration-200 hover:scale-105",
              selectedType === type && "shadow-md ring-2 ring-primary/20",
              isEdit && "cursor-not-allowed opacity-50",
            )}
            disabled={isEdit}
            title={description}
          >
            <span
              className={cn(
                "transition-colors",
                selectedType === type
                  ? "text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {icon}
            </span>
            <span className="font-medium">{label}</span>
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 shrink-0">
        {(onSaveAndBack && !isEdit) && (
          <Button
            variant="outline"
            onClick={onSaveAndBack}
            className="flex items-center gap-2 hover:bg-muted/50"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            Save & Back
          </Button>
        )}

        {(onSaveAndNew) && (
          <Button
            variant="outline"
            onClick={onSaveAndNew}
            disabled={!onSaveAndNew || !canSave || isLoading}
            className={cn(
              "flex items-center gap-2 min-w-[160px]",
              isLoading && "cursor-wait",
            )}
          >
            <Plus
              className={cn(
                "h-4 w-4 transition-transform",
                isLoading && "animate-pulse",
              )}
            />
            <span>
              {isLoading ? "Saving..." : "Save & Create New"}
            </span>
          </Button>
        )}

        <Button
          onClick={onSave}
          disabled={!onSave || !canSave || isLoading || (isEdit && !hasChanges)}
          className={cn(
            "flex items-center gap-2 min-w-[120px]",
            isLoading && "cursor-wait",
          )}
        >
          <Save
            className={cn(
              "h-4 w-4 transition-transform",
              isLoading && "animate-pulse",
            )}
          />
          <span>
            {isLoading
              ? isEdit
                ? "Updating..."
                : "Saving..."
              : isEdit
                ? "Update Question"
                : "Save Question"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default QuestionTypeSelector;
