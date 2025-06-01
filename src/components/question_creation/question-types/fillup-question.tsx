"use client";

import React from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Info, Square } from "lucide-react";

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
  onQuestionChange: (question: string) => void;
  onBlanksChange: (blanks: FillupBlank[]) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (show: boolean) => void;
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
}) => {
  const [newAnswer, setNewAnswer] = React.useState<{ [key: string]: string }>(
    {},
  );
  // Add a ref to track if we're currently updating to prevent infinite loops
  const isUpdating = React.useRef(false);

  // Function to detect blanks from question content and auto-create answer sections
  const detectAndUpdateBlanks = React.useCallback(
    (questionContent: string) => {
      // Skip if we're already updating to prevent infinite loops
      if (isUpdating.current) return;
      // Find all instances of underscores (exactly 3 consecutive underscores with optional spaces around)
      const blankRegex = /\s*_{3}\s*/g;
      const matches = Array.from(questionContent.matchAll(blankRegex));

      // Compare with current blanks before updating
      const currentPositions = blanks
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
        blanks.length !== matches.length
      ) {
        const detectedBlanks: FillupBlank[] = matches.map((match, index) => {
          // Try to preserve existing answers for this position if available
          const existingBlank = blanks.find((b) => b.position === index + 1);

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
        }, 0);
      }
    },
    [blanks, onBlanksChange],
  );

  // Auto-detect blanks when question content changes
  React.useEffect(() => {
    if (question && !isUpdating.current) {
      detectAndUpdateBlanks(question);
    }
  }, [question, detectAndUpdateBlanks]); // Function to insert blank at cursor position
  const insertBlankAtCursor = () => {
    // Get the specific editor element within the question card
    const editorElement = document.querySelector(".ProseMirror") as HTMLElement;
    if (!editorElement) return;

    // Check if the editor is focused or if we should focus it first
    const selection = window.getSelection();
    const focusNode = selection?.focusNode;
    const isEditorFocused = focusNode
      ? editorElement.contains(focusNode)
      : false;

    if (!isEditorFocused) {
      // Focus the editor first and place cursor at the end
      editorElement.focus();
      const range = document.createRange();
      range.selectNodeContents(editorElement);
      range.collapse(false); // Collapse to end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    // Insert the blank (3 underscores with spaces) at the cursor position
    const blank = " ___ ";

    try {
      const currentSelection = window.getSelection();
      if (currentSelection && currentSelection.rangeCount > 0) {
        const range = currentSelection.getRangeAt(0);

        // Ensure we're still within the editor
        if (!editorElement.contains(range.commonAncestorContainer)) {
          return;
        }

        // Create a text node with underscores
        const textNode = document.createTextNode(blank);

        // Insert the text node at cursor position
        range.deleteContents(); // Clear any selected text first
        range.insertNode(textNode);

        // Move cursor after the inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        currentSelection.removeAllRanges();
        currentSelection.addRange(range);

        // Set updating flag before triggering content update
        isUpdating.current = true;

        // Force update to detect the new blank
        setTimeout(() => {
          const updatedContent = editorElement.innerHTML;
          onQuestionChange(updatedContent);

          // Reset flag after a short delay
          setTimeout(() => {
            isUpdating.current = false;
          }, 0);
        }, 10);
      }
    } catch (e) {
      console.error("Error inserting blank:", e);
      // Fallback approach - only if we're in the editor
      try {
        if (editorElement.contains(document.activeElement)) {
          document.execCommand("insertText", false, blank);
        }
      } catch (e2) {
        console.error("Fallback insertion failed:", e2);
      }
    }
  };
  // Removed addBlank function - blanks are now auto-detected from question content

  const removeBlank = (blankId: string) => {
    onBlanksChange(blanks.filter((blank) => blank.id !== blankId));
  };

  const addAnswerToBlank = (blankId: string) => {
    const answer = newAnswer[blankId]?.trim();
    if (!answer) return;

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
  };

  const removeAnswerFromBlank = (blankId: string, answerToRemove: string) => {
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
  };

  return (
    <div className="space-y-6">
      {" "}
      {/* Question Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Question</CardTitle>
            <Button
              onClick={insertBlankAtCursor}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
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
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question}
            onUpdate={onQuestionChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>
      {/* Blanks Configuration */}{" "}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Answer Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blanks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No blanks detected in your question. Use the &ldquo;Add
              Blank&rdquo; button in the Question section above to insert
              blanks.
            </div>
          ) : (
            blanks.map((blank, index) => (
              <div key={blank.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Blank {index + 1}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlank(blank.id)}
                    className="text-destructive hover:text-destructive"
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
                    <div className="flex flex-wrap gap-2">
                      {blank.acceptedAnswers.map((answer) => (
                        <Badge
                          key={answer}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {answer}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() =>
                              removeAnswerFromBlank(blank.id, answer)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

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
                    >
                      Add
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Add multiple accepted answers for flexible grading
                    (case-sensitive)
                  </div>
                </div>
              </div>
            ))
          )}
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

export default FillupQuestion;
