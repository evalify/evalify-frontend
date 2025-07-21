"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Bank, { BankQuestion } from "@/repo/bank/bank";
import { QuestionTypes, Difficulty } from "@/components/render-questions/types";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import { Filter, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface FilterSelectionStepProps {
  bankId: string;
  quizId: string;
  sectionId: string;
  onQuestionsFiltered: (questions: BankQuestion[]) => void;
}

interface FilterEntity {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questionType: QuestionTypes;
  noOfQuestions: number;
  questions: BankQuestion[];
  isLoading: boolean;
}

const filterVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
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

export function FilterSelectionStep({
  bankId,
  quizId,
  sectionId,
  onQuestionsFiltered,
}: FilterSelectionStepProps) {
  const { success, error } = useToast();
  const [filters, setFilters] = useState<FilterEntity[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch topics for the bank
  const { data: topics } = useQuery({
    queryKey: ["bankTopics", bankId],
    queryFn: () => Bank.getBankTopics(bankId),
    enabled: !!bankId,
  });

  // Question type options
  const questionTypeOptions = Object.values(QuestionTypes).map((type) => ({
    value: type,
    label: type
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim(),
  }));

  // Difficulty options
  const difficultyOptions = Object.values(Difficulty).map((diff) => ({
    value: diff,
    label: diff.charAt(0) + diff.slice(1).toLowerCase(),
  }));

  const generateFilterId = () => {
    return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addFilterEntity = () => {
    const totalCombinations =
      (topics?.length || 0) *
      Object.values(Difficulty).length *
      Object.values(QuestionTypes).length;
    const usedCombinations = filters.filter(
      (e) => e.topic && e.difficulty && e.questionType,
    ).length;

    if (usedCombinations >= totalCombinations) {
      error("All possible combinations are already used");
      return;
    }

    const newFilter: FilterEntity = {
      id: generateFilterId(),
      topic: "",
      difficulty: Difficulty.MEDIUM,
      questionType: QuestionTypes.MCQ,
      noOfQuestions: 1,
      questions: [],
      isLoading: false,
    };
    setFilters((prev) => [...prev, newFilter]);
  };

  const removeFilterEntity = (filterId: string) => {
    setFilters((prev) => prev.filter((entity) => entity.id !== filterId));
  };

  const updateFilterEntity = (
    filterId: string,
    updates: Partial<FilterEntity>,
  ) => {
    setFilters((prev) => {
      const currentEntity = prev.find((e) => e.id === filterId);
      if (!currentEntity) return prev;

      const updatedEntity = { ...currentEntity, ...updates };

      // Check for complete duplicate
      if (
        updatedEntity.topic &&
        updatedEntity.difficulty &&
        updatedEntity.questionType
      ) {
        const isDuplicate = prev.some(
          (entity) =>
            entity.id !== filterId &&
            entity.topic === updatedEntity.topic &&
            entity.difficulty === updatedEntity.difficulty &&
            entity.questionType === updatedEntity.questionType,
        );

        if (isDuplicate) {
          const topic = topics?.find((t) => t.id === updatedEntity.topic);
          error(
            `This exact combination already exists: ${topic?.name} - ${updatedEntity.difficulty} - ${updatedEntity.questionType.replace(/_/g, " ")}`,
          );
          return prev;
        }
      }

      const updatedEntities = prev.map((entity) =>
        entity.id === filterId ? updatedEntity : entity,
      );

      // Auto-fetch questions if entity is complete
      if (updatedEntity.topic && updatedEntity.noOfQuestions > 0) {
        setTimeout(() => fetchQuestionsForFilter(filterId, updatedEntity), 100);
      }

      return updatedEntities;
    });
  };

  const fetchQuestionsForFilter = async (
    filterId: string,
    entity: FilterEntity,
  ) => {
    if (!entity.topic || entity.noOfQuestions <= 0) return;

    setFilters((prev) =>
      prev.map((e) => (e.id === filterId ? { ...e, isLoading: true } : e)),
    );

    try {
      const response = await Bank.getFilteredQuestions(
        [bankId],
        entity.noOfQuestions,
        [entity.difficulty],
        sectionId,
        quizId,
        [entity.topic],
        [entity.questionType],
      );

      const normalizedQuestions = response.map(
        (question: Record<string, unknown>) => ({
          ...question,
          id:
            (question.id as string) ||
            (question._id as string) ||
            (question.questionId as string) ||
            `temp_${Math.random()}`,
          _originalData: question,
        }),
      ) as BankQuestion[];

      setFilters((prev) =>
        prev.map((e) =>
          e.id === filterId
            ? { ...e, questions: normalizedQuestions, isLoading: false }
            : e,
        ),
      );
    } catch {
      error("Failed to fetch questions for filter");
      setFilters((prev) =>
        prev.map((e) => (e.id === filterId ? { ...e, isLoading: false } : e)),
      );
    }
  };

  const applyFilters = async () => {
    if (filters.length === 0) {
      error("Please add at least one filter");
      return;
    }

    const incompleteFilters = filters.filter(
      (entity) => !entity.topic || entity.noOfQuestions <= 0,
    );

    if (incompleteFilters.length > 0) {
      error("Please fill in all required fields for each filter");
      return;
    }

    const loadingFilters = filters.filter((entity) => entity.isLoading);
    if (loadingFilters.length > 0) {
      error("Please wait for all filters to finish loading");
      return;
    }

    setIsApplying(true);
    try {
      const allQuestions: BankQuestion[] = [];
      filters.forEach((entity) => {
        allQuestions.push(...entity.questions);
      });

      success(
        `Found ${allQuestions.length} questions from ${filters.length} filter(s)`,
      );
      onQuestionsFiltered(allQuestions);
    } catch {
      error("Failed to process questions");
    } finally {
      setIsApplying(false);
    }
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const allQuestionsCount = useMemo(() => {
    return filters.reduce((sum, filter) => sum + filter.questions.length, 0);
  }, [filters]);

  const hasValidFilters = useMemo(() => {
    return filters.some(
      (f) =>
        f.topic && f.difficulty && f.questionType && f.questions.length > 0,
    );
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Apply Question Filters</h2>
        <p className="text-muted-foreground">
          Create filters to find specific questions from the selected bank
        </p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Question Filters
            {allQuestionsCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {allQuestionsCount} questions found
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Entities */}
          <AnimatePresence>
            {filters.map((entity, index) => (
              <motion.div
                key={entity.id}
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="border rounded-lg p-4 bg-muted/30 relative"
              >
                {/* Loading overlay */}
                {entity.isLoading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      Fetching questions...
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">
                      Filter {index + 1}
                    </Label>
                    {entity.questions.length > 0 && (
                      <Badge variant="default" className="text-xs">
                        {entity.questions.length} questions
                      </Badge>
                    )}
                    {entity.topic &&
                      entity.difficulty &&
                      !entity.isLoading &&
                      entity.questions.length === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Ready to fetch
                        </Badge>
                      )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilterEntity(entity.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={entity.isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Topic Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm">Topic</Label>
                    <Select
                      value={entity.topic}
                      onValueChange={(value) =>
                        updateFilterEntity(entity.id, { topic: value })
                      }
                      disabled={entity.isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics?.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm">Difficulty</Label>
                    <Select
                      value={entity.difficulty}
                      onValueChange={(value) =>
                        updateFilterEntity(entity.id, {
                          difficulty: value as Difficulty,
                        })
                      }
                      disabled={entity.isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyOptions.map((difficulty) => (
                          <SelectItem
                            key={difficulty.value}
                            value={difficulty.value}
                          >
                            {difficulty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm">Question Type</Label>
                    <Select
                      value={entity.questionType}
                      onValueChange={(value) =>
                        updateFilterEntity(entity.id, {
                          questionType: value as QuestionTypes,
                        })
                      }
                      disabled={entity.isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypeOptions.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of Questions */}
                  <div className="space-y-2">
                    <Label className="text-sm">No. of Questions</Label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={entity.noOfQuestions}
                      onChange={(e) =>
                        updateFilterEntity(entity.id, {
                          noOfQuestions: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="1"
                      disabled={entity.isLoading}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Filter Button */}
          <div className="flex flex-col items-center gap-2">
            {(() => {
              const totalCombinations =
                (topics?.length || 0) *
                Object.values(Difficulty).length *
                Object.values(QuestionTypes).length;
              const usedCombinations = filters.filter(
                (e) => e.topic && e.difficulty && e.questionType,
              ).length;
              const canAddMore = usedCombinations < totalCombinations;

              return (
                <>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="outline"
                      onClick={addFilterEntity}
                      className="flex items-center gap-2"
                      disabled={!canAddMore}
                    >
                      <Plus className="h-4 w-4" />
                      {canAddMore ? "Add Filter" : "All combinations used"}
                    </Button>
                  </motion.div>
                  {!canAddMore && totalCombinations > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      You&apos;ve used all {totalCombinations} possible
                      topic-difficulty-type combinations
                    </p>
                  )}
                </>
              );
            })()}
          </div>

          {/* Filter Summary */}
          {filters.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Active Filters:</Label>
              <div className="flex flex-wrap gap-2">
                {filters.map((entity, index) => {
                  const topic = topics?.find((t) => t.id === entity.topic);
                  const hasQuestions = entity.questions.length > 0;
                  return (
                    <Badge
                      key={entity.id}
                      variant={hasQuestions ? "default" : "secondary"}
                      className="text-xs flex items-center gap-1"
                    >
                      {hasQuestions ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : entity.isLoading ? (
                        <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Filter {index + 1}: {entity.noOfQuestions}{" "}
                      {entity.difficulty.toLowerCase()}{" "}
                      {entity.questionType.replace(/_/g, " ").toLowerCase()}
                      {topic && ` from ${topic.name}`}
                      {hasQuestions && ` (${entity.questions.length})`}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <motion.div
              className="flex-1"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={applyFilters}
                disabled={
                  !hasValidFilters ||
                  isApplying ||
                  filters.some((entity) => entity.isLoading)
                }
                className="w-full"
              >
                {isApplying
                  ? "Processing..."
                  : filters.some((entity) => entity.isLoading)
                    ? "Waiting for filters..."
                    : `Continue with ${allQuestionsCount} Questions`}
              </Button>
            </motion.div>
            {filters.length > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={isApplying}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Start with basic filter */}
      {filters.length === 0 && (
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={addFilterEntity}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Your First Filter
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Start by adding a filter to find questions
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
