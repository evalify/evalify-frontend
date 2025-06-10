"use client";

import React from "react";
import {
  TiptapEditor,
  TiptapEditorRef,
} from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Info,
  FileText,
  Edit3,
  Type,
  Check,
  X,
  Pencil,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FillupBlank {
  id: string;
  position: number;
  acceptedAnswers: string[];
}

interface FillupQuestionProps {
  question: string;
  blanks: FillupBlank[];
  explanation?: string;
  showExplanation: boolean;
  strictMatch?: boolean;
  useHybridEvaluation?: boolean;
  onQuestionChange: (question: string) => void;
  onBlanksChange: (blanks: FillupBlank[]) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (show: boolean) => void;
  onStrictMatchChange?: (strict: boolean) => void;
  onUseHybridEvaluationChange?: (hybrid: boolean) => void;
}

const FillupQuestion: React.FC<FillupQuestionProps> = ({
  question,
  blanks,
  explanation = "",
  showExplanation,
  onQuestionChange,
  onBlanksChange,
  onExplanationChange,
  onShowExplanationChange,
  onStrictMatchChange,
  onUseHybridEvaluationChange,
  strictMatch = false,
  useHybridEvaluation = false,
}) => {
  const [newAnswer, setNewAnswer] = React.useState<{ [key: string]: string }>(
    {},
  );
  const [editingAnswer, setEditingAnswer] = React.useState<{
    blankId: string;
    answerId: string;
    value: string;
  } | null>(null);
  const isUpdating = React.useRef(false);
  const blanksRef = React.useRef(blanks);

  // Update blanks ref whenever blanks change
  React.useEffect(() => {
    blanksRef.current = blanks;
  }, [blanks]);
  // Add a ref to access the TiptapEditor instance
  const editorRef = React.useRef<TiptapEditorRef>(null); // Add toast for user feedback
  const { error, warning } = useToast(); // Function to detect blanks from question content and auto-create answer sections
  const detectAndUpdateBlanks = React.useCallback(
    (questionContent: string) => {
      // Skip if we're already updating to prevent infinite loops
      if (isUpdating.current) return;
      // Find all instances of underscores (exactly 3 consecutive underscores with optional spaces around)
      const blankRegex = /\s*_{3}\s*/g;
      const matches = Array.from(questionContent.matchAll(blankRegex));

      // Get current blanks from ref to avoid dependency issues
      const currentBlanks = blanksRef.current;
      const currentPositions = currentBlanks
        .map((b) => b.position)
        .sort()
        .join(",");
      const newPositions = matches
        .map((_, i) => i + 1)
        .sort()
        .join(",");

      // Only update if the positions have changed
      if (
        currentPositions !== newPositions ||
        currentBlanks.length !== matches.length
      ) {
        const detectedBlanks: FillupBlank[] = matches.map((match, index) => {
          // Try to preserve existing answers for this position if available
          const existingBlank = currentBlanks.find(
            (b) => b.position === index + 1,
          );

          return {
            id: existingBlank?.id || `blank-${Date.now()}-${index}`,
            position: index + 1,
            acceptedAnswers: existingBlank?.acceptedAnswers || [],
          };
        });

        // Set flag to prevent recursive updates
        isUpdating.current = true;

        // Update blanks
        onBlanksChange(detectedBlanks);

        // Reset flag after a short delay to allow React to process the update
        setTimeout(() => {
          isUpdating.current = false;
        }, 100);
      }
    },
    [onBlanksChange],
  );
  // Auto-detect blanks when question content changes, but not when using the button
  React.useEffect(() => {
    // Skip if using the button (isUpdating.current is true)
    if (question && !isUpdating.current) {
      detectAndUpdateBlanks(question);
    }
  }, [question, detectAndUpdateBlanks]); // Function to insert blank at cursor position
  const insertBlankAtCursor = () => {
    // Check if editor ref is available
    if (!editorRef.current) {
      console.error(
        "Editor ref not available - component may not be mounted yet",
      );
      error("Editor is not ready. Please try again.");
      return;
    }
    const editor = editorRef.current.editor;
    if (!editor) {
      console.error(
        "Editor instance not available - editor may not be initialized",
      );
      error(
        "Editor is not initialized. Please refresh the page and try again.",
      );
      return;
    } // Check if editor is destroyed or not ready
    if (editor.isDestroyed) {
      console.error("Cannot insert blank - editor has been destroyed");
      error("Editor is no longer available. Please refresh the page.");
      return;
    }
    try {
      // Insert the blank (3 underscores with spaces) at the cursor position
      const blank = " ___ ";

      // Use TiptapEditor API to insert content at cursor position
      const success = editor.chain().focus().insertContent(blank).run();
      if (!success) {
        console.warn(
          "Failed to insert blank - editor command did not execute successfully",
        );
        warning(
          "Could not insert blank at current cursor position. Please try clicking in the text area first.",
        );
        return;
      }

      // Get the current content and trigger both updates
      const currentContent = editor.getHTML();
      onQuestionChange(currentContent); // Update the question content
      detectAndUpdateBlanks(currentContent); // Detect blanks
    } catch (e) {
      console.error(
        "Error inserting blank at cursor position:",
        e instanceof Error ? e.message : e,
      );

      // Additional error context for debugging
      console.error("Editor state:", {
        isDestroyed: editor.isDestroyed,
        isFocused: editor.isFocused,
      }); // Show user-friendly error message
      error("Failed to insert blank. Please try again or refresh the page.");
    }
  };
  // Removed addBlank function - blanks are now auto-detected from question content

  const removeBlank = (blankId: string) => {
    onBlanksChange(blanks.filter((blank) => blank.id !== blankId));
  };
  const addAnswerToBlank = (blankId: string) => {
    const answer = newAnswer[blankId]?.trim();
    if (!answer) return;

    // Set updating flag to prevent blank detection during answer addition
    isUpdating.current = true;

    onBlanksChange(
      blanks.map((blank) =>
        blank.id === blankId
          ? {
              ...blank,
              acceptedAnswers: blank.acceptedAnswers.includes(answer)
                ? blank.acceptedAnswers
                : [...blank.acceptedAnswers, answer],
            }
          : blank,
      ),
    );

    setNewAnswer((prev) => ({ ...prev, [blankId]: "" }));

    // Reset flag after a short delay
    setTimeout(() => {
      isUpdating.current = false;
    }, 100);
  };
  const removeAnswerFromBlank = (blankId: string, answerToRemove: string) => {
    // Set updating flag to prevent blank detection during answer removal
    isUpdating.current = true;

    onBlanksChange(
      blanks.map((blank) =>
        blank.id === blankId
          ? {
              ...blank,
              acceptedAnswers: blank.acceptedAnswers.filter(
                (answer) => answer !== answerToRemove,
              ),
            }
          : blank,
      ),
    );

    // Reset flag after a short delay
    setTimeout(() => {
      isUpdating.current = false;
    }, 100);
  };

  const startEditingAnswer = (blankId: string, answer: string) => {
    setEditingAnswer({ blankId, answerId: answer, value: answer });
  };
  const saveEditedAnswer = () => {
    if (!editingAnswer) return;

    const { blankId, answerId, value } = editingAnswer;
    const trimmedValue = value.trim();

    // Set updating flag to prevent blank detection during answer editing
    isUpdating.current = true;

    if (!trimmedValue) {
      // If empty, remove the answer (inline without calling removeAnswerFromBlank to avoid flag conflict)
      onBlanksChange(
        blanks.map((blank) =>
          blank.id === blankId
            ? {
                ...blank,
                acceptedAnswers: blank.acceptedAnswers.filter(
                  (answer) => answer !== answerId,
                ),
              }
            : blank,
        ),
      );
    } else {
      // Update the answer
      onBlanksChange(
        blanks.map((blank) =>
          blank.id === blankId
            ? {
                ...blank,
                acceptedAnswers: blank.acceptedAnswers.map((answer) =>
                  answer === answerId ? trimmedValue : answer,
                ),
              }
            : blank,
        ),
      );
    }

    setEditingAnswer(null);

    // Reset flag after a short delay
    setTimeout(() => {
      isUpdating.current = false;
    }, 100);
  };

  const cancelEditingAnswer = () => {
    setEditingAnswer(null);
  };

  return (
    <div className="space-y-6">
      {" "}
      {/* Question Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Question
            </CardTitle>{" "}
            <Button
              onClick={insertBlankAtCursor}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <span className="text-lg font-bold leading-none">___</span>
              Add Blank
            </Button>
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              {" "}
              <p className="font-medium mb-1">
                How to create fill-in-the-blanks:
              </p>
              <p>
                Click &quot;Add Blank&quot; button to insert blanks, or manually
                type{" "}
                <code className="bg-white dark:bg-gray-800 px-1 rounded">
                  ___
                </code>{" "}
                (three underscores) to mark blanks in your question text.
              </p>
            </div>
          </div>
        </CardHeader>{" "}
        <CardContent>
          <TiptapEditor
            ref={editorRef}
            initialContent={question}
            onUpdate={onQuestionChange}
            height="200px"
          />
        </CardContent>{" "}
      </Card>{" "}
      {/* Evaluation Settings */}
      <div className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-2 mb-4">
          <Type className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Evaluation Settings
          </h3>
        </div>
        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Match Type
              </Label>
              <div className="flex items-center gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg border shadow-sm w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={!strictMatch ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onStrictMatchChange?.(false)}
                      className="h-8 flex-1 text-sm font-medium"
                    >
                      Flexible
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Answers are case-insensitive and allow minor variations
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={strictMatch ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onStrictMatchChange?.(true)}
                      className="h-8 flex-1 text-sm font-medium"
                    >
                      Strict
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Answers must match exactly (case-sensitive)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Evaluation Method
              </Label>
              <div className="flex items-center gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg border shadow-sm w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={!useHybridEvaluation ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onUseHybridEvaluationChange?.(false)}
                      className="h-8 flex-1 text-sm font-medium"
                    >
                      Normal
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Standard evaluation using exact answer matching</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={useHybridEvaluation ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onUseHybridEvaluationChange?.(true)}
                      className="h-8 flex-1 text-sm font-medium"
                    >
                      Hybrid
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI-powered evaluation with semantic understanding</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
      {/* Blanks Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Answer Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blanks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No blanks detected in your question. Use the &quot;Add Blank&quot;
              button in the Question section above to insert blanks.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blanks.map((blank, index) => (
                <div
                  key={blank.id}
                  className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow min-w-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm font-medium">
                        {index + 1}
                      </Badge>
                      <Label className="text-base font-medium">
                        Blank {index + 1}
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBlank(blank.id)}
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Accepted Answers */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Accepted Answers
                    </Label>
                    {blank.acceptedAnswers.length > 0 && (
                      <div className="space-y-1">
                        {blank.acceptedAnswers.map((answer) => (
                          <div
                            key={answer}
                            className="flex items-center justify-between p-2 bg-muted/20 rounded-md group"
                          >
                            {editingAnswer?.blankId === blank.id &&
                            editingAnswer?.answerId === answer ? (
                              <div className="flex items-center gap-1 flex-1">
                                <Input
                                  value={editingAnswer.value}
                                  onChange={(e) =>
                                    setEditingAnswer({
                                      ...editingAnswer,
                                      value: e.target.value,
                                    })
                                  }
                                  className="h-6 text-xs"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      saveEditedAnswer();
                                    } else if (e.key === "Escape") {
                                      cancelEditingAnswer();
                                    }
                                  }}
                                  autoFocus
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={saveEditedAnswer}
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelEditingAnswer}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span className="text-sm font-medium flex-1">
                                  {answer}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      startEditingAnswer(blank.id, answer)
                                    }
                                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeAnswerFromBlank(blank.id, answer)
                                    }
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}{" "}
                    {/* Add new answer */}
                    <div className="flex gap-2">
                      <Input
                        value={newAnswer[blank.id] || ""}
                        onChange={(e) =>
                          setNewAnswer((prev) => ({
                            ...prev,
                            [blank.id]: e.target.value,
                          }))
                        }
                        placeholder="Add accepted answer"
                        className="text-xs flex-1 min-w-0"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addAnswerToBlank(blank.id);
                          }
                        }}
                      />
                      <Button
                        onClick={() => addAnswerToBlank(blank.id)}
                        size="sm"
                        className="h-8 shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Add multiple accepted answers for flexible grading
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        </CardHeader>{" "}
        {showExplanation && (
          <CardContent>
            <TiptapEditor
              initialContent={explanation}
              onUpdate={onExplanationChange}
              height="150px"
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FillupQuestion;
