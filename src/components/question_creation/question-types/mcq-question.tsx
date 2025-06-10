"use client";

import React, { useState } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  ListChecks,
  FileText,
  Edit3,
} from "lucide-react";

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MCQQuestionProps {
  question: string;
  options: MCQOption[];
  explanation?: string;
  showExplanation: boolean;
  allowMultipleCorrect?: boolean;
  onQuestionChange: (question: string) => void;
  onOptionsChange: (options: MCQOption[]) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (show: boolean) => void;
  onAllowMultipleCorrectChange?: (allowMultiple: boolean) => void;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  options,
  explanation = "",
  showExplanation,
  allowMultipleCorrect = false,
  onQuestionChange,
  onOptionsChange,
  onExplanationChange,
  onShowExplanationChange,
  onAllowMultipleCorrectChange,
}) => {
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isCreatingNewOption, setIsCreatingNewOption] = useState(false);

  const addOption = () => {
    setIsCreatingNewOption(true);
    setEditingOptionId(null);
    setEditorContent("");
  };

  const removeOption = (optionId: string) => {
    onOptionsChange(options.filter((option) => option.id !== optionId));
    // Clear editor if we're editing the option being removed
    if (editingOptionId === optionId) {
      setEditingOptionId(null);
      setEditorContent("");
      setIsCreatingNewOption(false);
    }
  };

  const startEditingOption = (option: MCQOption) => {
    setEditingOptionId(option.id);
    setEditorContent(option.text);
    setIsCreatingNewOption(false);
  };

  const saveOption = () => {
    if (isCreatingNewOption) {
      // Create new option
      const newOption: MCQOption = {
        id: `option-${Date.now()}`,
        text: editorContent,
        isCorrect: false,
      };
      onOptionsChange([...options, newOption]);
    } else if (editingOptionId) {
      // Update existing option
      onOptionsChange(
        options.map((option) =>
          option.id === editingOptionId
            ? { ...option, text: editorContent }
            : option,
        ),
      );
    }

    // Clear editor state
    setEditingOptionId(null);
    setEditorContent("");
    setIsCreatingNewOption(false);
  };

  const cancelEditing = () => {
    setEditingOptionId(null);
    setEditorContent("");
    setIsCreatingNewOption(false);
  };
  const setCorrectOption = (optionId: string) => {
    if (allowMultipleCorrect) {
      // Toggle the correct state for this option
      onOptionsChange(
        options.map((option) =>
          option.id === optionId
            ? { ...option, isCorrect: !option.isCorrect }
            : option,
        ),
      );
    } else {
      // Single correct answer - unselect all others
      onOptionsChange(
        options.map((option) => ({
          ...option,
          isCorrect: option.id === optionId,
        })),
      );
    }
  };
  const handleMultipleCorrectToggle = (enabled: boolean) => {
    if (onAllowMultipleCorrectChange) {
      onAllowMultipleCorrectChange(enabled);
    }

    if (enabled) {
      // Switching to multiple correct mode - no changes needed to current selection
      return;
    } else {
      // Switching to single correct mode
      const correctOptions = options.filter((opt) => opt.isCorrect);

      if (correctOptions.length > 1) {
        // Multiple correct answers exist, keep only the first one
        const firstCorrectIndex = options.findIndex((opt) => opt.isCorrect);
        onOptionsChange(
          options.map((option, index) => ({
            ...option,
            isCorrect: index === firstCorrectIndex,
          })),
        );
      } else if (correctOptions.length === 0) {
        // No correct answers, select the first option by default
        if (options.length > 0) {
          onOptionsChange(
            options.map((option, index) => ({
              ...option,
              isCorrect: index === 0,
            })),
          );
        }
      }
      // If exactly one correct answer exists, no changes needed
    }
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

      {/* Options */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Answer Options
          </CardTitle>
          <div className="flex items-center gap-4">
            {onAllowMultipleCorrectChange && (
              <div className="flex items-center gap-2">
                <Label htmlFor="multiple-correct" className="text-sm">
                  Multiple correct answers
                </Label>
                <Switch
                  id="multiple-correct"
                  checked={allowMultipleCorrect}
                  onCheckedChange={handleMultipleCorrectToggle}
                />
              </div>
            )}
            <Button
              onClick={addOption}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Option Editor */}
          {(isCreatingNewOption || editingOptionId) && (
            <Card className="border-2 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">
                  {isCreatingNewOption ? "Create New Option" : "Edit Option"}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={saveOption}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    onClick={cancelEditing}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TiptapEditor
                  key={editingOptionId || "new"} // Force re-render when switching options
                  initialContent={editorContent}
                  onUpdate={setEditorContent}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          )}

          {/* Options List */}
          {options.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No options added yet. Click &ldquo;Add Option&rdquo; to create
                your first answer choice.
              </p>
            </div>
          ) : (
            <>
              {/* Multiple correct answers - clickable options without checkboxes */}
              <div className="space-y-4">
                {options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer ${
                      option.isCorrect
                        ? "border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-900/30"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() => setCorrectOption(option.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Label className="text-sm font-medium">
                        Option {String.fromCharCode(65 + index)}
                      </Label>
                      <div className="flex-1 ml-4">
                        {option.text ? (
                          <ContentPreview
                            content={option.text}
                            className="border-0 p-0 min-h-0 prose prose-sm max-w-none overflow-visible"
                          />
                        ) : (
                          <span className="text-muted-foreground italic">
                            No content
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pointer-events-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingOption(option);
                        }}
                        disabled={
                          editingOptionId === option.id || isCreatingNewOption
                        }
                        className="text-primary hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(option.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {allowMultipleCorrect
                    ? "Click on options to toggle correct answers"
                    : "Click on the correct answer option"}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onOptionsChange(
                        options.map((option) => ({
                          ...option,
                          isCorrect: false,
                        })),
                      );
                    }}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                  >
                    Clear Selections
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onOptionsChange([]);
                      // Clear editor state if editing
                      setEditingOptionId(null);
                      setEditorContent("");
                      setIsCreatingNewOption(false);
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    Clear All Options
                  </Button>
                </div>
              </div>
            </>
          )}
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

export default MCQQuestion;
