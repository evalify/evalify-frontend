import { TrueFalseQuestion } from "@/components/question-creation/question-types/true-false";
import { useEffect, useState, useCallback } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Check, X } from "lucide-react";
import { QuestionSettings } from "@/components/question-creation/settings-types/settings-types";
import { cn } from "@/lib/utils";

interface CreateTrueFalseQuestionProps {
  type: "TRUEFALSE";
  isEditing: boolean;
  questionId?: string;
  questionData?: TrueFalseQuestion;
  settings?: QuestionSettings;
  onSave?: (question: TrueFalseQuestion) => void;
}

export default function CreateTrueFalseQuestion({
  isEditing,
  questionData,
  settings,
  onSave,
}: CreateTrueFalseQuestionProps) {
  const [question, setQuestion] = useState<TrueFalseQuestion | null>(null);

  const createNewQuestion = useCallback(
    (questionText: string = ""): TrueFalseQuestion => {
      return {
        type: "TRUEFALSE",
        question: questionText,
        topicIds: settings?.topicIds || [],
        marks: settings?.marks || 1,
        difficulty: settings?.difficulty || "MEDIUM",
        bloomsTaxonomy: settings?.bloomsTaxonomy || "REMEMBER",
        co: settings?.co || 1,
        negativeMark: settings?.negativeMark || 0,
        answer: false,
      };
    },
    [settings],
  );

  useEffect(() => {
    if (question && onSave) {
      onSave(question);
    }
  }, [question, onSave]);

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
        return {
          ...prev,
          marks: settings.marks,
          difficulty: settings.difficulty,
          bloomsTaxonomy: settings.bloomsTaxonomy,
          co: settings.co,
          negativeMark: settings.negativeMark,
          topicIds: settings.topicIds,
        };
      });
    }
  }, [createNewQuestion, settings]);

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

  const handleAnswerChange = (answer: boolean) => {
    setQuestion((prev) => {
      if (!prev) {
        const newQuestion = createNewQuestion();
        return {
          ...newQuestion,
          answer,
        };
      }
      return {
        ...prev,
        answer,
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
            <Check className="h-5 w-5 text-primary" />
            Correct Answer
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Select the correct answer for this true/false question
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            {/* True Button */}
            <div
              onClick={() => handleAnswerChange(true)}
              className={cn(
                "flex-1 cursor-pointer rounded-lg p-4 transition-all duration-200 hover:shadow-sm",
                question?.answer === true
                  ? "bg-green-50 border-2 border-green-600 shadow-sm dark:bg-green-950/20 dark:border-green-500"
                  : "bg-green-50/30 hover:bg-green-50 dark:bg-green-950/10",
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200",
                    question?.answer === true
                      ? "bg-green-600 text-white dark:bg-green-500"
                      : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
                  )}
                >
                  <Check className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "font-medium transition-colors duration-200",
                    question?.answer === true
                      ? "text-green-800 dark:text-green-200"
                      : "text-green-700 dark:text-green-400",
                  )}
                >
                  True
                </span>
              </div>
            </div>

            {/* False Button */}
            <div
              onClick={() => handleAnswerChange(false)}
              className={cn(
                "flex-1 cursor-pointer rounded-lg p-4 transition-all duration-200 hover:shadow-sm",
                question?.answer === false
                  ? "bg-red-50 border-2 border-red-600 shadow-sm dark:bg-red-950/20 dark:border-red-500"
                  : "bg-red-50/30 hover:bg-red-50 dark:bg-red-950/10",
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200",
                    question?.answer === false
                      ? "bg-red-600 text-white dark:bg-red-500"
                      : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
                  )}
                >
                  <X className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "font-medium transition-colors duration-200",
                    question?.answer === false
                      ? "text-red-800 dark:text-red-200"
                      : "text-red-700 dark:text-red-400",
                  )}
                >
                  False
                </span>
              </div>
            </div>
          </div>

          {/* Selected Answer Summary */}
          {question?.answer !== null && question?.answer !== undefined && (
            <div
              className={cn(
                "p-3 rounded-lg border transition-colors duration-200",
                question.answer
                  ? "bg-green-50/50 border-green-200 dark:bg-green-950/10 dark:border-green-800"
                  : "bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-800",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Selected Answer:
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 font-medium",
                    question.answer
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300",
                  )}
                >
                  {question.answer ? (
                    <>
                      <Check className="h-4 w-4" />
                      True
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      False
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
