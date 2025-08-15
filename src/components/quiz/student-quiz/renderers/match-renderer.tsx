/**
 * Redesigned Match the Following Question Renderer with Drag and Drop
 * Supports multiple right pairs per left item
 */

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, ArrowRight, Check } from "lucide-react";
import { MatchQuestion, MatchAnswer } from "../types/quiz-types";

interface MatchRendererProps {
  questionId: string;
  questionData: MatchQuestion;
  currentAnswer: MatchAnswer[] | null;
  onAnswerChange: (answer: MatchAnswer[]) => void;
  isReadOnly?: boolean;
  className?: string;
}

export const MatchRenderer: React.FC<MatchRendererProps> = ({
  questionData,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  className = "",
}) => {
  const [draggedItem, setDraggedItem] = useState<{
    type: "left" | "right";
    id: string;
    content: string;
  } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const matches = currentAnswer || [];

  const handleDragStart = (
    e: React.DragEvent,
    type: "left" | "right",
    id: string,
    content: string,
  ) => {
    if (isReadOnly) return;

    setDraggedItem({ type, id, content });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");

    // Add drag styling
    const target = e.target as HTMLElement;
    target.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDropTarget(null);

    // Remove drag styling
    const target = e.target as HTMLElement;
    target.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    if (isReadOnly || !draggedItem) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(targetId);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (
    e: React.DragEvent,
    targetType: "left" | "right",
    targetId: string,
  ) => {
    if (isReadOnly || !draggedItem) return;

    e.preventDefault();
    setDropTarget(null);

    // Don't allow dropping on same type or same item
    if (draggedItem.type === targetType || draggedItem.id === targetId) {
      setDraggedItem(null);
      return;
    }

    // Create new match based on drag direction
    let newMatch: MatchAnswer;
    if (draggedItem.type === "left" && targetType === "right") {
      newMatch = { leftPairId: draggedItem.id, rightPairId: targetId };
    } else if (draggedItem.type === "right" && targetType === "left") {
      newMatch = { leftPairId: targetId, rightPairId: draggedItem.id };
    } else {
      setDraggedItem(null);
      return;
    }

    // Check if this exact match already exists
    const matchExists = matches.some(
      (match) =>
        match.leftPairId === newMatch.leftPairId &&
        match.rightPairId === newMatch.rightPairId,
    );

    if (!matchExists) {
      const updatedMatches = [...matches, newMatch];
      onAnswerChange(updatedMatches);
    }

    setDraggedItem(null);
  };

  const removeMatch = (leftId: string, rightId: string) => {
    if (isReadOnly) return;

    const updatedMatches = matches.filter(
      (match) =>
        !(match.leftPairId === leftId && match.rightPairId === rightId),
    );
    onAnswerChange(updatedMatches);
  };

  const getMatchesForLeft = (leftId: string) => {
    return matches.filter((match) => match.leftPairId === leftId);
  };

  const getMatchesForRight = (rightId: string) => {
    return matches.filter((match) => match.rightPairId === rightId);
  };

  const currentMatches = matches.length;

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="space-y-6">
        {/* Question Statement */}
        <div className="prose max-w-none">
          <p className="text-base">{questionData.question}</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Drag items from the left column to the right column to create
              matches
            </li>
            <li>• You can create multiple matches for each item</li>
            <li>• Click the X button to remove unwanted matches</li>
            <li>• Use the grip icon to drag items around</li>
          </ul>
        </div>

        {/* Matching Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-3">
            <h4 className="font-medium text-center text-sm text-muted-foreground border-b pb-2">
              Column A (Drag these items)
            </h4>
            {questionData.keyValues.left.map((leftPair) => {
              const matchCount = getMatchesForLeft(leftPair.id).length;
              return (
                <div
                  key={leftPair.id}
                  draggable={!isReadOnly}
                  onDragStart={(e) =>
                    handleDragStart(e, "left", leftPair.id, leftPair.text)
                  }
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, leftPair.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "left", leftPair.id)}
                  className={`
                                        relative p-4 border-2 rounded-lg cursor-move transition-all duration-200
                                        ${
                                          dropTarget === leftPair.id &&
                                          draggedItem?.type === "right"
                                            ? "border-blue-400 bg-blue-50 scale-105"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }
                                        ${matchCount > 0 ? "bg-green-50 border-green-200" : "bg-white"}
                                    `}
                >
                  <div className="flex items-center gap-3">
                    {!isReadOnly && (
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{leftPair.text}</p>
                      {matchCount > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            {matchCount} match{matchCount !== 1 ? "es" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show matches for this left item */}
                  {matchCount > 0 && (
                    <div className="mt-3 space-y-1">
                      {getMatchesForLeft(leftPair.id).map((match) => {
                        const rightPair = questionData.keyValues.right.find(
                          (rp) => rp.id === match.rightPairId,
                        );
                        return (
                          <div
                            key={`${match.leftPairId}-${match.rightPairId}`}
                            className="flex items-center justify-between text-xs bg-green-100 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <ArrowRight className="w-3 h-3 text-green-600" />
                              <span className="text-green-800">
                                {rightPair?.text}
                              </span>
                            </div>
                            {!isReadOnly && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeMatch(leftPair.id, match.rightPairId)
                                }
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <h4 className="font-medium text-center text-sm text-muted-foreground border-b pb-2">
              Column B (Drop here)
            </h4>
            {questionData.keyValues.right.map((rightPair) => {
              const matchCount = getMatchesForRight(rightPair.id).length;
              return (
                <div
                  key={rightPair.id}
                  draggable={!isReadOnly}
                  onDragStart={(e) =>
                    handleDragStart(e, "right", rightPair.id, rightPair.text)
                  }
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, rightPair.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, "right", rightPair.id)}
                  className={`
                                        relative p-4 border-2 rounded-lg cursor-move transition-all duration-200
                                        ${
                                          dropTarget === rightPair.id &&
                                          draggedItem?.type === "left"
                                            ? "border-blue-400 bg-blue-50 scale-105"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }
                                        ${matchCount > 0 ? "bg-green-50 border-green-200" : "bg-white"}
                                    `}
                >
                  <div className="flex items-center gap-3">
                    {!isReadOnly && (
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{rightPair.text}</p>
                      {matchCount > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            {matchCount} match{matchCount !== 1 ? "es" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Matches Created</span>
            <span>{currentMatches} total</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((currentMatches / Math.max(questionData.keyValues.left.length, 1)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Current Matches Summary */}
        {currentMatches > 0 && (
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-medium text-sm mb-3">
              Current Matches ({currentMatches}):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {matches.map((match, index) => {
                const leftPair = questionData.keyValues.left.find(
                  (lp) => lp.id === match.leftPairId,
                );
                const rightPair = questionData.keyValues.right.find(
                  (rp) => rp.id === match.rightPairId,
                );
                return (
                  <div
                    key={`${match.leftPairId}-${match.rightPairId}-${index}`}
                    className="flex items-center justify-between bg-white p-2 rounded border text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{leftPair?.text}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span>{rightPair?.text}</span>
                    </div>
                    {!isReadOnly && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeMatch(match.leftPairId, match.rightPairId)
                        }
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
