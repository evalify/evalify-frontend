import React from "react";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Save,
  CircleDot,
  FileInput,
  Network,
  FileText,
  ToggleLeft,
  Code,
  Upload,
} from "lucide-react";
import {
  QuestionType,
  QuestionTypeSelectorProps,
} from "./question-creation-types";

const questionTypes: {
  type: QuestionType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "mcq",
    label: "Multiple Choice",
    icon: <CircleDot className="h-4 w-4" />,
  },
  {
    type: "mmcq",
    label: "Multiple MCQ",
    icon: <CircleDot className="h-4 w-4" />,
  },
  {
    type: "fillup",
    label: "Fill in the Blanks",
    icon: <FileInput className="h-4 w-4" />,
  },
  {
    type: "match-following",
    label: "Match the Following",
    icon: <Network className="h-4 w-4" />,
  },
  {
    type: "descriptive",
    label: "Descriptive",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    type: "true-false",
    label: "True or False",
    icon: <ToggleLeft className="h-4 w-4" />,
  },
  {
    type: "coding",
    label: "Coding Question",
    icon: <Code className="h-4 w-4" />,
  },
  {
    type: "file-upload",
    label: "File Upload",
    icon: <Upload className="h-4 w-4" />,
  },
];

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  onPreview,
  onSave,
  isLoading = false,
  isEdit = false,
  hasChanges = false,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
      {/* Left side - Question types */}
      <div className="flex flex-wrap gap-2">
        {questionTypes.map(({ type, label, icon }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeSelect(type)}
            className="min-w-fit flex items-center gap-2"
            disabled={isEdit}
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>
      {/* Right side - Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onPreview}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button
          onClick={onSave}
          disabled={isLoading || (isEdit && !hasChanges)}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading
            ? isEdit
              ? "Updating..."
              : "Saving..."
            : isEdit
              ? "Update Question"
              : "Save Question"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionTypeSelector;
