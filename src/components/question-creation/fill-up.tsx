import {
  FillUpQuestion,
  BlankValueType,
} from "@/components/question-creation-new/question-types/fill-up";
import { useEffect, useState, useCallback } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, X, FileText, Edit3, AlertCircle } from "lucide-react";
import { QuestionSettings } from "@/components/question-creation-new/settings-types/settings-types";

interface CreateFillUpQuestionProps {
  isEditing: boolean;
  questionId?: string;
  questionData?: FillUpQuestion;
  settings?: QuestionSettings;
  onSave?: (question: FillUpQuestion) => void;
}

export default function CreateFillUpQuestion({
  isEditing,
  questionData,
  settings,
  onSave,
}: CreateFillUpQuestionProps) {
  const [question, setQuestion] = useState<FillUpQuestion | null>(null);
  const [detectedBlanks, setDetectedBlanks] = useState<string[]>([]);
  const [newAnswerInputs, setNewAnswerInputs] = useState<{
    [blankId: string]: string;
  }>({});

  const getValidationMessage = (type: BlankValueType): string => {
    switch (type) {
      case BlankValueType.LOWERCASE:
        return "Only lowercase letters and spaces allowed";
      case BlankValueType.UPPERCASE:
        return "Only uppercase letters and spaces allowed";
      case BlankValueType.INTEGER:
        return "Only whole numbers allowed (e.g., 42, -15)";
      case BlankValueType.FLOAT:
        return "Only decimal numbers allowed (e.g., 3.14, -2.5)";
      case BlankValueType.STRING:
      default:
        return "Any text is allowed";
    }
  };

  const getValidationError = (
    answer: string,
    type: BlankValueType,
  ): string | null => {
    if (!answer.trim()) return null;

    switch (type) {
      case BlankValueType.LOWERCASE:
        if (answer !== answer.toLowerCase() || !/^[a-z\s]+$/.test(answer)) {
          return "Must be lowercase letters only";
        }
        break;
      case BlankValueType.UPPERCASE:
        if (answer !== answer.toUpperCase() || !/^[A-Z\s]+$/.test(answer)) {
          return "Must be uppercase letters only";
        }
        break;
      case BlankValueType.INTEGER:
        if (!/^-?\d+$/.test(answer)) {
          return "Must be a whole number";
        }
        break;
      case BlankValueType.FLOAT:
        if (!/^-?\d*\.?\d+$/.test(answer)) {
          return "Must be a valid decimal number";
        }
        break;
    }
    return null;
  };

  const convertAnswerToType = (
    answer: string,
    type: BlankValueType,
  ): string | number => {
    switch (type) {
      case BlankValueType.INTEGER:
        return parseInt(answer, 10);
      case BlankValueType.FLOAT:
        return parseFloat(answer);
      case BlankValueType.LOWERCASE:
      case BlankValueType.UPPERCASE:
      case BlankValueType.STRING:
      default:
        return answer;
    }
  };

  const convertExistingAnswersToType = (
    answers: (string | number)[],
    newType: BlankValueType,
  ): (string | number)[] => {
    return answers
      .map((answer) => {
        const answerStr =
          typeof answer === "number" ? answer.toString() : answer;
        return convertAnswerToType(answerStr, newType);
      })
      .filter((answer) => {
        // Filter out invalid conversions
        if (
          newType === BlankValueType.INTEGER ||
          newType === BlankValueType.FLOAT
        ) {
          return !isNaN(answer as number);
        }
        return true;
      });
  };

  const createNewQuestion = useCallback(
    (questionText: string = ""): FillUpQuestion => {
      return {
        type: "FILL_UP",
        question: questionText,
        topicIds: settings?.topicIds || [],
        marks: settings?.marks || 1,
        difficulty: settings?.difficulty || "MEDIUM",
        bloomsTaxonomy: settings?.bloomsTaxonomy || "REMEMBER",
        co: settings?.co || 1,
        negativeMarks: settings?.negativeMarks || 0,
        blanks: [],
        strictMatch: true,
        llmEval: false,
      };
    },
    [settings],
  );

  const extractBlanksFromText = useCallback((text: string): string[] => {
    const textContent = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const blankMatches = textContent.match(/_{3,}/g) || [];
    return blankMatches.map((_, index) => `${index + 1}`);
  }, []);

  const cleanQuestionText = useCallback((text: string): string => {
    return text
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, " ")
      .replace(/<br\s*\/?>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const syncQuestionWithBlanks = useCallback(
    (currentQuestion: FillUpQuestion) => {
      const detectedBlanks = extractBlanksFromText(currentQuestion.question);

      const syncedBlanks = detectedBlanks.map((blankId) => {
        const existingBlank = currentQuestion.blanks.find(
          (b) => b.id === blankId,
        );
        return (
          existingBlank || {
            id: blankId,
            answers: [],
            type: BlankValueType.STRING,
          }
        );
      });

      return {
        ...currentQuestion,
        blanks: syncedBlanks,
      };
    },
    [extractBlanksFromText],
  );

  useEffect(() => {
    if (question && onSave) {
      onSave(question);
    }
  }, [question, onSave]);

  useEffect(() => {
    if (questionData && isEditing) {
      const cleanedQuestion = {
        ...questionData,
        question: cleanQuestionText(questionData.question),
      };
      setQuestion(syncQuestionWithBlanks(cleanedQuestion));
      const detectedBlanks = extractBlanksFromText(cleanedQuestion.question);
      setDetectedBlanks(detectedBlanks);
    }
  }, [
    questionData,
    isEditing,
    syncQuestionWithBlanks,
    extractBlanksFromText,
    cleanQuestionText,
  ]);

  useEffect(() => {
    if (settings) {
      setQuestion((prev) => {
        if (!prev) {
          const newQuestion = createNewQuestion();
          return syncQuestionWithBlanks(newQuestion);
        }
        const updatedQuestion = {
          ...prev,
          marks: settings.marks,
          difficulty: settings.difficulty,
          bloomsTaxonomy: settings.bloomsTaxonomy,
          co: settings.co,
          negativeMarks: settings.negativeMarks,
          topicIds: settings.topicIds,
        };
        return syncQuestionWithBlanks(updatedQuestion);
      });
    }
  }, [createNewQuestion, settings, syncQuestionWithBlanks]);

  const handleQuestionChange = (content: string) => {
    if (isEditing) return;

    const cleanedContent = cleanQuestionText(content);
    const newBlanks = extractBlanksFromText(cleanedContent);
    setDetectedBlanks(newBlanks);

    setQuestion((prev) => {
      if (!prev) {
        const newQuestion = createNewQuestion(cleanedContent);
        return syncQuestionWithBlanks(newQuestion);
      }

      const updatedQuestion = {
        ...prev,
        question: cleanedContent,
      };

      return syncQuestionWithBlanks(updatedQuestion);
    });
  };

  const handleAddBlankToQuestion = () => {
    if (!question || isEditing) return;

    const currentText = question.question.trim();
    const updatedQuestionText = currentText ? `${currentText} ___` : "___";

    setQuestion((prev) => {
      if (!prev) return prev;

      const updatedQuestion = {
        ...prev,
        question: updatedQuestionText,
      };

      return syncQuestionWithBlanks(updatedQuestion);
    });
  };

  const handleAnswerChange = (blankId: string, value: string) => {
    setNewAnswerInputs((prev) => ({
      ...prev,
      [blankId]: value,
    }));
  };

  const validateAnswer = (answer: string, type: BlankValueType): boolean => {
    switch (type) {
      case BlankValueType.LOWERCASE:
        return answer === answer.toLowerCase() && /^[a-z\s]+$/.test(answer);
      case BlankValueType.UPPERCASE:
        return answer === answer.toUpperCase() && /^[A-Z\s]+$/.test(answer);
      case BlankValueType.INTEGER:
        return /^-?\d+$/.test(answer);
      case BlankValueType.FLOAT:
        return /^-?\d*\.?\d+$/.test(answer);
      case BlankValueType.STRING:
      default:
        return true;
    }
  };

  const handleBlankTypeChange = (blankId: string, newType: BlankValueType) => {
    setQuestion((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        blanks: prev.blanks.map((blank) =>
          blank.id === blankId
            ? {
                ...blank,
                type: newType,
                answers: convertExistingAnswersToType(blank.answers, newType),
              }
            : blank,
        ),
      };
    });
  };

  const handleAddAnswer = (blankId: string) => {
    const newAnswer = newAnswerInputs[blankId]?.trim();
    if (!newAnswer) return;
    const blank = question?.blanks.find((b) => b.id === blankId);
    if (blank && !validateAnswer(newAnswer, blank.type)) {
      return;
    }

    // Convert the answer to the appropriate type
    const convertedAnswer = blank
      ? convertAnswerToType(newAnswer, blank.type)
      : newAnswer;

    setQuestion((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        blanks: prev.blanks.map((blank) =>
          blank.id === blankId
            ? { ...blank, answers: [...blank.answers, convertedAnswer] }
            : blank,
        ),
      };
    });

    setNewAnswerInputs((prev) => ({
      ...prev,
      [blankId]: "",
    }));
  };

  const handleRemoveAnswer = (blankId: string, answerIndex: number) => {
    setQuestion((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        blanks: prev.blanks.map((blank) =>
          blank.id === blankId
            ? {
                ...blank,
                answers: blank.answers.filter(
                  (_, index) => index !== answerIndex,
                ),
              }
            : blank,
        ),
      };
    });
  };

  const handleDeleteBlank = (blankId: string) => {
    if (isEditing) return;

    setQuestion((prev) => {
      if (!prev) return prev;

      let updatedQuestion = prev.question;

      const blankNumber = parseInt(blankId);
      if (!isNaN(blankNumber)) {
        const blankPattern = /\s*_{3,}\s*/g;
        let match;
        let blankCount = 0;
        let newQuestion = updatedQuestion;

        while ((match = blankPattern.exec(updatedQuestion)) !== null) {
          blankCount++;
          if (blankCount === blankNumber) {
            newQuestion =
              updatedQuestion.slice(0, match.index) +
              " " +
              updatedQuestion.slice(match.index + match[0].length);
            break;
          }
        }
        updatedQuestion = newQuestion.replace(/\s+/g, " ").trim();
      }

      const result = {
        ...prev,
        question: updatedQuestion,
        blanks: prev.blanks.filter((blank) => blank.id !== blankId),
      };

      return syncQuestionWithBlanks(result);
    });

    setNewAnswerInputs((prev) => {
      const updated = { ...prev };
      delete updated[blankId];
      return updated;
    });
  };

  const handleStrictMatchToggle = (enabled: boolean) => {
    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        strictMatch: enabled,
      };
    });
  };

  const handleLlmEvalToggle = (enabled: boolean) => {
    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        llmEval: enabled,
      };
    });
  };

  const getBlankPreview = (text: string) => {
    return text.replace(
      /_{3,}/g,
      '<span class="bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded">___</span>',
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Question
            </CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={handleAddBlankToQuestion}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Blank
              </Button>
            )}
          </div>
          {isEditing && (
            <p className="text-sm text-muted-foreground">
              Question text cannot be modified during editing. Only answers can
              be updated.
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="min-h-[200px] p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
              <div
                className="prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: getBlankPreview(question?.question || ""),
                }}
              />
            </div>
          ) : (
            <div>
              <TiptapEditor
                initialContent={question?.question || ""}
                onUpdate={handleQuestionChange}
                className="min-h-[200px]"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  Use three underscores (___) to create blanks in your question.
                </p>
                <p>Example: &quot;The capital of France is ___.&quot;</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Evaluation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="strict-match" className="text-sm">
                  Strict Match
                </Label>
                <Checkbox
                  id="strict-match"
                  checked={question?.strictMatch || false}
                  onCheckedChange={handleStrictMatchToggle}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="llm-eval" className="text-sm">
                  LLM Evaluation
                </Label>
                <Checkbox
                  id="llm-eval"
                  checked={question?.llmEval || false}
                  onCheckedChange={handleLlmEvalToggle}
                />
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>
              <strong>Strict Match:</strong> Answers must match exactly
              (case-insensitive)
            </p>
            <p>
              <strong>LLM Evaluation:</strong> Use AI to evaluate answer
              correctness
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                Expected Answers ({question?.blanks?.length || 0} blanks)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure the expected answers for each blank. You can add
                multiple acceptable answers.
              </p>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={handleAddBlankToQuestion}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Blank
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {question?.blanks && question.blanks.length > 0 ? (
            question.blanks.map((blank) => (
              <div key={blank.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Blank {blank.id}
                  </Label>
                  {!isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBlank(blank.id)}
                      className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground min-w-fit">
                    Answer Type:
                  </Label>
                  <Select
                    value={blank.type}
                    onValueChange={(value: BlankValueType) =>
                      handleBlankTypeChange(blank.id, value)
                    }
                    disabled={isEditing}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BlankValueType.STRING}>
                        String
                      </SelectItem>
                      <SelectItem value={BlankValueType.LOWERCASE}>
                        Lowercase
                      </SelectItem>
                      <SelectItem value={BlankValueType.UPPERCASE}>
                        Uppercase
                      </SelectItem>
                      <SelectItem value={BlankValueType.INTEGER}>
                        Integer
                      </SelectItem>
                      <SelectItem value={BlankValueType.FLOAT}>
                        Float
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-muted-foreground">
                  {getValidationMessage(blank.type)}
                  {(blank.type === BlankValueType.INTEGER ||
                    blank.type === BlankValueType.FLOAT) && (
                    <span className="block mt-1 text-blue-600 dark:text-blue-400">
                      💡 Answers will be stored as numbers in the database
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newAnswerInputs[blank.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(blank.id, e.target.value)
                      }
                      placeholder="Enter a new expected answer"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddAnswer(blank.id);
                        }
                      }}
                      className={
                        getValidationError(
                          newAnswerInputs[blank.id] || "",
                          blank.type,
                        )
                          ? "border-red-300 focus:border-red-500"
                          : ""
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddAnswer(blank.id)}
                      disabled={
                        !newAnswerInputs[blank.id]?.trim() ||
                        !!getValidationError(
                          newAnswerInputs[blank.id] || "",
                          blank.type,
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {getValidationError(
                    newAnswerInputs[blank.id] || "",
                    blank.type,
                  ) && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {getValidationError(
                        newAnswerInputs[blank.id] || "",
                        blank.type,
                      )}
                    </div>
                  )}
                </div>

                {blank.answers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Expected answers ({blank.answers.length}):
                    </Label>
                    <div className="space-y-1">
                      {blank.answers.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-800 dark:text-green-200">
                              {answer}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                              {typeof answer === "number" ? "number" : "string"}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveAnswer(blank.id, answerIndex)
                            }
                            className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {blank.answers.length === 0 && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    No answers configured for this blank
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No blanks configured yet.</p>
              <p className="text-sm">
                Add blanks using ___ in your question or click &quot;Add
                Blank&quot; button.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {question?.question && !isEditing && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: getBlankPreview(question.question),
              }}
            />
            <div className="mt-4 text-sm text-muted-foreground space-y-1">
              {detectedBlanks.length > 0 && (
                <p>
                  Detected {detectedBlanks.length} blank(s) from question text.
                </p>
              )}
              <p>Total blanks: {question.blanks.length}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
