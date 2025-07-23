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
          className="w-full justify-between h-10"
          disabled={disabled}
        >
          {selected
            ? selected.name
            : value === "any"
              ? "Any Topic"
              : "Select topic"}
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
            <div className=" text-sm text-muted-foreground">
              No topics found
            </div>
          ) : (
            <>
              {/* Add "Any Topic" option */}
              <Button
                variant="ghost"
                className={
                  "w-full justify-start  text-left text-sm " +
                  (value === "any" ? "bg-accent text-accent-foreground" : "")
                }
                onClick={() => {
                  onChange("any");
                  setOpen(false);
                  setSearch("");
                }}
                disabled={disabled}
              >
                Any Topic
                {value === "any" && <Check className="ml-auto h-4 w-4" />}
              </Button>

              {/* Existing topic list */}
              {filteredTopics.map((topic) => (
                <Button
                  key={topic.id}
                  variant="ghost"
                  className={
                    "w-full justify-start  text-left text-sm " +
                    (value === topic.id
                      ? "bg-accent text-accent-foreground"
                      : "")
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
              ))}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
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
import {
  Filter,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

interface FilterEntity {
  id: string;
  topic: string | "any";
  difficulty: Difficulty | "any";
  questionType: QuestionTypes | "any";
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

  // Question type options with "Any" option
  const questionTypeOptions = [
    { value: "any", label: "Any Question Type" },
    ...Object.values(QuestionTypes).map((type) => ({
      value: type,
      label: type.replace(/_/g, " "),
    })),
  ];

  // Difficulty options with "Any" option
  const difficultyOptions = [
    { value: "any", label: "Any Difficulty" },
    ...Object.values(Difficulty).map((diff) => ({
      value: diff,
      label: diff.charAt(0) + diff.slice(1).toLowerCase(),
    })),
  ];

  const generateFilterId = () => {
    return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const fetchQuestionsForFilter = useCallback(
    async (filterId: string, entity: FilterEntity) => {
      if (entity.noOfQuestions <= 0) return;

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
          // Handle "any" difficulty - send empty array if "any"
          entity.difficulty === "any" ? [] : [entity.difficulty as Difficulty],
          sectionId,
          quizId,
          // Handle "any" topic - send empty array if "any"
          entity.topic === "any" ? [] : [entity.topic],
          // Handle "any" question type - send empty array if "any"
          entity.questionType === "any"
            ? []
            : [entity.questionType as QuestionTypes],
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
        ) as unknown as BankQuestion[];

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
    },
    [bankId, sectionId, quizId, error],
  );

  // Effect to handle initial fetch when bankId is available
  useEffect(() => {
    if (bankId && filters.length > 0) {
      filters.forEach((filter) => {
        // Trigger fetch for filters that have noOfQuestions > 0 but no questions yet
        if (
          filter.noOfQuestions > 0 &&
          filter.questions.length === 0 &&
          !filter.isLoading
        ) {
          fetchQuestionsForFilter(filter.id, filter);
        }
      });
    }
  }, [bankId, filters, fetchQuestionsForFilter]);

  const addFilterEntity = useCallback(() => {
    // Simplified check - just limit to a reasonable number of filters
    const maxFilters = 10; // Allow up to 10 filters

    if (filters.length >= maxFilters) {
      error("Maximum number of filters reached");
      return;
    }

    const filterId = generateFilterId();
    const newFilter: FilterEntity = {
      id: filterId,
      topic: "any", // Default to "Any Topic"
      difficulty: "any", // Default to "Any Difficulty"
      questionType: "any", // Default to "Any Question Type"
      noOfQuestions: 1,
      questions: [],
      isLoading: false,
    };

    setFilters((prev) => {
      const updatedFilters = [...prev, newFilter];
      return updatedFilters;
    });

    // Trigger initial fetch for the new filter after state update
    setTimeout(() => {
      fetchQuestionsForFilter(filterId, newFilter);
    }, 100);
  }, [filters.length, error, fetchQuestionsForFilter]);

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

      // Auto-fetch questions if entity has valid noOfQuestions with debouncing
      if (updatedEntity.noOfQuestions > 0) {
        // Clear existing debounce timer
        if (debounceTimersRef.current[filterId]) {
          clearTimeout(debounceTimersRef.current[filterId]);
        }

        // Set new debounce timer
        debounceTimersRef.current[filterId] = setTimeout(() => {
          fetchQuestionsForFilter(filterId, updatedEntity);
          delete debounceTimersRef.current[filterId];
        }, 500); // 500ms debounce delay
      } else if (updatedEntity.noOfQuestions === 0) {
        // Clear questions if noOfQuestions is 0
        const clearedEntities = prev.map((entity) =>
          entity.id === filterId ? { ...entity, questions: [] } : entity,
        );
        return clearedEntities;
      }

      return updatedEntities;
    });
  };

  const applyFilters = async () => {
    if (filters.length === 0) {
      error("Please add at least one filter");
      return;
    }

    const incompleteFilters = filters.filter(
      (entity) => entity.noOfQuestions <= 0,
    );

    if (incompleteFilters.length > 0) {
      error("Please specify the number of questions for each filter");
      return;
    }

    const loadingFilters = filters.filter((entity) => entity.isLoading);
    if (loadingFilters.length > 0) {
      error("Please wait for all filters to finish loading");
      return;
    }

    const filtersWithoutQuestions = filters.filter(
      (entity) => entity.questions.length === 0 && entity.noOfQuestions > 0,
    );
    if (filtersWithoutQuestions.length > 0) {
      error(
        "Some filters didn't return any questions. Please adjust your criteria.",
      );
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
        f.noOfQuestions > 0 && // Must have at least 1 question
        f.questions.length > 0, // Must have fetched questions
    );
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Filter className="h-5 w-5 text-primary" />
              Question Filters
            </CardTitle>
            {allQuestionsCount > 0 && (
              <Badge
                variant="secondary"
                className="text-sm font-medium px-3 py-1"
              >
                {allQuestionsCount} questions found
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Create filters to find specific questions from your bank. Each
            filter can target different combinations of topics, difficulty
            levels, and question types.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Entities */}
          <div className="space-y-6">
            {filters.map((entity, index) => (
              <Card
                key={entity.id}
                className="relative bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Loading overlay */}
                {entity.isLoading && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      <span>Fetching questions...</span>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-base font-semibold">
                        Filter {index + 1}
                      </CardTitle>
                      {entity.questions.length > 0 && (
                        <Badge
                          variant="default"
                          className="text-xs font-medium"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {entity.questions.length} questions
                        </Badge>
                      )}
                      {entity.noOfQuestions > 0 &&
                        !entity.isLoading &&
                        entity.questions.length === 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Ready to fetch
                          </Badge>
                        )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilterEntity(entity.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-8 w-8 p-0"
                      disabled={entity.isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Topic Selection */}
                    <div className="space-y-2 min-h-[80px]">
                      <Label className="text-sm font-medium text-foreground h-6 flex items-center">
                        Topic
                      </Label>
                      <div className="h-10">
                        <SearchableTopicDropdown
                          topics={topics || []}
                          value={entity.topic}
                          onChange={(value) =>
                            updateFilterEntity(entity.id, { topic: value })
                          }
                          disabled={entity.isLoading}
                        />
                      </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-2 min-h-[80px]">
                      <Label className="text-sm font-medium text-foreground h-6 flex items-center">
                        Difficulty
                      </Label>
                      <div className="h-10">
                        <Select
                          value={entity.difficulty}
                          onValueChange={(value) =>
                            updateFilterEntity(entity.id, {
                              difficulty: value as Difficulty | "any",
                            })
                          }
                          disabled={entity.isLoading}
                        >
                          <SelectTrigger className="w-full h-10">
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
                    </div>

                    {/* Question Type Selection */}
                    <div className="space-y-2 min-h-[80px]">
                      <Label className="text-sm font-medium text-foreground h-6 flex items-center">
                        Question Type
                      </Label>
                      <div className="h-10">
                        <Select
                          value={entity.questionType}
                          onValueChange={(value) =>
                            updateFilterEntity(entity.id, {
                              questionType: value as QuestionTypes | "any",
                            })
                          }
                          disabled={entity.isLoading}
                        >
                          <SelectTrigger className="w-full h-10">
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
                    </div>

                    {/* Number of Questions */}
                    <div className="space-y-2 min-h-[80px]">
                      <Label className="text-sm font-medium text-foreground h-6 flex items-center">
                        No. of Questions
                      </Label>
                      <div className="h-10">
                        <Input
                          type="text"
                          value={
                            entity.noOfQuestions === 0
                              ? ""
                              : entity.noOfQuestions
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              updateFilterEntity(entity.id, {
                                noOfQuestions: 0,
                              });
                            } else {
                              const numericValue = value.replace(/[^0-9]/g, "");
                              const num = parseInt(numericValue, 10);
                              if (!isNaN(num) && num >= 0 && num <= 50) {
                                updateFilterEntity(entity.id, {
                                  noOfQuestions: num,
                                });
                              } else if (numericValue === "") {
                                updateFilterEntity(entity.id, {
                                  noOfQuestions: 0,
                                });
                              }
                            }
                          }}
                          onFocus={(e) => {
                            // Select all text when focused for easy replacement
                            e.target.select();
                          }}
                          disabled={entity.isLoading}
                          className="w-full h-10"
                          placeholder="Enter number (1-50)"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Filter Button */}
          <div className="flex flex-col items-center gap-3 py-4">
            {(() => {
              const maxFilters = 10; // Allow up to 10 filters
              const canAddMore = filters.length < maxFilters;

              return (
                <>
                  <Button
                    variant={canAddMore ? "outline" : "secondary"}
                    onClick={addFilterEntity}
                    className="flex items-center gap-2 min-w-[140px] h-10"
                    disabled={!canAddMore}
                  >
                    <Plus className="h-4 w-4" />
                    {canAddMore ? "Add Filter" : "Maximum Reached"}
                  </Button>
                  {!canAddMore && (
                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                      You&apos;ve reached the maximum of {maxFilters} filters
                    </p>
                  )}
                </>
              );
            })()}
          </div>

          {/* Filter Summary */}
          {filters.length > 0 && (
            <Card className="bg-muted/30 border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Filters Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {filters.map((entity, index) => {
                    const topic =
                      entity.topic === "any"
                        ? "Any Topic"
                        : topics?.find((t) => t.id === entity.topic)?.name ||
                          "Unknown Topic";

                    const difficulty =
                      entity.difficulty === "any"
                        ? "Any Difficulty"
                        : entity.difficulty.toLowerCase();

                    const questionType =
                      entity.questionType === "any"
                        ? "Any Type"
                        : entity.questionType.replace(/_/g, " ").toLowerCase();

                    const hasQuestions = entity.questions.length > 0;
                    return (
                      <Badge
                        key={entity.id}
                        variant={hasQuestions ? "default" : "secondary"}
                        className="text-xs flex items-center gap-1 px-2 py-1"
                      >
                        {hasQuestions ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : entity.isLoading ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        Filter {index + 1}: {entity.noOfQuestions} {difficulty}{" "}
                        {questionType} from {topic}
                        {hasQuestions && ` (${entity.questions.length})`}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-border">
            <Button
              onClick={applyFilters}
              disabled={
                !hasValidFilters ||
                isApplying ||
                filters.some((entity) => entity.isLoading) ||
                allQuestionsCount === 0
              }
              className="flex-1 h-11 font-medium"
              size="default"
            >
              {isApplying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : filters.some((entity) => entity.isLoading) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Waiting for filters...
                </>
              ) : allQuestionsCount === 0 ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  No questions found
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Continue with {allQuestionsCount} Question
                  {allQuestionsCount !== 1 ? "s" : ""}
                </>
              )}
            </Button>
            {filters.length > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={isApplying}
                className="h-11 px-6 font-medium"
                size="default"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Start with basic filter */}
      {filters.length === 0 && (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Filter className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Get Started with Filters
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Create your first filter to find questions from your bank. You can
              filter by topic, difficulty, question type, or set all to
              &quot;Any&quot; to get all questions.
            </p>
            <Button
              onClick={addFilterEntity}
              variant="default"
              size="lg"
              className="flex items-center gap-2 h-11 px-6"
            >
              <Plus className="h-5 w-5" />
              Add Your First Filter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
