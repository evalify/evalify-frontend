/**
 * Redesigned Fill in the Blanks Question Renderer Component
 * Allows inline typing in question text blanks
 */

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FillUpQuestion, FillUpAnswer } from "../types/quiz-types";

interface FillUpRendererProps {
  questionData: FillUpQuestion;
  currentAnswer: FillUpAnswer[] | null;
  onAnswerChange: (answer: FillUpAnswer[]) => void;
  isReadOnly?: boolean;
  className?: string;
}

export const FillUpRenderer: React.FC<FillUpRendererProps> = ({
  questionData,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  className = "",
}) => {
  // Initialize local state with current answers or empty answers
  const [localAnswers, setLocalAnswers] = useState<FillUpAnswer[]>(() => {
    if (currentAnswer && currentAnswer.length > 0) return currentAnswer;

    return questionData.blankIds.map((blank) => ({
      id: String(blank.id),
      answer: null,
    }));
  });

  // Debounce the answer change to avoid too frequent updates
  const debouncedOnAnswerChange = useCallback(
    (answers: FillUpAnswer[]) => {
      onAnswerChange(answers);
    },
    [onAnswerChange],
  );

  const handleBlankChange = useCallback(
    (blankId: string, value: string) => {
      if (isReadOnly) return;

      const updatedAnswers = localAnswers.map((answer) =>
        answer.id === blankId
          ? { ...answer, answer: value.trim() || null }
          : answer,
      );

      setLocalAnswers(updatedAnswers);
      debouncedOnAnswerChange(updatedAnswers);
    },
    [isReadOnly, localAnswers, debouncedOnAnswerChange],
  );

  const getAnswerValue = useCallback(
    (blankId: string): string => {
      const answer = localAnswers.find((a) => a.id === blankId);
      return answer?.answer || "";
    },
    [localAnswers],
  );

  // Process the question text to insert input fields for blanks
  const renderQuestionWithBlanks = useMemo(() => {
    const questionText = questionData.question || "";

    // Create a map of blank IDs to their input elements
    const blankInputs: Record<string, React.ReactElement> = {};

    questionData.blankIds.forEach((blank) => {
      const blankId = String(blank.id);
      const value = getAnswerValue(blankId);

      blankInputs[`{${blankId}}`] = (
        <Input
          key={blankId}
          value={value}
          onChange={(e) => handleBlankChange(blankId, e.target.value)}
          placeholder="Type your answer"
          disabled={isReadOnly}
          className="inline-block w-32 h-8 mx-1 text-center border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-blue-500 focus:ring-0"
        />
      );
    });

    // Split text by blanks and insert input fields
    const parts = questionText.split(/(\{\d+\})/);

    return parts.map((part: string, index: number) => {
      if (blankInputs[part]) {
        return (
          <span key={index} className="inline-flex items-center">
            {blankInputs[part]}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }, [questionData, getAnswerValue, handleBlankChange, isReadOnly]);

  const filledBlanks = localAnswers.filter(
    (answer) => answer.answer !== null && answer.answer !== "",
  ).length;
  const totalBlanks = questionData.blankIds.length;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Fill in the Blanks
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {filledBlanks}/{totalBlanks} completed
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {questionData.marks} {questionData.marks === 1 ? "mark" : "marks"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Statement with Inline Inputs */}
        <div className="prose prose-lg max-w-none">
          <div className="leading-relaxed text-base">
            {renderQuestionWithBlanks}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Type your answers directly in the blank spaces above</li>
            <li>• Each blank can be filled with a word or phrase</li>
            <li>• Your answers are automatically saved as you type</li>
            <li>• Make sure to fill all blanks before proceeding</li>
          </ul>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>
              {filledBlanks} of {totalBlanks} blanks filled
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(filledBlanks / totalBlanks) * 100}%` }}
            />
          </div>
        </div>

        {/* Answer Summary */}
        {!isReadOnly && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Your Answers:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {questionData.blankIds.map((blank, index) => {
                const blankId = String(blank.id);
                const value = getAnswerValue(blankId);
                return (
                  <div key={blankId} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                      Blank {index + 1}:
                    </span>
                    <div className="flex-1">
                      {value ? (
                        <Badge variant="secondary" className="font-normal">
                          {value}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          Not filled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Validation */}
        {filledBlanks < totalBlanks && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Incomplete:</strong> Please fill in all {totalBlanks}{" "}
              blanks to complete this question.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
