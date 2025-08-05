"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce } from "@/hooks/use-debounce";
import { BankQuestion as RepoBankQuestion } from "@/repo/bank/bank";
import { Question, QuestionTypes } from "@/components/render-questions/types";
import { QuestionRenderer } from "@/components/render-questions/question-renderer";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/ui/search-input";

// Icons
import { CheckCircle, X, ListChecks, AlertCircle } from "lucide-react";

interface QuestionSelectionComponentProps {
  questions: RepoBankQuestion[];
  onQuestionsSelected: (selectedQuestions: RepoBankQuestion[]) => void;
  selectedQuestions?: RepoBankQuestion[];
}

export function QuestionSelectionComponent({
  questions,
  onQuestionsSelected,
  selectedQuestions: initialSelectedQuestions = [],
}: QuestionSelectionComponentProps) {
  // If no initial selection is provided, select all questions by default
  const defaultSelection =
    initialSelectedQuestions.length > 0
      ? initialSelectedQuestions
          .map((q) => q.id)
          .filter((id): id is string => !!id)
      : questions.map((q) => q.id).filter((id): id is string => !!id);

  const [selectedQuestions, setSelectedQuestions] =
    useState<string[]>(defaultSelection);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastQuestionIds, setLastQuestionIds] = useState<string>("");
  const parentRef = useRef<HTMLDivElement>(null);
  const onQuestionsSelectedRef = useRef(onQuestionsSelected);

  // Update ref when prop changes
  useEffect(() => {
    onQuestionsSelectedRef.current = onQuestionsSelected;
  }, [onQuestionsSelected]);

  // Update parent when selectedQuestions change (after state is committed)
  useEffect(() => {
    if (lastQuestionIds) {
      // Only update if we've been initialized
      const selectedQuestionObjects = questions.filter(
        (q) => q.id && selectedQuestions.includes(q.id),
      );
      // Use setTimeout to ensure this runs after the current render cycle
      const timeoutId = setTimeout(() => {
        onQuestionsSelectedRef.current(selectedQuestionObjects);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedQuestions, questions, lastQuestionIds]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Track question IDs to detect when new questions are loaded
  const currentQuestionIds = useMemo(() => {
    return questions
      .map((q) => q.id)
      .filter((id): id is string => !!id)
      .sort()
      .join(",");
  }, [questions]);

  // Initialize selection when questions change (new fetch)
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIds !== lastQuestionIds) {
      const newDefaultSelection = questions
        .map((q) => q.id)
        .filter((id): id is string => !!id);
      setSelectedQuestions(newDefaultSelection);
      setLastQuestionIds(currentQuestionIds);
      // Parent update will be handled by the selectedQuestions effect
    }
  }, [currentQuestionIds, lastQuestionIds, questions]);

  // Filter questions based on search query
  const filteredQuestions = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return questions;

    const query = debouncedSearchQuery.toLowerCase();
    return questions.filter(
      (question) =>
        question.question?.toLowerCase().includes(query) ||
        question.explanation?.toLowerCase().includes(query) ||
        question.topics?.some((topic) =>
          topic.name?.toLowerCase().includes(query),
        ),
    );
  }, [questions, debouncedSearchQuery]);

  // Virtualization for questions list
  const virtualizer = useVirtualizer({
    count: filteredQuestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 250,
    overscan: 3,
    getItemKey: (index) =>
      `question-${index}-${filteredQuestions[index]?.id || index}`,
  });

  const items = virtualizer.getVirtualItems();

  const convertToQuestion = (bankQuestion: RepoBankQuestion): Question => {
    return {
      ...bankQuestion,
      type: bankQuestion.type as QuestionTypes,
      difficulty: bankQuestion.difficulty || "MEDIUM",
      bloomsTaxonomy: bankQuestion.bloomsTaxonomy || "REMEMBER",
      co: bankQuestion.co || 1,
      marks: bankQuestion.marks || 1,
      ...(bankQuestion.type === "MCQ" && { options: [] }),
      ...(bankQuestion.type === "MMCQ" && { options: [] }),
      ...(bankQuestion.type === "TRUEFALSE" && { answers: false }),
      ...(bankQuestion.type === "FILL_UP" && { blanks: [] }),
      ...(bankQuestion.type === "MATCH_THE_FOLLOWING" && { keys: [] }),
      ...(bankQuestion.type === "CODING" && { testcases: [] }),
    } as Question;
  };

  const handleQuestionSelect = (questionId: string, selected: boolean) => {
    setSelectedQuestions((prev) => {
      const newSelection = selected
        ? prev.includes(questionId)
          ? prev
          : [...prev, questionId]
        : prev.filter((selectedId) => selectedId !== questionId);

      return newSelection;
    });
  };

  const handleSelectAll = (checked?: boolean | "indeterminate") => {
    if (checked === true) {
      const allQuestionIds = filteredQuestions
        .map((q) => q.id)
        .filter((id): id is string => !!id);
      setSelectedQuestions(allQuestionIds);
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedQuestions([]);
  };

  const selectedCount = selectedQuestions.length;
  const totalCount = questions.length; // Use total questions, not filtered
  const filteredCount = filteredQuestions.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 text-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No Questions Found</h3>
          <p className="text-muted-foreground max-w-md">
            No questions were found with the applied filters. Try adjusting your
            filter criteria to find questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Questions Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Available Questions ({totalCount}
              {searchQuery &&
                filteredCount !== totalCount &&
                `, ${filteredCount} filtered`}
              )
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedCount > 0 && (
                <>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {selectedCount} selected
                  </Badge>
                  <button
                    onClick={handleClearSelection}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Selection Controls */}
          <div className="flex gap-2">
            <SearchInput
              placeholder="Search questions, explanations, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="flex-1"
            />
          </div>

          {/* Selection Controls */}
          {totalCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={
                    isAllSelected
                      ? true
                      : isIndeterminate
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="cursor-pointer text-sm">
                  Select all questions
                  {searchQuery && " (filtered)"}
                </Label>
              </div>
              <div className="flex items-center gap-4">
                {selectedCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {selectedCount} of {totalCount} selected
                    {searchQuery &&
                      filteredCount !== totalCount &&
                      ` (${filteredQuestions.filter((q) => q.id && selectedQuestions.includes(q.id)).length} visible)`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Questions List */}
          {totalCount === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery
                ? "No questions match your search criteria"
                : "No questions found with current filters"}
            </div>
          ) : (
            <div
              ref={parentRef}
              className="h-[500px] overflow-auto border rounded-lg bg-background"
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {items.map((virtualItem) => {
                  const question = filteredQuestions[virtualItem.index];
                  const isSelected = question.id
                    ? selectedQuestions.includes(question.id)
                    : false;

                  return (
                    <div
                      key={virtualItem.key}
                      ref={virtualizer.measureElement}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      data-index={virtualItem.index}
                    >
                      <div
                        className={`p-4 border-b border-border/20 transition-colors ${
                          isSelected
                            ? "bg-accent/50 border-l-4 border-l-primary"
                            : "hover:bg-muted/30 border-l-4 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex items-center pt-2 transition-all ${
                              isSelected ? "opacity-100" : "opacity-70"
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (question.id) {
                                  handleQuestionSelect(
                                    question.id,
                                    Boolean(checked),
                                  );
                                }
                              }}
                            />
                          </div>
                          <div
                            className={`flex-1 min-w-0 transition-all ${
                              isSelected ? "opacity-100" : "opacity-85"
                            }`}
                          >
                            <QuestionRenderer
                              question={convertToQuestion(question)}
                              questionNumber={virtualItem.index + 1}
                              config={{
                                mode: "display",
                                showActions: false,
                                showMarks: true,
                                showDifficulty: true,
                                showBloomsTaxonomy: true,
                                showTopics: true,
                                showExplanation: true,
                                showCorrectAnswers: true,
                                readOnly: true,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sticky Selection Summary */}
      {selectedCount > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  {selectedCount} question{selectedCount !== 1 ? "s" : ""}{" "}
                  selected
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Ready to add to your quiz
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              >
                {selectedCount} / {totalCount}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
