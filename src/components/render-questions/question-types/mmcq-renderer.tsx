import React from "react";
import { MMCQQuestion, QuestionConfig, MMCQAnswer, MCQOption } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface MMCQRendererProps {
  question: MMCQQuestion;
  config: QuestionConfig;
  onAnswerChange?: (answer: MMCQAnswer) => void;
}

/**
 * MMCQ (Multiple Multiple Choice Question) Renderer Component
 * Renders Multiple Choice Questions with multiple selection allowed
 */
export const MMCQRenderer: React.FC<MMCQRendererProps> = ({
  question,
  config,
  onAnswerChange,
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (config.userAnswers && "selectedOptions" in config.userAnswers) {
      setSelectedOptions(config.userAnswers.selectedOptions);
    }
  }, [config.userAnswers]);

  /**
   * Handle option selection change
   */
  const handleSelectionChange = (optionKey: string, checked: boolean) => {
    if (config.readOnly) return;

    const newSelectedOptions = checked
      ? [...selectedOptions, optionKey]
      : selectedOptions.filter((key) => key !== optionKey);

    setSelectedOptions(newSelectedOptions);

    if (onAnswerChange) {
      onAnswerChange({ selectedOptions: newSelectedOptions });
    }
  };

  /**
   * Get options to display (shuffled or original order)
   */
  const displayOptions = React.useMemo(() => {
    if (config.shuffleOptions && !config.showCorrectAnswers) {
      return [...(question.options || [])].sort(() => Math.random() - 0.5);
    }
    return question.options || [];
  }, [question.options, config.shuffleOptions, config.showCorrectAnswers]);

  /**
   * Get unique option key for each option
   */
  const getOptionKey = (option: MCQOption, index: number): string => {
    return option.id || `option-${index}`;
  };

  /**
   * Get CSS classes for option styling based on state
   */
  const getOptionClass = (option: MCQOption, index: number) => {
    const optionKey = getOptionKey(option, index);
    const isSelected = selectedOptions.includes(optionKey);
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

  /**
   * Get icon to display for option (check/x based on correctness)
   */
  const getOptionIcon = (option: MCQOption, index: number) => {
    const optionKey = getOptionKey(option, index);
    const isSelected = selectedOptions.includes(optionKey);
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

  // Handle empty options
  if (!displayOptions || displayOptions.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No options available for this question.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Select all correct options. Multiple answers may be correct.
      </div>

      {displayOptions.map((option: MCQOption, index: number) => {
        const optionKey = getOptionKey(option, index);
        const optionIcon = getOptionIcon(option, index);
        const isSelected = selectedOptions.includes(optionKey);

        return (
          <div
            key={optionKey}
            className={cn(
              "border rounded-lg p-3 transition-colors",
              getOptionClass(option, index),
            )}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={optionKey}
                checked={isSelected}
                onCheckedChange={(checked) =>
                  handleSelectionChange(optionKey, checked as boolean)
                }
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
    </div>
  );
};
