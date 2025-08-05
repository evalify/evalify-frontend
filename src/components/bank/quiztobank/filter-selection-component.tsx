"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBankTopics } from "@/components/bank/quiztobank/hooks/use-bank-operations";
import { BankQuestion as RepoBankQuestion } from "@/repo/bank/bank";
import Bank from "@/repo/bank/bank";
import { QuestionTypes, Difficulty } from "@/components/render-questions/types";
import { extractErrorMessage } from "@/components/bank/quiztobank/error/error-utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Search,
  ArrowRight,
} from "lucide-react";

interface FilterEntityState {
  id: string;
  topic: string; // 'any' or topic ID
  difficulty: Difficulty | "any";
  questionType: QuestionTypes | "any";
  noOfQuestions: number;
  questions: RepoBankQuestion[];
  isLoading: boolean;
  error?: string;
}

interface FilterSelectionComponentProps {
  bankId: string;
  quizId: string;
  sectionId: string;
  onQuestionsFiltered: (questions: RepoBankQuestion[]) => void;
  onContinue?: () => void; // Add optional continue callback
}

export function FilterSelectionComponent({
  bankId,
  quizId,
  sectionId,
  onQuestionsFiltered,
  onContinue,
}: FilterSelectionComponentProps) {
  const { error: showError } = useToast();
  const [filters, setFilters] = useState<FilterEntityState[]>([
    {
      id: crypto.randomUUID(),
      questionType: "any",
      difficulty: "any",
      topic: "any",
      noOfQuestions: 1,
      questions: [],
      isLoading: false,
      error: undefined,
    },
  ]);

  // Get bank topics
  const {
    data: topicsData,
    isLoading: topicsLoading,
    error: topicsError,
  } = useBankTopics(bankId || "");

  const topics = useMemo(() => topicsData || [], [topicsData]);

  // Track if questions have been fetched for this session
  const [hasManuallyFetched, setHasManuallyFetched] = useState(false);

  // Memoize the questions to prevent unnecessary updates
  const allQuestions = useMemo(() => {
    return filters.flatMap((filter) => filter.questions);
  }, [filters]);

  // Update parent with questions only when questions actually change
  useEffect(() => {
    if (hasManuallyFetched && allQuestions.length > 0) {
      onQuestionsFiltered(allQuestions);
    }
  }, [allQuestions, onQuestionsFiltered, hasManuallyFetched]);

  const addFilter = () => {
    const newFilter: FilterEntityState = {
      id: crypto.randomUUID(),
      questionType: "any",
      difficulty: "any",
      topic: "any",
      noOfQuestions: 1,
      questions: [],
      isLoading: false,
      error: undefined,
    };
    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
  };

  const removeFilter = (filterId: string) => {
    if (filters.length === 1) {
      showError("At least one filter is required.");
      return;
    }
    const newFilters = filters.filter((filter) => filter.id !== filterId);
    setFilters(newFilters);
  };

  const updateFilter = (
    filterId: string,
    updates: Partial<FilterEntityState>,
  ) => {
    const newFilters = filters.map((filter) =>
      filter.id === filterId ? { ...filter, ...updates } : filter,
    );
    setFilters(newFilters);
  };

  const fetchQuestionsForFilter = async (
    filterId: string,
    filter: FilterEntityState,
  ) => {
    if (!bankId) return;

    // Set loading state
    setFilters((prev) =>
      prev.map((f) =>
        f.id === filterId ? { ...f, isLoading: true, error: undefined } : f,
      ),
    );

    try {
      // Handle "any" values by converting them to empty arrays (which the API treats as null)
      const difficulties =
        filter.difficulty === "any" ? [] : [filter.difficulty];
      const questionTypes =
        filter.questionType === "any" ? [] : [filter.questionType];
      const topics = filter.topic === "any" ? [] : [filter.topic];

      const response = await Bank.getFilteredQuestions(
        [bankId],
        filter.noOfQuestions,
        difficulties,
        sectionId,
        quizId,
        topics,
        questionTypes,
      );

      const normalizedQuestions = response.map((question) => ({
        ...question,
        id: question.id || question.questionId || `temp_${Math.random()}`,
        questionId: question.questionId || question.id,
      })) as RepoBankQuestion[];

      setFilters((prev) =>
        prev.map((f) =>
          f.id === filterId
            ? {
                ...f,
                questions: normalizedQuestions,
                isLoading: false,
                error:
                  normalizedQuestions.length === 0
                    ? "No questions found with these criteria"
                    : undefined,
              }
            : f,
        ),
      );
    } catch (err) {
      console.error("Error fetching questions:", err);
      setFilters((prev) =>
        prev.map((f) =>
          f.id === filterId
            ? {
                ...f,
                questions: [],
                isLoading: false,
                error: "Failed to fetch questions",
              }
            : f,
        ),
      );
    }
  };

  const fetchAllQuestions = async () => {
    if (!bankId) {
      showError("Please select a question bank first.");
      return;
    }

    // Validate that we have at least one filter with valid number of questions
    const validFilters = filters.filter((filter) => filter.noOfQuestions > 0);
    if (validFilters.length === 0) {
      showError(
        "Please set at least one filter with a valid number of questions.",
      );
      return;
    }

    setHasManuallyFetched(true);

    // Fetch questions for all filters
    const fetchPromises = validFilters.map((filter) =>
      fetchQuestionsForFilter(filter.id, filter),
    );

    await Promise.all(fetchPromises);
  };

  const isAnyFilterLoading = filters.some((filter) => filter.isLoading);
  const hasValidFilters = filters.some((filter) => filter.noOfQuestions > 0);
  const totalQuestionsRequested = filters.reduce(
    (sum, filter) => sum + filter.noOfQuestions,
    0,
  );
  const totalQuestionsFetched = filters.reduce(
    (sum, filter) => sum + (filter.questions?.length || 0),
    0,
  );
  const hasQuestionsToSelect = hasManuallyFetched && totalQuestionsFetched > 0;

  const getFilterStatus = (filter: FilterEntityState) => {
    if (filter.isLoading) {
      return { type: "loading" as const, message: "Loading questions..." };
    }

    if (filter.error) {
      return { type: "error" as const, message: filter.error };
    }

    if (!filter.questions || filter.questions.length === 0) {
      return {
        type: "error" as const,
        message: "No questions found with these criteria",
      };
    }

    if (filter.questions.length < filter.noOfQuestions) {
      return {
        type: "warning" as const,
        message: `Only ${filter.questions.length} questions available, but ${filter.noOfQuestions} requested`,
      };
    }

    return {
      type: "success" as const,
      message: `${filter.questions.length} questions available`,
    };
  };

  if (topicsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter Questions</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (topicsError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Topics
            </h3>
            <p className="text-muted-foreground mt-2">
              {extractErrorMessage(topicsError)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filter Questions</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchAllQuestions}
            disabled={!bankId || !hasValidFilters || isAnyFilterLoading}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnyFilterLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Fetching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Fetch Questions
              </>
            )}
          </Button>
          <Button
            onClick={addFilter}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>
      </div>

      {bankId && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed">
          <div className="flex items-center justify-between">
            <p>
              Configure your filters and click
              <span className="font-medium text-primary">{`"Fetch Questions"`}</span>{" "}
              to retrieve questions from the bank. You can use
              <span className="font-medium">{`"Any"`}</span> for topic,
              difficulty, or question type to include all options.
            </p>
            {hasManuallyFetched && (
              <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {totalQuestionsFetched} / {totalQuestionsRequested} questions
                fetched
              </div>
            )}
          </div>
        </div>
      )}

      {/* Continue to Question Selection */}
      {hasQuestionsToSelect && onContinue && (
        <Card className="border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Questions Ready for Selection
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {totalQuestionsFetched} questions fetched and ready to
                    select from
                  </p>
                </div>
              </div>
              <Button
                onClick={onContinue}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
              >
                Continue to Select Questions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filters.map((filter, index) => {
          const status = getFilterStatus(filter);

          return (
            <Card key={filter.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Filter {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {status.type === "loading" && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
                        <span className="text-xs">{status.message}</span>
                      </div>
                    )}
                    {status.type === "success" && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">{status.message}</span>
                      </div>
                    )}
                    {status.type === "warning" && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs">{status.message}</span>
                      </div>
                    )}
                    {status.type === "error" && (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs">{status.message}</span>
                      </div>
                    )}
                    <Button
                      onClick={() => {
                        setHasManuallyFetched(true);
                        fetchQuestionsForFilter(filter.id, filter);
                      }}
                      disabled={
                        !bankId || filter.noOfQuestions <= 0 || filter.isLoading
                      }
                      size="sm"
                      variant="outline"
                      className="h-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                    >
                      {filter.isLoading ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Search className="h-3 w-3" />
                      )}
                    </Button>
                    {filters.length > 1 && (
                      <Button
                        onClick={() => removeFilter(filter.id)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Question Type */}
                  <div className="space-y-2">
                    <Label htmlFor={`questionType-${filter.id}`}>
                      Question Type
                    </Label>
                    <Select
                      value={filter.questionType}
                      onValueChange={(value: QuestionTypes | "any") =>
                        updateFilter(filter.id, { questionType: value })
                      }
                    >
                      <SelectTrigger id={`questionType-${filter.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Type</SelectItem>
                        {Object.values(QuestionTypes).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace(/([A-Z])/g, " $1").trim()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-2">
                    <Label htmlFor={`difficulty-${filter.id}`}>
                      Difficulty
                    </Label>
                    <Select
                      value={filter.difficulty}
                      onValueChange={(value: Difficulty | "any") =>
                        updateFilter(filter.id, { difficulty: value })
                      }
                    >
                      <SelectTrigger id={`difficulty-${filter.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Difficulty</SelectItem>
                        {Object.values(Difficulty).map((diff) => (
                          <SelectItem key={diff} value={diff}>
                            {diff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topics */}
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Select
                      value={filter.topic}
                      onValueChange={(value) =>
                        updateFilter(filter.id, { topic: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Topic</SelectItem>
                        {topics.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Count */}
                  <div className="space-y-2">
                    <Label htmlFor={`noOfQuestions-${filter.id}`}>
                      Number of Questions
                    </Label>
                    <Input
                      id={`noOfQuestions-${filter.id}`}
                      type="number"
                      min="1"
                      max="50"
                      value={filter.noOfQuestions}
                      onChange={(e) => {
                        const noOfQuestions = Math.max(
                          1,
                          parseInt(e.target.value) || 1,
                        );
                        updateFilter(filter.id, { noOfQuestions });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!bankId && (
        <div className="text-center p-8 text-muted-foreground">
          <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Please select a question bank first to configure filters.</p>
        </div>
      )}
    </div>
  );
}
