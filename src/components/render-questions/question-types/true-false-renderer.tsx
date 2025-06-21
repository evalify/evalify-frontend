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
    if (config.showCorrectAnswers) {
      if (question.answer === isTrue) {
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      }
      if (selectedAnswer === isTrue && question.answer !== isTrue) {
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      }
    }
    return selectedAnswer === isTrue
      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
      : "border-gray-200 dark:border-gray-700";
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
            {config.showCorrectAnswers && (
              <div className="flex-shrink-0">
                {question.answer === true ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : selectedAnswer === true ? (
                  <X className="w-5 h-5 text-red-600" />
                ) : null}
              </div>
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
            {config.showCorrectAnswers && (
              <div className="flex-shrink-0">
                {question.answer === false ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : selectedAnswer === false ? (
                  <X className="w-5 h-5 text-red-600" />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};
