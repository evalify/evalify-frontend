"use client";

import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FillUpQuestion,
  FillUpAnswer,
  QuestionConfig,
  QuestionActions,
} from "../types";
import { cn } from "@/lib/utils";

/**
 * Props for FillUpRenderer component
 */
interface FillUpRendererProps {
  question: FillUpQuestion;
  config: QuestionConfig;
  actions?: QuestionActions;
  onAnswerChange?: (answer: FillUpAnswer) => void;
  questionNumber?: number;
  className?: string;
}

/**
 * Fill Up Question Renderer Component
 *
 * Renders fill-in-the-blank questions where students enter text for missing words/phrases.
 * The question text contains underscores (___) which are replaced with input fields.
 *
 * Features:
 * - Interactive text inputs for each blank
 * - Real-time answer change callbacks
 * - Support for multiple correct answers per blank
 * - Display of correct answers in review mode
 * - Strict/loose matching configuration
 * - Support for different blank types (STRING, INTEGER)
 *
 * @param question - The fill-up question data from backend
 * @param config - Display configuration and mode settings
 * @param actions - Optional action handlers (edit, delete, etc.)
 * @param onAnswerChange - Callback when user answers change
 * @param questionNumber - Optional question number for display
 * @param className - Additional CSS classes
 */
const FillUpRenderer: React.FC<FillUpRendererProps> = ({
  question,
  config,
  onAnswerChange,
  questionNumber,
  className,
}) => {
  // State for user answers (blank ID -> user input)
  const [userAnswers, setUserAnswers] = useState<{ [blankId: number]: string }>(
    () => {
      const initialAnswers: { [blankId: number]: string } = {};
      question.blanks.forEach((blank) => {
        initialAnswers[blank.id] = "";
      });
      return initialAnswers;
    },
  );

  /**
   * Handle input change for a specific blank
   */
  const handleInputChange = useCallback(
    (blankId: number, value: string) => {
      const newAnswers = {
        ...userAnswers,
        [blankId]: value,
      };
      setUserAnswers(newAnswers);

      // Trigger answer change callback
      if (onAnswerChange) {
        const answer: FillUpAnswer = {
          blanks: newAnswers,
          ...(config.mode === "review" && {
            correctBlanks: question.blanks.reduce(
              (acc, blank) => {
                acc[blank.id] = blank.answers;
                return acc;
              },
              {} as { [blankId: number]: string[] },
            ),
          }),
        };
        onAnswerChange(answer);
      }
    },
    [userAnswers, onAnswerChange, config.mode, question.blanks],
  );

  /**
   * Check if a user answer is correct for a given blank
   */
  const isAnswerCorrect = useCallback(
    (blankId: number, userAnswer: string): boolean => {
      const blank = question.blanks.find((b) => b.id === blankId);
      if (!blank) return false;

      const normalizedUserAnswer = question.strictMatch
        ? userAnswer.trim()
        : userAnswer.trim().toLowerCase();

      return blank.answers.some((correctAnswer) => {
        const normalizedCorrectAnswer = question.strictMatch
          ? correctAnswer.trim()
          : correctAnswer.trim().toLowerCase();
        return normalizedUserAnswer === normalizedCorrectAnswer;
      });
    },
    [question.blanks, question.strictMatch],
  );

  /**
   * Render question text with input fields for blanks
   */
  const renderQuestionWithBlanks = () => {
    // Sort blanks by their serial number to maintain order
    const sortedBlanks = [...question.blanks].sort((a, b) => a.sno - b.sno);

    const questionText = question.question;
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let blankIndex = 0;

    // Find all underscore patterns and replace with input fields
    const underscorePattern = /___+/g;
    let match;

    while (
      (match = underscorePattern.exec(questionText)) !== null &&
      blankIndex < sortedBlanks.length
    ) {
      const blank = sortedBlanks[blankIndex];

      // Add text before the blank
      if (match.index > currentIndex) {
        parts.push(
          <span key={`text-${blankIndex}-before`}>
            {questionText.substring(currentIndex, match.index)}
          </span>,
        );
      }

      // Add input field for the blank
      const userAnswer = userAnswers[blank.id] || "";
      const isCorrect =
        config.mode === "review" && userAnswer
          ? isAnswerCorrect(blank.id, userAnswer)
          : undefined;

      parts.push(
        <span
          key={`blank-${blank.id}`}
          className="inline-flex items-center mx-1"
        >
          <Input
            value={userAnswer}
            onChange={(e) => handleInputChange(blank.id, e.target.value)}
            placeholder={`Blank ${blank.sno}`}
            type={blank.type === "INTEGER" ? "number" : "text"}
            className={cn(
              "w-32 h-8 text-sm inline-block",
              config.readOnly && "bg-gray-50",
              config.mode === "review" &&
                isCorrect !== undefined &&
                (isCorrect
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"),
            )}
            disabled={config.readOnly || config.mode === "display"}
          />

          {/* Show correct answers in review mode */}
          {config.mode === "review" && config.showCorrectAnswers && (
            <div className="ml-2 text-xs text-gray-600">
              <span className="font-medium">Correct:</span>{" "}
              {blank.answers.join(" / ")}
            </div>
          )}
        </span>,
      );

      currentIndex = match.index + match[0].length;
      blankIndex++;
    }

    // Add remaining text after the last blank
    if (currentIndex < questionText.length) {
      parts.push(
        <span key={`text-${blankIndex}-after`}>
          {questionText.substring(currentIndex)}
        </span>,
      );
    }

    return parts;
  };

  return (
    <div className={cn("fill-up-question space-y-4", className)}>
      {/* Question Text with Blanks */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {questionNumber && (
            <span className="text-sm font-medium text-gray-600 mr-2">
              Q{questionNumber}.
            </span>
          )}
          <div className="text-base leading-relaxed">
            {renderQuestionWithBlanks()}
          </div>
        </div>

        {/* Marks Display */}
        {config.showMarks && (
          <Badge variant="secondary" className="ml-2">
            {question.marks} mark{question.marks !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Blanks Summary (for display/edit mode) */}
      {(config.mode === "display" || config.mode === "edit") &&
        question.blanks.length > 0 && (
          <div className=" p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blanks:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {question.blanks
                .sort((a, b) => a.sno - b.sno)
                .map((blank) => (
                  <div key={blank.id} className="text-xs p-2 rounded border">
                    <div className="font-medium">
                      Blank {blank.sno} ({blank.type})
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Answers: {blank.answers.join(", ")}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Additional Information */}
      <div className="space-y-2">
        {/* Hint */}
        {config.showHint && question.hint && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            <strong>Hint:</strong> {question.hint}
          </div>
        )}

        {/* Configuration Info */}
        {config.mode === "display" && (
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {question.strictMatch && (
              <Badge variant="outline" className="text-xs">
                Strict Matching
              </Badge>
            )}
            {question.llmEval && (
              <Badge variant="outline" className="text-xs">
                AI Evaluation
              </Badge>
            )}
            <span>
              {question.blanks.length} blank
              {question.blanks.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Topics */}
        {config.showTopics && question.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {question.topics.map((topic) => (
              <Badge key={topic.id} variant="outline" className="text-xs">
                {topic.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Difficulty and Bloom's Taxonomy */}
        {(config.showDifficulty || config.showBloomsTaxonomy) && (
          <div className="flex gap-2">
            {config.showDifficulty && (
              <Badge variant="secondary" className="text-xs">
                {question.difficulty}
              </Badge>
            )}
            {config.showBloomsTaxonomy && (
              <Badge variant="secondary" className="text-xs">
                {question.bloomsTaxonomy}
              </Badge>
            )}
          </div>
        )}

        {/* Explanation */}
        {config.showExplanation && question.explanation && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
            <strong>Explanation:</strong> {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default FillUpRenderer;
