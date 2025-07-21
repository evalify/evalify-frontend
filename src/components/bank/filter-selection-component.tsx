"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Check } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
// SearchableTopicDropdown and its types
interface Topic {
  id: string;
  name: string;
}

interface SearchableTopicDropdownProps {
  topics: Topic[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function SearchableTopicDropdown({
  topics,
  value,
  onChange,
  disabled,
}: SearchableTopicDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredTopics = useMemo(() => {
    if (!search) return topics;
    return topics.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [topics, search]);
  const selected = topics.find((t) => t.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selected ? selected.name : "Select topic"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[250px]">
        <div className="p-2">
          <SearchInput
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            autoFocus
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filteredTopics.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">
              No topics found
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <Button
                key={topic.id}
                variant="ghost"
                className={
                  "w-full justify-start px-3 py-2 text-left text-sm " +
                  (value === topic.id ? "bg-accent text-accent-foreground" : "")
                }
                onClick={() => {
                  onChange(topic.id);
                  setOpen(false);
                  setSearch("");
                }}
                disabled={disabled}
              >
                {topic.name}
                {value === topic.id && <Check className="ml-auto h-4 w-4" />}
              </Button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Bank, { BankQuestion } from "@/repo/bank/bank";
import { QuestionTypes, Difficulty } from "@/components/render-questions/types";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Filter, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface FilterEntity {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questionType: QuestionTypes;
  noOfQuestions: number;
  questions: BankQuestion[];
  isLoading: boolean;
}

interface FilterSelectionComponentProps {
  bankId: string;
  quizId: string;
  sectionId: string;
  onQuestionsFiltered: (questions: BankQuestion[]) => void;
}

export function FilterSelectionComponent({
  bankId,
  quizId,
  sectionId,
  onQuestionsFiltered,
}: FilterSelectionComponentProps) {
  const { success, error } = useToast();
  const [filters, setFilters] = useState<FilterEntity[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  // Add refs for request cancellation and debouncing
  const abortControllersRef = useRef<Record<string, AbortController>>({});
  const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Cleanup effect to cancel pending requests on unmount
  useEffect(() => {
    return () => {
      // Cancel all pending requests
      Object.values(abortControllersRef.current).forEach((controller) => {
        controller.abort();
      });
      // Clear all debounce timers
      Object.values(debounceTimersRef.current).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  // Fetch topics for the bank
  const { data: topics } = useQuery({
    queryKey: ["bankTopics", bankId],
    queryFn: () => Bank.getBankTopics(bankId),
    enabled: !!bankId,
  });

  // Question type options
  const questionTypeOptions = Object.values(QuestionTypes).map((type) => ({
    value: type,
    label: type.replace(/_/g, " "),
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
    // Cancel any pending request for this filter
    if (abortControllersRef.current[filterId]) {
      abortControllersRef.current[filterId].abort();
      delete abortControllersRef.current[filterId];
    }

    // Clear any pending debounce timer
    if (debounceTimersRef.current[filterId]) {
      clearTimeout(debounceTimersRef.current[filterId]);
      delete debounceTimersRef.current[filterId];
    }

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

      // Auto-fetch questions if entity is complete with debouncing
      if (updatedEntity.topic && updatedEntity.noOfQuestions > 0) {
        // Clear existing debounce timer
        if (debounceTimersRef.current[filterId]) {
          clearTimeout(debounceTimersRef.current[filterId]);
        }

        // Set new debounce timer
        debounceTimersRef.current[filterId] = setTimeout(() => {
          fetchQuestionsForFilter(filterId, updatedEntity);
          delete debounceTimersRef.current[filterId];
        }, 500); // 500ms debounce delay
      }

      return updatedEntities;
    });
  };

  const fetchQuestionsForFilter = async (
    filterId: string,
    entity: FilterEntity,
  ) => {
    if (!entity.topic || entity.noOfQuestions <= 0) return;

    // Cancel previous request if exists
    if (abortControllersRef.current[filterId]) {
      abortControllersRef.current[filterId].abort();
    }

    // Clear existing debounce timer
    if (debounceTimersRef.current[filterId]) {
      clearTimeout(debounceTimersRef.current[filterId]);
    }

    // Create new AbortController
    const controller = new AbortController();
    abortControllersRef.current[filterId] = controller;

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
        controller.signal, // Pass AbortSignal
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
    } catch (err) {
      // Only show error toast for actual API failures, not cancellations
      if (!axios.isCancel(err)) {
        error("Failed to fetch questions for filter");
      }
      setFilters((prev) =>
        prev.map((e) => (e.id === filterId ? { ...e, isLoading: false } : e)),
      );
    } finally {
      // Clean up the controller reference
      delete abortControllersRef.current[filterId];
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
    // Cancel all pending requests
    Object.values(abortControllersRef.current).forEach((controller) => {
      controller.abort();
    });
    abortControllersRef.current = {};

    // Clear all debounce timers
    Object.values(debounceTimersRef.current).forEach((timer) => {
      clearTimeout(timer);
    });
    debounceTimersRef.current = {};

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
          <p className="text-sm text-muted-foreground">
            Each filter must have at least one unique parameter. You can have
            the same topic and difficulty as long as the question type is
            different, or any other combination where at least one parameter
            differs.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Entities */}
          <div className="space-y-4">
            {filters.map((entity, index) => (
              <div
                key={entity.id}
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
                  {/* Topic Selection with Searchable Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-sm">Topic</Label>
                    <SearchableTopicDropdown
                      topics={topics || []}
                      value={entity.topic}
                      onChange={(value) =>
                        updateFilterEntity(entity.id, { topic: value })
                      }
                      disabled={entity.isLoading}
                    />
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
                      min="0"
                      max="50"
                      value={entity.noOfQuestions}
                      onChange={(e) =>
                        updateFilterEntity(entity.id, {
                          noOfQuestions: parseInt(e.target.value),
                        })
                      }
                      disabled={entity.isLoading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                  <Button
                    variant="outline"
                    onClick={addFilterEntity}
                    className="flex items-center gap-2"
                    disabled={!canAddMore}
                  >
                    <Plus className="h-4 w-4" />
                    {canAddMore ? "Add Filter" : "All combinations used"}
                  </Button>
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
            <Button
              onClick={applyFilters}
              disabled={
                !hasValidFilters ||
                isApplying ||
                filters.some((entity) => entity.isLoading)
              }
              className="flex-1"
            >
              {isApplying
                ? "Processing..."
                : filters.some((entity) => entity.isLoading)
                  ? "Waiting for filters..."
                  : `Continue with ${allQuestionsCount} Questions`}
            </Button>
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
        </div>
      )}
    </div>
  );
}
