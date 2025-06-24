import React from "react";
import { MMCQQuestion, QuestionConfig, MMCQAnswer } from "../types";
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

export const MMCQRenderer: React.FC<MMCQRendererProps> = ({
  question,
  config,
  onAnswerChange,
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const handleSelectionChange = (optionId: string, checked: boolean) => {
    if (config.readOnly) return;

    const newSelection = checked
      ? [...selectedOptions, optionId]
      : selectedOptions.filter((id) => id !== optionId);

    setSelectedOptions(newSelection);
    if (onAnswerChange) {
      onAnswerChange({ selectedOptions: newSelection });
    }
  };

  // Load user answers if available
  React.useEffect(() => {
    if (config.userAnswers && "selectedOptions" in config.userAnswers) {
      setSelectedOptions(config.userAnswers.selectedOptions);
    }
  }, [config.userAnswers]);

  // Shuffle options if required (but maintain original order in display mode)
  const displayOptions = React.useMemo(() => {
    if (config.shuffleOptions && !config.showCorrectAnswers) {
      return [...question.options].sort(() => Math.random() - 0.5);
    }
    return question.options;
  }, [question.options, config.shuffleOptions, config.showCorrectAnswers]);

  const getOptionClass = (option: (typeof question.options)[0]) => {
    if (config.showCorrectAnswers) {
      if (option.isCorrect) {
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      }
      if (selectedOptions.includes(option.id) && !option.isCorrect) {
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      }
    }
    return selectedOptions.includes(option.id)
      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
      : "border-gray-200 dark:border-gray-700";
  };

  return (
    <div className="space-y-3">
      {displayOptions.map((option) => (
        <div
          key={option.id}
          className={cn(
            "border rounded-lg p-3 transition-colors",
            getOptionClass(option),
          )}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={(checked) =>
                handleSelectionChange(option.id, checked as boolean)
              }
              disabled={config.readOnly}
              className="mt-1 flex-shrink-0"
            />
            <Label
              htmlFor={option.id}
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
                {config.showCorrectAnswers && (
                  <div className="flex-shrink-0 sm:ml-2">
                    {option.isCorrect ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    ) : selectedOptions.includes(option.id) ? (
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    ) : null}
                  </div>
                )}
              </div>
            </Label>
          </div>
        </div>
      ))}
    </div>
  );
};
