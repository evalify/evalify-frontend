import { MCQ } from "@/components/question-creation-new/question-types/mcq";
import { useEffect, useState, useCallback } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Save,
  X,
  ListChecks,
  FileText,
  Edit3,
  Check,
} from "lucide-react";
import { QuestionSettings } from "@/components/question-creation-new/settings-types/settings-types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateMCQQuestionProps {
  type: "MCQ" | "MMCQ";
  isEditing: boolean;
  questionId?: string;
  questionData?: MCQ;
  settings?: QuestionSettings;
  onSave?: (question: MCQ) => void;
}

export default function CreateMCQQuestion({
  type = "MCQ",
  isEditing,
  questionData,
  settings,
  onSave,
}: CreateMCQQuestionProps) {
  const [question, setQuestion] = useState<MCQ | null>(null);
  const [isCreatingNewOption, setIsCreatingNewOption] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editor, setEditor] = useState<string>("");
  const [allowMultipleCorrect, setAllowMultipleCorrect] = useState(
    type === "MMCQ",
  );

  const createNewQuestion = useCallback(
    (questionText: string = ""): MCQ => {
      return {
        type: allowMultipleCorrect ? "MMCQ" : "MCQ",
        question: questionText,
        topicIds: settings?.topicIds || [],
        marks: settings?.marks || 1,
        difficulty: settings?.difficulty || "MEDIUM",
        bloomsTaxonomy: settings?.bloomsTaxonomy || "REMEMBER",
        co: settings?.co || 1,
        negativeMarks: settings?.negativeMarks || 0,
        options: [],
      };
    },
    [settings, allowMultipleCorrect],
  );

  useEffect(() => {
    if (question && onSave) {
      onSave(question);
    }
  }, [question, onSave]);

  useEffect(() => {
    if (questionData && isEditing) {
      setQuestion(questionData);
      if (questionData.type === "MMCQ") {
        setAllowMultipleCorrect(true);
      } else if (questionData.type === "MCQ") {
        setAllowMultipleCorrect(false);
      }
    }
  }, [questionData, isEditing]);

  useEffect(() => {
    if (settings) {
      setQuestion((prev) => {
        if (!prev) {
          return createNewQuestion();
        }
        return {
          ...prev,
          type: allowMultipleCorrect ? "MMCQ" : "MCQ",
          marks: settings.marks,
          difficulty: settings.difficulty,
          bloomsTaxonomy: settings.bloomsTaxonomy,
          co: settings.co,
          negativeMarks: settings.negativeMarks,
          topicIds: settings.topicIds,
        };
      });
    }
  }, [createNewQuestion, settings, allowMultipleCorrect]);

  const handleAddOption = () => {
    setIsCreatingNewOption(true);
    setEditingOptionId(null);
    setEditor("");
  };

  const handleEditOption = (optionId: string) => {
    setIsCreatingNewOption(false);
    setEditingOptionId(optionId);
    setEditor(
      question?.options?.find((opt) => opt.id === optionId)?.text || "",
    );
  };

  const handleCancelEdit = () => {
    setIsCreatingNewOption(false);
    setEditingOptionId(null);
    setEditor("");
  };

  const handleDeleteOption = (optionId: string) => {
    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        type: allowMultipleCorrect ? "MMCQ" : "MCQ",
        options: prev.options?.filter((opt) => opt.id !== optionId) || [],
      };
    });
  };

  const handleSaveOption = () => {
    if (!editor.trim()) return;

    if (!question) {
      setQuestion(createNewQuestion());
    }

    if (editingOptionId) {
      setQuestion((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          type: allowMultipleCorrect ? "MMCQ" : "MCQ",
          options:
            prev.options?.map((opt) =>
              opt.id === editingOptionId ? { ...opt, text: editor } : opt,
            ) || [],
        };
      });
    } else {
      const newOption = {
        id: crypto.randomUUID(),
        text: editor,
        isCorrect: false,
      };
      setQuestion((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          type: allowMultipleCorrect ? "MMCQ" : "MCQ",
          options: [...(prev.options || []), newOption],
        };
      });
    }
    setIsCreatingNewOption(false);
    setEditingOptionId(null);
    setEditor("");
  };

  const handleSetCorrect = (optionId: string) => {
    setQuestion((prev) => {
      if (!prev) {
        const newQuestion = createNewQuestion();
        return {
          ...newQuestion,
          options:
            newQuestion.options?.map((opt) =>
              opt.id === optionId
                ? { ...opt, isCorrect: true }
                : allowMultipleCorrect
                  ? opt
                  : { ...opt, isCorrect: false },
            ) || [],
        };
      }

      const currentOption = prev.options?.find((opt) => opt.id === optionId);
      const isCurrentlyCorrect = currentOption?.isCorrect || false;

      return {
        ...prev,
        type: allowMultipleCorrect ? "MMCQ" : "MCQ",
        options:
          prev.options?.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, isCorrect: !isCurrentlyCorrect };
            }
            return allowMultipleCorrect ? opt : { ...opt, isCorrect: false };
          }) || [],
      };
    });
  };

  const handleQuestionChange = (content: string) => {
    setQuestion((prev) => {
      if (!prev) {
        return createNewQuestion(content);
      }
      return {
        ...prev,
        type: allowMultipleCorrect ? "MMCQ" : "MCQ",
        question: content,
      };
    });
  };

  const handleMultipleCorrectToggle = (enabled: boolean) => {
    setAllowMultipleCorrect(enabled);
    setQuestion((prev) => {
      if (!prev) {
        return createNewQuestion("");
      }

      const updatedQuestion = {
        ...prev,
        type: enabled ? "MMCQ" : "MCQ",
      };
      if (!enabled) {
        const correctOptions =
          prev.options?.filter((opt) => opt.isCorrect) || [];
        if (correctOptions.length > 1) {
          const firstCorrectIndex =
            prev.options?.findIndex((opt) => opt.isCorrect) ?? -1;
          updatedQuestion.options =
            prev.options?.map((opt, index) => ({
              ...opt,
              isCorrect: index === firstCorrectIndex,
            })) || [];
        }
      }

      return updatedQuestion;
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question?.question || ""}
            onUpdate={handleQuestionChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Options
            </CardTitle>

            <div className="flex items-center gap-2">
              <Label htmlFor="allow-multiple" className="text-sm">
                Allow multiple correct answers
              </Label>
              <Checkbox
                id="allow-multiple"
                checked={allowMultipleCorrect}
                onCheckedChange={handleMultipleCorrectToggle}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            {allowMultipleCorrect
              ? "Mode: MMCQ - Click options to select multiple correct answers"
              : "Mode: MCQ - Click to select the single correct answer"}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {question?.options?.map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
                option.isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => !editingOptionId && handleSetCorrect(option.id)}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    option.isCorrect
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + index)}.
                </span>
                {option.isCorrect && (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
              </div>

              {editingOptionId === option.id ? (
                <>
                  <TiptapEditor
                    initialContent={editor}
                    onUpdate={setEditor}
                    className="flex-1 min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveOption}
                      disabled={!editor.trim()}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="flex-1 prose prose-sm dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: option.text }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={option.isCorrect ? "default" : "ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCorrect(option.id);
                      }}
                      className={`${
                        option.isCorrect
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOption(option.id);
                      }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOption(option.id);
                      }}
                      className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {isCreatingNewOption && (
            <div className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                {String.fromCharCode(65 + (question?.options?.length || 0))}.
              </span>
              <TiptapEditor
                initialContent=""
                onUpdate={setEditor}
                className="flex-1 min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveOption}
                  disabled={!editor.trim()}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleAddOption}
            disabled={isCreatingNewOption || editingOptionId !== null}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
