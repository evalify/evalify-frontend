import { TrueFalseQuestion } from "@/components/question-creation/question-types/true-false";
import { useEffect, useState, useCallback } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        negativeMarks: settings?.negativeMarks || 0,
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
          negativeMarks: settings.negativeMarks,
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
          <div className="flex gap-4">
            <Button
              variant={question?.answer === true ? "default" : "outline"}
              onClick={() => handleAnswerChange(true)}
              className={cn(
                "flex-1 h-16 text-lg font-medium transition-all duration-200",
                question?.answer === true
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                  : "hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950/20",
              )}
            >
              <Check className="h-5 w-5 mr-2" />
              True
            </Button>
            <Button
              variant={question?.answer === false ? "default" : "outline"}
              onClick={() => handleAnswerChange(false)}
              className={cn(
                "flex-1 h-16 text-lg font-medium transition-all duration-200",
                question?.answer === false
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                  : "hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20",
              )}
            >
              <X className="h-5 w-5 mr-2" />
              False
            </Button>
          </div>
          {question?.answer !== null && question?.answer !== undefined && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="text-sm font-medium text-muted-foreground">
                Selected Answer:
              </div>
              <div
                className={cn(
                  "text-lg font-semibold mt-1",
                  question.answer
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {question.answer ? "True" : "False"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
