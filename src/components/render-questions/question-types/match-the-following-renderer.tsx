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

/**
 * Match the Following Question Renderer Component
 * Renders matching questions where users match left items to right items
 */
export const MatchTheFollowingRenderer: React.FC<
  MatchTheFollowingRendererProps
> = ({ question, config, onAnswerChange }) => {
  const [matches, setMatches] = React.useState<{
    [leftPairId: string]: string[];
  }>({});

  // Initialize matches from config if provided (for display mode)
  React.useEffect(() => {
    if (config.userAnswers && "matches" in config.userAnswers) {
      setMatches(config.userAnswers.matches);
    }
  }, [config.userAnswers]);

  /**
   * Handle match change for a left item
   */
  const handleMatchChange = (leftPairId: string, rightPairId: string) => {
    if (config.readOnly) return;

    const newMatches = { ...matches, [leftPairId]: [rightPairId] };
    setMatches(newMatches);
    if (onAnswerChange) {
      onAnswerChange({ matches: newMatches });
    }
  };

  /**
   * Get shuffled right options if required
   */
  const rightOptions = React.useMemo(() => {
    if (config.shuffleOptions && !config.showCorrectAnswers) {
      return [...question.keyValues.right].sort(() => Math.random() - 0.5);
    }
    return question.keyValues.right;
  }, [
    question.keyValues.right,
    config.shuffleOptions,
    config.showCorrectAnswers,
  ]);

  /**
   * Check if a match is correct
   */
  const isMatchCorrect = (leftPairId: string): boolean => {
    const userMatch = matches[leftPairId];
    if (!userMatch || userMatch.length === 0) return false;

    const correctMatch = question.matchPair.find(
      (pair) => pair.leftPair === leftPairId,
    );

    return correctMatch ? correctMatch.rightPair.includes(userMatch[0]) : false;
  };

  /**
   * Get CSS classes for row styling
   */
  const getRowClass = (leftPairId: string) => {
    if (config.showCorrectAnswers || config.highlightCorrectness) {
      return isMatchCorrect(leftPairId)
        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        : matches[leftPairId]
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
              {question.matchPair.map((pair, index) => {
                const leftItem = question.keyValues.left.find(
                  (item) => item.id === pair.leftPair,
                );
                const rightItems = pair.rightPair
                  .map((rightId) =>
                    question.keyValues.right.find(
                      (item) => item.id === rightId,
                    ),
                  )
                  .filter(Boolean);

                return (
                  <div
                    key={pair.leftPair}
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
                          content={leftItem?.text || ""}
                          className="border-none p-0 bg-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex-1">
                      {rightItems.map((rightItem) => (
                        <div key={rightItem?.id}>
                          <ContentPreview
                            content={rightItem?.text || ""}
                            className="border-none p-0 bg-transparent text-sm"
                          />
                        </div>
                      ))}
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
                {question.keyValues.left.map((leftItem, index) => {
                  const userAnswer = matches[leftItem.id];
                  const rightItem =
                    userAnswer && userAnswer.length > 0
                      ? question.keyValues.right.find(
                          (item) => item.id === userAnswer[0],
                        )
                      : null;
                  const isCorrect = isMatchCorrect(leftItem.id);

                  return (
                    <div
                      key={leftItem.id}
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
                          content={leftItem.text}
                          className="border-none p-0 bg-transparent text-xs"
                        />
                      </div>
                      <div className="w-6 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex-1">
                        {rightItem ? (
                          <ContentPreview
                            content={rightItem.text}
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
          {question.keyValues.left.map((leftItem, index) => {
            return (
              <div
                key={leftItem.id}
                className={cn(
                  "border rounded-lg p-4 transition-colors",
                  getRowClass(leftItem.id),
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
                          content={leftItem.text}
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
                      value={matches[leftItem.id]?.[0] || ""}
                      onValueChange={(value) =>
                        handleMatchChange(leftItem.id, value)
                      }
                      disabled={config.readOnly}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select match..." />
                      </SelectTrigger>
                      <SelectContent>
                        {rightOptions.map((rightItem) => (
                          <SelectItem key={rightItem.id} value={rightItem.id}>
                            <ContentPreview
                              content={rightItem.text}
                              className="border-none p-0 bg-transparent text-sm"
                            />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Status indicator */}
                  <div className="md:col-span-1 flex justify-center">
                    {(config.showCorrectAnswers ||
                      config.highlightCorrectness) &&
                      matches[leftItem.id] && (
                        <>
                          {isMatchCorrect(leftItem.id) ? (
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
