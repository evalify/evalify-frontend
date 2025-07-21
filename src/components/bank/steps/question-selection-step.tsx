"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce } from "@/hooks/use-debounce";
import { BankQuestion } from "@/repo/bank/bank";
import { Question, QuestionTypes } from "@/components/render-questions/types";
import { QuestionRenderer } from "@/components/render-questions/question-renderer-fixed";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/ui/search-input";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  CheckCircle,
  X,
  ListChecks,
  AlertCircle,
  FileQuestion,
} from "lucide-react";

interface QuestionSelectionStepProps {
  questions: BankQuestion[];
  onAddQuestions: (selectedQuestions: BankQuestion[]) => void;
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const questionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export function QuestionSelectionStep({
  questions,
  onAddQuestions,
  isLoading,
}: QuestionSelectionStepProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const convertToQuestion = (bankQuestion: BankQuestion): Question => {
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
      if (selected) {
        return prev.includes(questionId) ? prev : [...prev, questionId];
      } else {
        return prev.filter((selectedId) => selectedId !== questionId);
      }
    });
  };

  const handleSelectAll = (checked?: boolean | "indeterminate") => {
    if (checked === true) {
      const allQuestionIds = filteredQuestions.map((q) => q.id);
      setSelectedQuestions(allQuestionIds);
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedQuestions([]);
  };

  const handleAddSelected = () => {
    const selectedQuestionObjects = questions.filter((q) =>
      selectedQuestions.includes(q.id),
    );
    onAddQuestions(selectedQuestionObjects);
  };

  const selectedCount = selectedQuestions.length;
  const totalCount = filteredQuestions.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
        </motion.div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select Questions</h2>
        <p className="text-muted-foreground">
          Choose the questions you want to add to your quiz
        </p>
      </div>

      {/* Questions Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Available Questions ({totalCount})
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedCount > 0 && (
                <>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {selectedCount} selected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                size="sm"
                className="shrink-0"
              >
                Clear
              </Button>
            )}
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
              {selectedCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedCount} of {totalCount} selected
                </span>
              )}
            </div>
          )}

          <Separator />

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
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {items.map((virtualItem) => {
                  const question = filteredQuestions[virtualItem.index];
                  const isSelected = selectedQuestions.includes(question.id);

                  return (
                    <motion.div
                      key={virtualItem.key}
                      ref={virtualizer.measureElement}
                      variants={questionVariants}
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
                          isSelected ? "bg-accent/50" : "hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center pt-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                handleQuestionSelect(
                                  question.id,
                                  Boolean(checked),
                                );
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
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
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Questions Summary */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileQuestion className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {selectedCount} Question{selectedCount !== 1 ? "s" : ""}{" "}
                        Selected
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ready to add to your quiz
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleClearSelection}
                      size="sm"
                      disabled={isLoading}
                    >
                      Clear Selection
                    </Button>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        onClick={handleAddSelected}
                        size="sm"
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Adding Questions...
                          </>
                        ) : (
                          <>
                            Add {selectedCount} Question
                            {selectedCount !== 1 ? "s" : ""}
                            <CheckCircle className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
