import { MCQ } from "./question-types/mcq";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { questionsService } from "@/repo/question-queries/questions";
import { QuestionCreationSkeleton } from "@/components/question-creation-new/fallbacks";
import { QuestionCreationError } from "@/components/question-creation-new/fallbacks";
import {
  TiptapEditor,
  TiptapEditorRef,
} from "@/components/rich-text-editor/editor";
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

interface CreateMCQQuestionProps {
  type: "MCQ";
  onSave: (question: MCQ) => void;
  isEditing: boolean;
  questionId?: string;
  settings?: {
    marks: number;
    difficulty: string;
    bloomsTaxonomy: string;
    co: string;
    negativeMarks: number;
  };
}

export default function CreateMCQQuestion({
  onSave,
  isEditing,
  questionId,
  settings,
}: CreateMCQQuestionProps) {
  const [question, setQuestion] = useState<MCQ | null>(null);
  const [isCreatingNewOption, setIsCreatingNewOption] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editor, setEditor] = useState<string>("");
  const newOptionEditorRef = useRef<TiptapEditorRef>(null);
  const createNewQuestion = useCallback(
    (questionText: string = ""): MCQ => {
      return {
        type: "MCQ",
        question: questionText,
        topicIds: [],
        marks: settings?.marks || 1,
        difficulty: settings?.difficulty || "medium",
        bloomsTaxonomy: settings?.bloomsTaxonomy || "remember",
        co: settings?.co || "CO1",
        negativeMarks: settings?.negativeMarks || 0,
        options: [],
      };
    },
    [settings],
  );

  const {
    data: questionData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => {
      if (!questionId) {
        throw new Error("Question ID is required for fetching question data.");
      }
      return questionsService.getBankQuestionById(questionId);
    },
    enabled: isEditing && !!questionId,
  });

  useEffect(() => {
    if (questionData && isEditing) {
      setQuestion(questionData);
    }
  }, [questionData, isEditing]);

  useEffect(() => {
    if (settings) {
      setQuestion((prev) => {
        if (!prev) {
          return createNewQuestion();
        }
        if (
          prev.marks !== settings.marks ||
          prev.difficulty !== settings.difficulty ||
          prev.bloomsTaxonomy !== settings.bloomsTaxonomy ||
          prev.co !== settings.co ||
          prev.negativeMarks !== settings.negativeMarks
        ) {
          return {
            ...prev,
            marks: settings.marks,
            difficulty: settings.difficulty,
            bloomsTaxonomy: settings.bloomsTaxonomy,
            co: settings.co,
            negativeMarks: settings.negativeMarks,
          };
        }
        return prev;
      });
    }
  }, [createNewQuestion, settings]);

  useEffect(() => {
    if (isCreatingNewOption && newOptionEditorRef.current?.editor) {
      setTimeout(() => {
        newOptionEditorRef.current?.editor?.commands?.focus();
      }, 100);
    }
  }, [isCreatingNewOption]);

  // Auto-save whenever question changes
  useEffect(() => {
    if (question) {
      onSave(question);
    }
  }, [question, onSave]);

  if (isLoading && isEditing) {
    return <QuestionCreationSkeleton />;
  }

  if (error && isEditing) {
    return <QuestionCreationError message={error.message} />;
  }

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
                : { ...opt, isCorrect: false },
            ) || [],
        };
      }

      const currentOption = prev.options?.find((opt) => opt.id === optionId);
      const isCurrentlyCorrect = currentOption?.isCorrect || false;

      return {
        ...prev,
        options:
          prev.options?.map((opt) =>
            opt.id === optionId
              ? { ...opt, isCorrect: !isCurrentlyCorrect }
              : { ...opt, isCorrect: false },
          ) || [],
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
        question: content,
      };
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
          <CardTitle className="text-lg flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Options
          </CardTitle>
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
                ref={newOptionEditorRef}
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
