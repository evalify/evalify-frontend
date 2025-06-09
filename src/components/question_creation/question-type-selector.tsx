import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Save } from "lucide-react";

export type QuestionType =
  | "mcq"
  | "fillup"
  | "match-following"
  | "descriptive"
  | "true-false"
  | "coding"
  | "file-upload";

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onTypeSelect: (type: QuestionType) => void;
  onPreview: () => void;
  onSave: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
  hasChanges?: boolean;
}

const questionTypes: { type: QuestionType; label: string }[] = [
  { type: "mcq", label: "Multiple Choice" },
  { type: "fillup", label: "Fill in the Blanks" },
  { type: "match-following", label: "Match the Following" },
  { type: "descriptive", label: "Descriptive" },
  { type: "true-false", label: "True or False" },
  { type: "coding", label: "Coding Question" },
  { type: "file-upload", label: "File Upload" },
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
      {" "}
      {/* Left side - Question types */}
      <div className="flex flex-wrap gap-2">
        {questionTypes.map(({ type, label }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeSelect(type)}
            className="min-w-fit"
            disabled={isEdit}
          >
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
        </Button>{" "}
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
