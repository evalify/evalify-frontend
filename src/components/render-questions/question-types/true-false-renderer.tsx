import React from "react";
import { TrueFalseQuestion, QuestionConfig, TrueFalseAnswer } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface TrueFalseRendererProps {
  question: TrueFalseQuestion;
  config: QuestionConfig;
  onAnswerChange?: (answer: TrueFalseAnswer) => void;
}

export const TrueFalseRenderer: React.FC<TrueFalseRendererProps> = ({
  question,
  config,
  onAnswerChange,
}) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState<boolean | null>(
    null,
  );

  // Load user answers if available
  React.useEffect(() => {
    if (config.userAnswers && "answer" in config.userAnswers) {
      setSelectedAnswer(config.userAnswers.answer);
    }
  }, [config.userAnswers]);

  const handleSelectionChange = (value: string) => {
    if (config.readOnly) return;

    const answer = value === "true";
    setSelectedAnswer(answer);
    if (onAnswerChange) {
      onAnswerChange({ answer });
    }
  };
  const getOptionClass = (isTrue: boolean) => {
    const isSelected = selectedAnswer === isTrue;
    const isCorrect = question.answers === isTrue;
    const showingAnswers =
      config.showCorrectAnswers || config.highlightCorrectness;

    if (showingAnswers) {
      if (isCorrect && isSelected) {
        // User selected correct answer
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      }
      if (isCorrect && !isSelected) {
        // Correct answer not selected
        return "border-green-300 bg-green-25 dark:bg-green-900/10";
      }
      if (!isCorrect && isSelected) {
        // User selected wrong answer
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      }
    }
    return isSelected
      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
      : "border-gray-200 dark:border-gray-700";
  };

  const getOptionIcon = (isTrue: boolean) => {
    const isSelected = selectedAnswer === isTrue;
    const isCorrect = question.answers === isTrue;
    const showingAnswers =
      config.showCorrectAnswers || config.highlightCorrectness;

    if (showingAnswers) {
      if (isCorrect) {
        return <Check className="w-4 h-4 text-green-600" />;
      }
      if (!isCorrect && isSelected) {
        return <X className="w-4 h-4 text-red-600" />;
      }
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <RadioGroup
        value={selectedAnswer?.toString() || ""}
        onValueChange={handleSelectionChange}
        disabled={config.readOnly}
      >
        {/* True Option */}
        <div
          className={cn(
            "border rounded-lg p-4 transition-colors",
            getOptionClass(true),
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value="true"
                id="true"
                disabled={config.readOnly}
              />
              <Label
                htmlFor="true"
                className="text-lg font-medium cursor-pointer"
              >
                True
              </Label>
            </div>
            {(config.showCorrectAnswers || config.highlightCorrectness) && (
              <div className="flex-shrink-0">{getOptionIcon(true)}</div>
            )}
          </div>
        </div>

        {/* False Option */}
        <div
          className={cn(
            "border rounded-lg p-4 transition-colors",
            getOptionClass(false),
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value="false"
                id="false"
                disabled={config.readOnly}
              />
              <Label
                htmlFor="false"
                className="text-lg font-medium cursor-pointer"
              >
                False
              </Label>
            </div>
            {(config.showCorrectAnswers || config.highlightCorrectness) && (
              <div className="flex-shrink-0">{getOptionIcon(false)}</div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};
