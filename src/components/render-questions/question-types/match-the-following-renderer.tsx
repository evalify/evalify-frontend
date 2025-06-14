import React from "react";
import {
  MatchTheFollowingQuestion,
  QuestionConfig,
  MatchTheFollowingAnswer,
} from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface MatchTheFollowingRendererProps {
  question: MatchTheFollowingQuestion;
  config: QuestionConfig;
  onAnswerChange?: (answer: MatchTheFollowingAnswer) => void;
}

export const MatchTheFollowingRenderer: React.FC<
  MatchTheFollowingRendererProps
> = ({ question, config, onAnswerChange }) => {
  const [matches, setMatches] = React.useState<{ [leftId: string]: string }>(
    {},
  );

  // Initialize matches from config if provided (for display mode)
  React.useEffect(() => {
    if (config.userAnswers && "matches" in config.userAnswers) {
      setMatches(config.userAnswers.matches);
    }
  }, [config.userAnswers]);

  const handleMatchChange = (leftId: string, rightId: string) => {
    if (config.readOnly) return;

    const newMatches = { ...matches, [leftId]: rightId };
    setMatches(newMatches);
    if (onAnswerChange) {
      onAnswerChange({ matches: newMatches });
    }
  };

  // Shuffle right options if required (but maintain original order in display mode)
  const rightOptions = React.useMemo(() => {
    if (config.shuffleOptions && !config.showCorrectAnswers) {
      return [...question.keys].sort(() => Math.random() - 0.5);
    }
    return question.keys;
  }, [question.keys, config.shuffleOptions, config.showCorrectAnswers]);

  // Generate key for match pairs
  const getPairKey = (
    pair: (typeof question.keys)[0],
    index: number,
  ): string => {
    return pair.id || `pair-${index}`;
  };

  const isMatchCorrect = (leftId: string) => {
    const correctPair = question.keys.find(
      (pair, index) => getPairKey(pair, index) === leftId,
    );
    return (
      correctPair &&
      matches[leftId] ===
        getPairKey(correctPair, question.keys.indexOf(correctPair))
    );
  };

  const getRowClass = (leftId: string) => {
    if (config.showCorrectAnswers) {
      return isMatchCorrect(leftId)
        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        : matches[leftId]
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          : "border-gray-200 dark:border-gray-700";
    }
    return "border-gray-200 dark:border-gray-700";
  };
  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Match the items from the left column with the appropriate items from the
        right column.
      </div>

      {/* Display mode with correct answers shown directly */}
      {config.showCorrectAnswers ? (
        <div className="space-y-6">
          {/* Correct Matches Display */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
              Correct Matches:
            </h4>
            <div className="space-y-3">
              {question.keys.map((pair, index) => {
                const pairKey = getPairKey(pair, index);
                return (
                  <div
                    key={pairKey}
                    className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded border"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Badge
                        variant="outline"
                        className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                      >
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <ContentPreview
                          content={pair.leftPair}
                          className="border-none p-0 bg-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex-1">
                      <ContentPreview
                        content={pair.rightPair}
                        className="border-none p-0 bg-transparent text-sm"
                      />
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Answers Display */}
          {Object.keys(matches).length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Your Answers:
              </h4>
              <div className="space-y-2">
                {question.keys.map((pair, index) => {
                  const pairKey = getPairKey(pair, index);
                  const userAnswer = matches[pairKey];
                  const correctAnswer = question.keys.find(
                    (p, i) => getPairKey(p, i) === userAnswer,
                  );
                  const isCorrect = isMatchCorrect(pairKey);

                  return (
                    <div
                      key={pairKey}
                      className={cn(
                        "flex items-center gap-4 p-2 rounded text-sm",
                        isCorrect
                          ? "text-green-800 bg-green-100 dark:bg-green-900/20"
                          : "text-red-800 bg-red-100 dark:bg-red-900/20",
                      )}
                    >
                      <Badge
                        variant="outline"
                        className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                      >
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <ContentPreview
                          content={pair.leftPair}
                          className="border-none p-0 bg-transparent text-xs"
                        />
                      </div>
                      <div className="w-6 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex-1">
                        {userAnswer ? (
                          <ContentPreview
                            content={correctAnswer?.rightPair || "No answer"}
                            className="border-none p-0 bg-transparent text-xs"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">
                            No answer
                          </span>
                        )}
                      </div>
                      {isCorrect ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Interactive matching interface for edit mode */
        <div className="space-y-3">
          {question.keys.map((pair, index) => {
            const pairKey = getPairKey(pair, index);
            return (
              <div
                key={pairKey}
                className={cn(
                  "border rounded-lg p-4 transition-colors",
                  getRowClass(pairKey),
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Left item */}
                  <div className="md:col-span-5">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="flex-shrink-0 mt-1">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <ContentPreview
                          content={pair.leftPair}
                          className="border-none p-0 bg-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Connector */}
                  <div className="md:col-span-1 flex justify-center items-center">
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  {/* Right selection */}
                  <div className="md:col-span-5">
                    <Select
                      value={matches[pairKey] || ""}
                      onValueChange={(value) =>
                        handleMatchChange(pairKey, value)
                      }
                      disabled={config.readOnly}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select match..." />
                      </SelectTrigger>
                      <SelectContent>
                        {rightOptions.map((option, optionIndex) => {
                          const optionKey = getPairKey(option, optionIndex);
                          return (
                            <SelectItem key={optionKey} value={optionKey}>
                              <ContentPreview
                                content={option.rightPair}
                                className="border-none p-0 bg-transparent text-sm"
                              />
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Status indicator */}
                  <div className="md:col-span-1 flex justify-center">
                    {config.showCorrectAnswers && matches[pairKey] && (
                      <>
                        {isMatchCorrect(pairKey) ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
