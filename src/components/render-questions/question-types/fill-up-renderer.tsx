import React from "react";
import { FillUpQuestion, QuestionConfig, FillUpAnswer } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Lightbulb } from "lucide-react";

interface FillUpRendererProps {
  question: FillUpQuestion;
  config: QuestionConfig;
  onAnswerChange?: (answer: FillUpAnswer) => void;
}

export const FillUpRenderer: React.FC<FillUpRendererProps> = ({
  question,
  config,
  onAnswerChange,
}) => {
  const [answers, setAnswers] = React.useState<{ [blankId: string]: string }>(
    {},
  );

  // Initialize answers from config if provided (for display mode)
  React.useEffect(() => {
    if (config.userAnswers && "blanks" in config.userAnswers) {
      setAnswers(config.userAnswers.blanks);
    }
  }, [config.userAnswers]);

  const handleAnswerChange = (blankId: string, value: string) => {
    if (config.readOnly) return;

    const newAnswers = { ...answers, [blankId]: value };
    setAnswers(newAnswers);
    if (onAnswerChange) {
      onAnswerChange({ blanks: newAnswers });
    }
  };

  const isAnswerCorrect = (blankId: string, userAnswer: string) => {
    const blank = question.blanks.find((b) => b.id === blankId);
    if (!blank) return false;

    if (question.strictMatch) {
      return blank.answers.some(
        (answer) =>
          answer.toLowerCase().trim() === userAnswer.toLowerCase().trim(),
      );
    } else {
      return blank.answers.some(
        (answer) =>
          answer.toLowerCase().includes(userAnswer.toLowerCase().trim()) ||
          userAnswer.toLowerCase().trim().includes(answer.toLowerCase()),
      );
    }
  };

  const getInputClass = (blankId: string) => {
    if (config.showCorrectAnswers && answers[blankId]) {
      return isAnswerCorrect(blankId, answers[blankId])
        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
        : "border-red-500 bg-red-50 dark:bg-red-900/20";
    }
    return "";
  };

  return (
    <div className="space-y-4">
      {/* Template display if available */}
      {question.template && (
        <div className="mb-4">
          <ContentPreview
            content={question.template}
            className="border-none p-0 bg-transparent"
          />
        </div>
      )}
      {/* Individual blanks */}
      <div className="space-y-4">
        {question.blanks.map((blank, index) => (
          <div key={blank.id} className="space-y-2">
            <Label htmlFor={blank.id} className="text-sm font-medium">
              Blank {index + 1}
            </Label>
            {/* User Answer Section */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id={blank.id}
                  value={answers[blank.id] || ""}
                  onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
                  placeholder={`Enter answer for blank ${index + 1}`}
                  disabled={config.readOnly}
                  className={cn("pr-10", getInputClass(blank.id))}
                />
                {config.showCorrectAnswers && answers[blank.id] && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isAnswerCorrect(blank.id, answers[blank.id]) ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                )}
              </div>

              {/* Show user answer in student mode */}
              {config.mode === "student" && answers[blank.id] && (
                <div className="text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Your answer:</strong>
                    <span className="font-medium">{answers[blank.id]}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Expected answers in display modes */}
            {config.showCorrectAnswers && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                  Expected answer(s):
                </p>
                <div className="flex flex-wrap gap-1">
                  {blank.answers.map((answer, answerIndex) => (
                    <Badge
                      key={answerIndex}
                      variant="outline"
                      className="text-xs bg-green-100 dark:bg-green-800"
                    >
                      {answer}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Show explanation in student mode */}
      {config.mode === "student" && question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Explanation
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <ContentPreview
              content={question.explanation}
              className="border-none p-0 bg-transparent"
            />
          </div>
        </div>
      )}
      {/* Evaluation method indicator */}
      {!config.compact && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex gap-4">
          <span>Matching: {question.strictMatch ? "Strict" : "Flexible"}</span>
          {question.llmEval && <span>LLM Evaluation: Enabled</span>}
        </div>
      )}
    </div>
  );
};
