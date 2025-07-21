"use client";
import React, { useState, useMemo, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import Bank, {
  AddBankQuestionDTO,
  QuizQuestionAddResponse,
  BankQuestion,
} from "@/repo/bank/bank";
import { QuestionRenderer } from "@/components/render-questions/question-renderer-fixed";
import {
  Question,
  QuestionTypes,
  Difficulty,
} from "@/components/render-questions/types";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";

interface SelectFiltersProps {
  className?: string;
}

interface FilterEntity {
  id: string;
  topic: string;
  difficulty: Difficulty;
  questionType: QuestionTypes;
  noOfQuestions: number;
  questions: BankQuestion[]; // Store questions for each filter
  isLoading: boolean; // Loading state for each filter
}

interface FilterState {
  entities: FilterEntity[];
}

const SelectFilters = ({ className }: SelectFiltersProps) => {
  const { success, error } = useToast();

  // Fixed IDs for now as requested
  const quizId = "aefd84e5-76ba-4ef1-8969-29b3784df73a";
  const sectionId = "aa1d5c1d-0567-41d5-a2d1-ed67e1537722";
  const bankId = ["95075fa9-46df-4f79-9703-1f1f222e2bba"];

  // State
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    entities: [],
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const parentRef = useRef<HTMLDivElement>(null);

  // Fetch topics for the bank
  const { data: topics } = useQuery({
    queryKey: ["bankTopics", bankId[0]],
    queryFn: () => Bank.getBankTopics(bankId[0]),
    enabled: !!bankId[0],
  });

  // Mutation for adding questions to quiz
  const addQuestionsToQuizMutation = useMutation({
    mutationFn: (dto: AddBankQuestionDTO) =>
      Bank.addBankQuestionToQuiz(quizId, dto),
    onSuccess: (response: QuizQuestionAddResponse) => {
      console.log("Add questions response:", response); // Added for debugging
      success(
        `Successfully added ${response.addedQuestionsCount} unique questions to the quiz`,
      );
      setSelectedQuestions([]); // Clear selection after successful addition
    },
    onError: (err: Error) => {
      console.error(
        "Detailed error:",
        (err as unknown as { response?: { data?: unknown } }).response?.data ||
          err,
      ); // Enhanced error logging
      const errorMessage =
        (
          err as unknown as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        ).response?.data?.message ||
        err.message ||
        "Unknown error";
      error("Failed to add questions: " + errorMessage);
    },
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

  // Helper function to get the question ID, handling different possible field names
  const getQuestionId = (question: Record<string, unknown>): string => {
    console.log("Question object keys:", Object.keys(question));
    console.log("Question object values for potential ID fields:", {
      id: question.id,
      _id: question._id,
      questionId: question.questionId,
      uuid: question.uuid,
      question_id: question.question_id,
    });

    // Try different possible ID field names
    return (
      (question.id as string) ||
      (question._id as string) ||
      (question.questionId as string) ||
      (question.uuid as string) ||
      (question.question_id as string) ||
      `temp_${Math.random()}`
    );
  };

  // Helper function to normalize questions with proper IDs
  const normalizeQuestions = (
    questions: Record<string, unknown>[],
  ): BankQuestion[] => {
    return questions.map((question) => ({
      ...question,
      id: getQuestionId(question), // Ensure every question has an ID
      _originalData: question, // Store the original data for backend ID extraction
    })) as BankQuestion[];
  };

  const convertToQuestion = (bankQuestion: BankQuestion): Question => {
    return {
      ...bankQuestion,
      type: bankQuestion.type as QuestionTypes,
      difficulty: bankQuestion.difficulty || "MEDIUM",
      bloomsTaxonomy: bankQuestion.bloomsTaxonomy || "REMEMBER",
      co: bankQuestion.co || 1,
      marks: bankQuestion.marks || 1,
      // Add default properties based on question type
      ...(bankQuestion.type === "MCQ" && { options: [] }),
      ...(bankQuestion.type === "MMCQ" && { options: [] }),
      ...(bankQuestion.type === "TRUEFALSE" && { answers: false }),
      ...(bankQuestion.type === "FILL_UP" && { blanks: [] }),
      ...(bankQuestion.type === "MATCH_THE_FOLLOWING" && { keys: [] }),
      ...(bankQuestion.type === "CODING" && { testcases: [] }),
    } as Question;
  };

  // Generate unique ID for filter entities
  const generateFilterId = () => {
    return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add new filter entity
  const addFilterEntity = () => {
    // Check if we can add more filters (considering all three parameters)
    const totalCombinations =
      (topics?.length || 0) *
      Object.values(Difficulty).length *
      Object.values(QuestionTypes).length;
    const usedCombinations = filters.entities.filter(
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
    setFilters((prev) => ({
      entities: [...prev.entities, newFilter],
    }));
  };

  // Remove filter entity
  const removeFilterEntity = (filterId: string) => {
    setFilters((prev) => ({
      entities: prev.entities.filter((entity) => entity.id !== filterId),
    }));
  };

  // Fetch questions for a specific filter entity
  const fetchQuestionsForFilter = async (
    filterId: string,
    entity: FilterEntity,
  ) => {
    // Validate filter entity
    if (!entity.topic || entity.noOfQuestions <= 0) {
      return;
    }

    // Set loading state for this filter
    setFilters((prev) => ({
      entities: prev.entities.map((e) =>
        e.id === filterId ? { ...e, isLoading: true } : e,
      ),
    }));

    try {
      const response = await Bank.getFilteredQuestions(
        bankId,
        entity.noOfQuestions,
        [entity.difficulty],
        sectionId,
        quizId,
        [entity.topic],
        [entity.questionType],
      );

      // Debug: Log the raw response to see the actual structure
      console.log(`Raw API response for filter ${filterId}:`, response);
      console.log(`First question structure:`, response[0]);
      console.log(
        `Question keys:`,
        response[0] ? Object.keys(response[0]) : "No questions",
      );

      // Normalize questions to ensure they have proper IDs
      const normalizedQuestions = normalizeQuestions(response);
      console.log(
        `Normalized questions for filter ${filterId}:`,
        normalizedQuestions.map((q) => ({
          id: q.id,
          question: q.question?.substring(0, 50) + "...",
        })),
      );

      // Update the filter entity with fetched questions
      setFilters((prev) => ({
        entities: prev.entities.map((e) =>
          e.id === filterId
            ? { ...e, questions: normalizedQuestions, isLoading: false }
            : e,
        ),
      }));

      success(`Fetched ${normalizedQuestions.length} questions for filter`);
    } catch (err) {
      console.error("Error fetching questions:", err);
      error("Failed to fetch questions for filter");

      // Reset loading state on error
      setFilters((prev) => ({
        entities: prev.entities.map((e) =>
          e.id === filterId ? { ...e, isLoading: false } : e,
        ),
      }));
    }
  };

  // Update filter entity and fetch questions if complete
  const updateFilterEntity = (
    filterId: string,
    updates: Partial<FilterEntity>,
  ) => {
    setFilters((prev) => {
      const currentEntity = prev.entities.find((e) => e.id === filterId);
      if (!currentEntity) return prev;

      const updatedEntity = { ...currentEntity, ...updates };

      const updatedEntities = prev.entities.map((entity) =>
        entity.id === filterId ? updatedEntity : entity,
      );

      // Check for complete duplicate (all three parameters the same)
      if (
        updatedEntity.topic &&
        updatedEntity.difficulty &&
        updatedEntity.questionType
      ) {
        const isDuplicate = prev.entities.some(
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
          return prev; // Don't update if complete duplicate
        }
      }

      // If the entity is complete, fetch questions
      if (updatedEntity.topic && updatedEntity.noOfQuestions > 0) {
        // Delay the fetch to allow state to update
        setTimeout(() => fetchQuestionsForFilter(filterId, updatedEntity), 100);
      }

      return { entities: updatedEntities };
    });
  };

  // Collect and show all questions from all filter entities
  const fetchFilteredQuestions = async () => {
    if (filters.entities.length === 0) {
      error("Please add at least one filter entity");
      return;
    }

    // Check if any filters are still loading
    const loadingFilters = filters.entities.filter(
      (entity) => entity.isLoading,
    );
    if (loadingFilters.length > 0) {
      error("Please wait for all filters to finish loading");
      return;
    }

    // Check if any filters are incomplete
    const incompleteFilters = filters.entities.filter(
      (entity) => !entity.topic || entity.noOfQuestions <= 0,
    );

    if (incompleteFilters.length > 0) {
      error("Please fill in all required fields for each filter");
      return;
    }

    setIsLoading(true);
    try {
      // Collect all questions from all filter entities
      const allQuestions: BankQuestion[] = [];

      filters.entities.forEach((entity) => {
        allQuestions.push(...entity.questions);
      });

      // Debug: Log all collected questions with their IDs
      console.log(
        "All collected questions:",
        allQuestions.map((q) => ({
          id: q.id,
          question: q.question?.substring(0, 50) + "...",
        })),
      );

      // Show all questions including duplicates (user wants total count from all filters)
      // This allows users to see the exact number of questions they requested per filter
      // For example: 2 Medium questions + 1 Easy question = 3 total questions displayed
      setQuestions(allQuestions);
      setSelectedQuestions([]); // Clear selection when new questions are fetched
      success(
        `Showing ${allQuestions.length} questions from ${filters.entities.length} filter(s)`,
      );
    } catch (err) {
      console.error("Error processing questions:", err);
      error("Failed to process questions");
    } finally {
      setIsLoading(false);
    }
  };

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
    estimateSize: () => 200,
    overscan: 3,
    getItemKey: (index) =>
      `question-${index}-${filteredQuestions[index]?.id || index}`,
  });

  const items = virtualizer.getVirtualItems();

  // Handle question selection - using actual question IDs for better reliability
  const handleQuestionSelect = (questionId: string, selected: boolean) => {
    console.log(
      `Question ${selected ? "selected" : "deselected"}:`,
      questionId,
    );
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

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      entities: [],
    });
    setQuestions([]);
    setSelectedQuestions([]);
  };

  // Handle adding selected questions to quiz
  const handleAddSelectedQuestionsToQuiz = () => {
    if (selectedQuestions.length === 0) {
      error("Please select at least one question to add to the quiz");
      return;
    }

    // Remove duplicates to avoid adding same question multiple times
    const uniqueQuestionIds = [...new Set(selectedQuestions)];

    // Get the original question objects to extract their backend IDs
    const selectedQuestionObjects = questions.filter((q) =>
      uniqueQuestionIds.includes(q.id),
    );
    console.log("Selected Question Objects:", selectedQuestionObjects);

    // Extract the original backend IDs (could be _id, questionId, etc.)
    const backendQuestionIds = selectedQuestionObjects
      .map((q) => {
        // Use the original backend data if available
        const originalData = q._originalData || q;
        const originalDataRecord = originalData as Record<string, unknown>;
        const originalId =
          (originalDataRecord._id as string) ||
          (originalDataRecord.questionId as string) ||
          (originalDataRecord.uuid as string) ||
          (originalDataRecord.question_id as string) ||
          (originalDataRecord.id as string) ||
          q.id;
        console.log(
          `Question "${q.question?.substring(0, 30)}..." - Original ID: ${originalId}`,
        );
        return originalId;
      })
      .filter((id) => id); // Remove any undefined values

    console.log("Backend Question IDs:", backendQuestionIds);
    console.log("Selected Questions Count:", backendQuestionIds.length);

    if (backendQuestionIds.length === 0) {
      error(
        "Could not find valid question IDs. Please check the question data structure.",
      );
      return;
    }

    const dto: AddBankQuestionDTO = {
      sectionId: sectionId,
      bankQuestionId: backendQuestionIds, // Use the original backend IDs
    };

    console.log("DTO Payload:", dto);

    addQuestionsToQuizMutation.mutate(dto);
  };

  return (
    <div className={`container mx-auto p-6 space-y-6 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Question Bank Filters</h1>
          <p className="text-muted-foreground">
            Add multiple filters to select questions. Each filter must have at
            least one unique parameter (topic, difficulty, or question type).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
            {showFilters ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Questions
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
              {filters.entities.map((entity, index) => (
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
                        <Badge variant="secondary" className="text-xs">
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
                          <SelectValue
                            placeholder="Select type"
                            className="font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypeOptions.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              className="font-normal"
                            >
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
                const usedCombinations = filters.entities.filter(
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

            {/* Active Filters Summary */}
            {filters.entities.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Active Filters Summary:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {filters.entities.map((entity, index) => {
                    const topic = topics?.find((t) => t.id === entity.topic);
                    const hasQuestions = entity.questions.length > 0;
                    return (
                      <Badge
                        key={entity.id}
                        variant={hasQuestions ? "default" : "secondary"}
                        className="text-xs"
                      >
                        Filter {index + 1}: {entity.noOfQuestions}{" "}
                        {entity.difficulty.toLowerCase()}{" "}
                        {entity.questionType.replace(/_/g, " ").toLowerCase()}
                        {topic && ` from ${topic.name}`}
                        {hasQuestions &&
                          ` (${entity.questions.length} fetched)`}
                        {entity.isLoading && " (loading...)"}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchFilteredQuestions}
                disabled={
                  isLoading ||
                  addQuestionsToQuizMutation.isPending ||
                  filters.entities.length === 0 ||
                  filters.entities.some((entity) => entity.isLoading)
                }
                className="flex-1"
              >
                {isLoading
                  ? "Processing..."
                  : filters.entities.some((entity) => entity.isLoading)
                    ? "Waiting for filters..."
                    : "Apply Filters"}
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={isLoading || addQuestionsToQuizMutation.isPending}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Section */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Questions ({filteredQuestions.length}
                {filteredQuestions.length !== questions.length &&
                  ` of ${questions.length}`}
                )
              </CardTitle>
              <div className="flex items-center gap-2">
                {selectedQuestions.length > 0 && (
                  <>
                    <Badge variant="outline">
                      {selectedQuestions.length} selected
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSelection}
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions, explanations, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Selection Controls */}
            {filteredQuestions.length > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedQuestions.length === filteredQuestions.length &&
                      filteredQuestions.length > 0
                        ? true
                        : selectedQuestions.length > 0
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="cursor-pointer">
                    Select all questions
                  </Label>
                </div>
                {selectedQuestions.length > 0 && (
                  <span className="text-muted-foreground">
                    {selectedQuestions.length} of {filteredQuestions.length}{" "}
                    selected
                  </span>
                )}
              </div>
            )}

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery
                  ? "No questions match your search criteria"
                  : "No questions found with current filters"}
              </div>
            ) : (
              <div
                ref={parentRef}
                className="h-[600px] overflow-auto border rounded-lg bg-background"
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
                            selectedQuestions.includes(question.id)
                              ? "bg-accent/50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center pt-2">
                              <Checkbox
                                checked={selectedQuestions.includes(
                                  question.id,
                                )}
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
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Questions Summary */}
      {selectedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Selected Questions ({selectedQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                You have selected {selectedQuestions.length} question
                {selectedQuestions.length !== 1 ? "s" : ""}.
                {addQuestionsToQuizMutation.isPending && (
                  <span className="ml-2 text-blue-600">Adding to quiz...</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleClearSelection}
                  size="sm"
                  disabled={addQuestionsToQuizMutation.isPending}
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={handleAddSelectedQuestionsToQuiz}
                  size="sm"
                  disabled={addQuestionsToQuizMutation.isPending}
                >
                  {addQuestionsToQuizMutation.isPending
                    ? "Adding Questions..."
                    : "Add to Quiz"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelectFilters;
