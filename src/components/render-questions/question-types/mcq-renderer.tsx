import React from "react";
import { MCQQuestion, QuestionConfig, MCQAnswer } from "../types";
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
      if (selectedOption === option.id && !option.isCorrect) {
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      }
    }
    return selectedOption === option.id
      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
      : "border-gray-200 dark:border-gray-700";
  };

  return (
    <div className="space-y-3">
      {" "}
      <RadioGroup
        value={selectedOption}
        onValueChange={handleSelectionChange}
        disabled={config.readOnly}
      >
        {" "}
        {displayOptions.map((option) => (
          <div
            key={option.id}
            className={cn(
              "border rounded-lg p-3 transition-colors",
              getOptionClass(option),
            )}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem
                value={option.id}
                id={option.id}
                disabled={config.readOnly}
                className="mt-1 flex-shrink-0"
              />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer min-w-0" // min-w-0 prevents overflow
              >
                {" "}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  {" "}
                  <div className="flex-1 min-w-0">
                    {" "}
                    {/* Ensure text can wrap */}
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
                      ) : selectedOption === option.id ? (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
