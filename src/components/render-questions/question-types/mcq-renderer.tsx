import React from "react";
import { MCQQuestion, QuestionConfig, MCQAnswer, MCQOption } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface MCQRendererProps {
  question: MCQQuestion;
  config: QuestionConfig;
  onAnswerChange?: (answer: MCQAnswer) => void;
}

export const MCQRenderer: React.FC<MCQRendererProps> = ({
  question,
  config,
  onAnswerChange,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string>("");

  React.useEffect(() => {
    if (config.userAnswers && "selectedOption" in config.userAnswers) {
      setSelectedOption(config.userAnswers.selectedOption);
    }
  }, [config.userAnswers]);

  const handleSelectionChange = (value: string) => {
    if (config.readOnly) return;

    setSelectedOption(value);
    if (onAnswerChange) {
      onAnswerChange({ selectedOption: value });
    }
  };

  const displayOptions = config.shuffleOptions
    ? [...((question as any).options || (question as any).choices || [])].sort(
        () => Math.random() - 0.5,
      )
    : (question as any).options || (question as any).choices || [];

  if (!displayOptions || displayOptions.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No options available for this question.
      </div>
    );
  }

  const getOptionKey = (option: MCQOption, index: number): string => {
    return option.id && option.id.trim() ? option.id : `option-${index}`;
  };

  const getOptionClass = (option: MCQOption, index: number) => {
    const optionKey = getOptionKey(option, index);
    const isSelected = selectedOption === optionKey;
    const isCorrect = option.isCorrect;
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

  const getOptionIcon = (option: MCQOption, index: number) => {
    const optionKey = getOptionKey(option, index);
    const isSelected = selectedOption === optionKey;
    const isCorrect = option.isCorrect;
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
        value={selectedOption}
        onValueChange={handleSelectionChange}
        disabled={config.readOnly}
      >
        {displayOptions.map((option: any, index: number) => {
          const optionKey = getOptionKey(option, index);
          const optionIcon = getOptionIcon(option, index);

          return (
            <div
              key={optionKey}
              className={cn(
                "border rounded-lg p-3 transition-colors",
                getOptionClass(option, index),
              )}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value={optionKey}
                  id={optionKey}
                  disabled={config.readOnly}
                  className="mt-1 flex-shrink-0"
                />
                <Label
                  htmlFor={optionKey}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <ContentPreview
                        content={option.text}
                        className="border-none p-0 bg-transparent"
                        noProse={true}
                      />
                    </div>
                    {optionIcon && (
                      <div className="flex-shrink-0 mt-1">{optionIcon}</div>
                    )}
                  </div>
                </Label>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};
