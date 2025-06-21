"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QuestionPreview from "@/components/bank/question-preview";
import QuestionTable from "@/components/bank/QuestionTable";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question } from "@/lib/types";
import { getQuestionsByBankId, banks } from "@/lib/question-banks";
import { sampleQuestions } from "@/lib/sample-data";
import { useSearchParams } from "next/navigation";
import { DateTimePicker } from "@/components/bank/datetime-picker";

export default function AddQuestionsPage() {
  // Get bank ID from URL if present
  const searchParams = useSearchParams();
  const bankFromURL = searchParams.get("bank") ?? "";

  // Available topics state
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  // Filter state
  const [filters, setFilters] = useState({
    bank: bankFromURL || "any",
    topic: "any",
    difficulty: "any",
    questionType: "any",
    courseOutcome: "any",
    bloomsTaxonomy: "any",
    marks: "any",
    numQuestions: "10",
  });
  // Advanced search state
  const [advancedSearch, setAdvancedSearch] = useState({
    keywords: "",
    createdAfter: "",
    createdBefore: "",
    createdBy: "any",
  });
  // Filtered questions state
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  // Selected questions state
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Active tab state
  const [activeTab, setActiveTab] = useState("filters");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  // Refs to manage the select components state

  // Function to get all available topics across all banks or from a specific bank
  const getAvailableTopics = (bankId?: string): string[] => {
    if (bankId && bankId !== "any") {
      // Return topics for the specific bank\
      return banks[bankId]?.topics.map((t) => t.toLowerCase()) || [];
    } else {
      // Return all unique topics across all banks
      const allTopics = new Set<string>();
      Object.values(banks).forEach((bank) => {
        bank.topics.forEach((topic) => {
          allTopics.add(topic.toLowerCase());
        });
      });
      return Array.from(allTopics);
    }
  }; // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    if (key === "bank") {
      // Update available topics first when bank selection changes
      const topics = getAvailableTopics(value);
      setAvailableTopics(topics);

      // For bank changes, we need to handle topic reset and update questions in one step
      const updatedFilters = (prev: typeof filters) => {
        const newFilters = { ...prev, [key]: value };

        // Reset topic if current topic is not available in the selected bank
        if (
          value !== "any" &&
          prev.topic !== "any" &&
          !topics.includes(prev.topic)
        ) {
          newFilters.topic = "any";
        }

        return newFilters;
      };

      // Update filters with the new bank selection
      setFilters(updatedFilters);
    } else {
      // For other filter changes
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  }; // Handle advanced search changes
  const handleAdvancedSearchChange = (key: string, value: string) => {
    setAdvancedSearch((prev) => ({ ...prev, [key]: value }));
  };
  // Clear all filters and search terms
  const clearAllFilters = () => {
    const newBank = bankFromURL || "any";

    setFilters({
      bank: newBank, // Keep the bank from URL or use "any"
      topic: "any",
      difficulty: "any",
      questionType: "any",
      courseOutcome: "any",
      bloomsTaxonomy: "any",
      marks: "any",
      numQuestions: "10",
    });

    setAdvancedSearch({
      keywords: "",
      createdAfter: "",
      createdBefore: "",
      createdBy: "any",
    });

    // Update available topics based on the bank
    setAvailableTopics(getAvailableTopics(newBank));

    // Update the UI by refreshing filtered questions
    setFilteredQuestions(filterQuestions());
  };

  // Handle question selection
  const handleQuestionSelection = useCallback((selectedIds: string[]) => {
    setSelectedQuestionIds(selectedIds);
  }, []);

  // Clear selected questions
  const clearSelectedQuestions = () => {
    setSelectedQuestionIds([]);
  };

  const handleSelectAll = () => {
    if (selectedQuestionIds.length === filteredQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(filteredQuestions.map((q) => q.id));
    }
  };
  // Get current quiz questions to exclude them from the results
  const getQuizQuestionIds = (): string[] => {
    // Since sample questions are now used as the quiz questions
    return sampleQuestions.map((q) => q.id);
  }; // Filter questions based on current filters
  const filterQuestions = useCallback(() => {
    // Get the current bank from filters
    const currentBank = filters.bank;

    // Get questions from question banks with the current bank
    let result: Question[] = getQuestionsByBankId(currentBank);

    // Log bank and initial question count for debugging
    console.log(
      `Filtering questions for bank: ${currentBank}, initial count: ${result.length}`,
    );

    // Exclude questions that are already in the quiz
    const quizQuestionIds = getQuizQuestionIds();
    result = result.filter(
      (question) => !quizQuestionIds.includes(question.id),
    );

    // Apply basic filters
    if (filters.topic && filters.topic !== "any") {
      result = result.filter(
        (q) => q.topic?.toLowerCase() === filters.topic.toLowerCase(),
      );
    }

    if (filters.difficulty && filters.difficulty !== "any") {
      result = result.filter(
        (q) => q.difficulty?.toLowerCase() === filters.difficulty.toLowerCase(),
      );
    }

    if (filters.questionType && filters.questionType !== "any") {
      const typeMap: Record<string, string> = {
        mcq: "Multiple Choice",
        truefalse: "True/False",
        essay: "Essay",
        coding: "Coding",
      };
      result = result.filter((q) => q.type === typeMap[filters.questionType]);
    }

    if (filters.courseOutcome && filters.courseOutcome !== "any") {
      const co = parseInt(filters.courseOutcome.replace("co", ""));
      result = result.filter((q) => q.courseOutcome === co);
    }

    if (filters.bloomsTaxonomy && filters.bloomsTaxonomy !== "any") {
      const btMap: Record<string, string> = {
        remember: "Remember",
        understand: "Understand",
        apply: "Apply",
        analyze: "Analyze",
        evaluate: "Evaluate",
        create: "Create",
      };
      result = result.filter(
        (q) => q.bloomsTaxonomy === btMap[filters.bloomsTaxonomy],
      );
    }

    if (filters.marks && filters.marks !== "any") {
      result = result.filter((q) => q.marks === parseInt(filters.marks));
    }

    // Apply advanced search filters
    if (activeTab === "advanced" && advancedSearch.keywords) {
      const keywords = advancedSearch.keywords.toLowerCase();
      result = result.filter(
        (q) =>
          q.description.toLowerCase().includes(keywords) ||
          q.answer.toLowerCase().includes(keywords),
      );
    }

    // Apply creator filter
    if (
      activeTab === "advanced" &&
      advancedSearch.createdBy &&
      advancedSearch.createdBy !== "any"
    ) {
      // In a real app, we'd check the creator here
      // This is just a placeholder for future implementation
    }

    // Limit by numQuestions if specified
    const numQuestions = parseInt(filters.numQuestions);
    if (numQuestions > 0 && result.length > numQuestions) {
      result = result.slice(0, numQuestions);
    }

    return result;
  }, [filters, advancedSearch, activeTab]);
  // Update filtered questions when activeTab changes
  useEffect(() => {
    // This will run when the active tab changes
    if (activeTab) {
      setFilteredQuestions(filterQuestions());
    }
  }, [activeTab, filterQuestions]);
  // Update filtered questions whenever filters or advancedSearch changes
  useEffect(() => {
    // Use the latest state for filtering
    const updatedQuestions = filterQuestions();
    setFilteredQuestions(updatedQuestions);

    // Log for debugging (can be removed in production)
    console.log(
      `Filter applied: Bank=${filters.bank}, Questions=${updatedQuestions.length}`,
    );
  }, [filters, advancedSearch, filterQuestions]);
  // Load questions and initialize available topics on initial page load
  useEffect(() => {
    // Initialize available topics based on the bank from URL or all topics
    const initialBank = bankFromURL || "any";
    console.log("Initial bank from URL:", initialBank);

    // Set available topics based on selected bank first
    const topics = getAvailableTopics(initialBank);
    setAvailableTopics(topics);

    // Make sure filters match URL params on initial load
    setFilters((prev) => ({
      ...prev,
      bank: initialBank,
    }));

    // Initial load of questions - no need for setTimeout as it will be
    // triggered by the filters useEffect
  }, [bankFromURL]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        {bankFromURL ? (
          <Link href={`/question-banks/${bankFromURL}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Question Bank
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quiz
            </Button>
          </Link>
        )}
        <h1 className="text-2xl font-bold ml-4">Add Questions from Bank</h1>
      </div>
      <Tabs
        defaultValue="filters"
        className="mb-8"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Search</TabsTrigger>
        </TabsList>
        <TabsContent value="filters">
          <Card className="bg-[#0c101e] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Question Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-400 hover:text-white h-8"
              >
                Clear All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Question Bank
                  </label>
                  <Select
                    value={filters.bank}
                    onValueChange={(value) => handleFilterChange("bank", value)}
                  >
                    <SelectTrigger className="bg-[#0a0d17] border-gray-700">
                      <SelectValue placeholder="Select bank">
                        {filters.bank === "any"
                          ? "Any"
                          : filters.bank === "cs101"
                            ? "Computer Science"
                            : filters.bank === "math201"
                              ? "Mathematics"
                              : filters.bank === "physics101"
                                ? "Physics"
                                : filters.bank === "db101"
                                  ? "Database Systems"
                                  : "Select bank"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="cs101">Computer Science</SelectItem>
                      <SelectItem value="math201">Mathematics</SelectItem>
                      <SelectItem value="physics101">Physics</SelectItem>
                      <SelectItem value="db101">Database Systems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Topic
                  </label>
                  <Select
                    value={filters.topic}
                    onValueChange={(value) =>
                      handleFilterChange("topic", value)
                    }
                  >
                    <SelectTrigger className="bg-[#0a0d17] border-gray-700">
                      <SelectValue placeholder="Select topic">
                        {filters.topic === "any"
                          ? "Any"
                          : filters.topic.charAt(0).toUpperCase() +
                            filters.topic.slice(1)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {availableTopics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic.charAt(0).toUpperCase() + topic.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Difficulty
                  </label>
                  <Select
                    value={filters.difficulty}
                    onValueChange={(value) =>
                      handleFilterChange("difficulty", value)
                    }
                  >
                    <SelectTrigger className="bg-[#0a0d17] border-gray-700">
                      <SelectValue placeholder="Select difficulty">
                        {filters.difficulty === "any"
                          ? "Any"
                          : filters.difficulty.charAt(0).toUpperCase() +
                            filters.difficulty.slice(1)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Question Type
                  </label>
                  <Select
                    value={filters.questionType}
                    onValueChange={(value) =>
                      handleFilterChange("questionType", value)
                    }
                  >
                    <SelectTrigger className="bg-[#0a0d17] border-gray-700">
                      <SelectValue placeholder="Select type">
                        {filters.questionType === "any"
                          ? "Any"
                          : filters.questionType === "mcq"
                            ? "Multiple Choice"
                            : filters.questionType === "truefalse"
                              ? "True/False"
                              : filters.questionType === "essay"
                                ? "Essay"
                                : filters.questionType === "coding"
                                  ? "Coding"
                                  : "Select type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="truefalse">True/False</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Course Outcome
                  </label>
                  <Select
                    value={filters.courseOutcome}
                    onValueChange={(value) =>
                      handleFilterChange("courseOutcome", value)
                    }
                  >
                    <SelectTrigger className="bg-[#0a0d17] border-gray-700">
                      <SelectValue placeholder="Select course outcome">
                        {filters.courseOutcome === "any"
                          ? "Any"
                          : filters.courseOutcome.toUpperCase()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="co1">CO1</SelectItem>
                      <SelectItem value="co2">CO2</SelectItem>
                      <SelectItem value="co3">CO3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Blooms Taxonomy Level
                  </label>
                  <Select
                    value={filters.bloomsTaxonomy}
                    onValueChange={(value) =>
                      handleFilterChange("bloomsTaxonomy", value)
                    }
                  >
                    <SelectTrigger className="bg-[#0a0d17] border-gray-700">
                      <SelectValue placeholder="Select level">
                        {filters.bloomsTaxonomy === "any"
                          ? "Any"
                          : filters.bloomsTaxonomy.charAt(0).toUpperCase() +
                            filters.bloomsTaxonomy.slice(1)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="remember">Remember</SelectItem>
                      <SelectItem value="understand">Understand</SelectItem>
                      <SelectItem value="apply">Apply</SelectItem>
                      <SelectItem value="analyze">Analyze</SelectItem>
                      <SelectItem value="evaluate">Evaluate</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Marks
                  </label>
                  <Select
                    value={filters.marks}
                    onValueChange={(value) =>
                      handleFilterChange("marks", value)
                    }
                  >
                    <SelectTrigger className="bg-[#0a0d17] border-gray-700">
                      <SelectValue placeholder="Select marks">
                        {filters.marks === "any" ? "Any" : filters.marks}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Number of Questions
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={filters.numQuestions}
                    className="bg-[#0a0d17] border-gray-700"
                    onChange={(e) =>
                      handleFilterChange("numQuestions", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced">
          <Card className="bg-[#0c101e] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Advanced Search</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-400 hover:text-white h-8"
              >
                Clear All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Search Keywords
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter keywords to search in questions..."
                    className="bg-[#0a0d17] border-gray-700"
                    value={advancedSearch.keywords}
                    onChange={(e) =>
                      handleAdvancedSearchChange("keywords", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">
                      Created After
                    </label>
                    <DateTimePicker
                      value={
                        advancedSearch.createdAfter
                          ? new Date(advancedSearch.createdAfter)
                          : undefined
                      }
                      onChange={(date) => {
                        if (date) {
                          handleAdvancedSearchChange(
                            "createdAfter",
                            date.toISOString().split("T")[0],
                          );
                        }
                      }}
                      hideTime={true}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">
                      Created Before
                    </label>
                    <DateTimePicker
                      value={
                        advancedSearch.createdBefore
                          ? new Date(advancedSearch.createdBefore)
                          : undefined
                      }
                      onChange={(date) => {
                        if (date) {
                          handleAdvancedSearchChange(
                            "createdBefore",
                            date.toISOString().split("T")[0],
                          );
                        }
                      }}
                      hideTime={true}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">
                      Created By
                    </label>
                    <Select
                      value={advancedSearch.createdBy}
                      onValueChange={(value) =>
                        handleAdvancedSearchChange("createdBy", value)
                      }
                    >
                      <SelectTrigger className="bg-[#0a0d17] border-gray-700">
                        <SelectValue placeholder="Select creator">
                          {advancedSearch.createdBy === "any"
                            ? "Any"
                            : advancedSearch.createdBy === "all"
                              ? "All Users"
                              : advancedSearch.createdBy === "me"
                                ? "Only Me"
                                : advancedSearch.createdBy === "others"
                                  ? "Other Users"
                                  : "Select creator"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="me">Only Me</SelectItem>
                        <SelectItem value="others">Other Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          Preview Questions
          <span className="ml-2 text-sm bg-gray-800 px-2 py-0.5 rounded-full">
            {filteredQuestions.length}
          </span>
          {selectedQuestionIds.length > 0 && (
            <span className="ml-2 text-sm bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full">
              {selectedQuestionIds.length} selected
            </span>
          )}
        </h2>
        <div className="flex items-center gap-4 ml-auto">
          {/* View toggle buttons */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
              aria-label="Table view"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="4" />
                <rect x="3" y="9" width="18" height="4" />
                <rect x="3" y="15" width="18" height="4" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredQuestions.length === 0}
            >
              {selectedQuestionIds.length === filteredQuestions.length &&
              filteredQuestions.length > 0
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2">
            {selectedQuestionIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelectedQuestions}
                className="gap-2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
                Clear Selection
              </Button>
            )}
            <Link href="/">
              <Button
                variant={selectedQuestionIds.length > 0 ? "default" : "outline"}
                size="sm"
                className="gap-2"
                disabled={selectedQuestionIds.length === 0}
              >
                <Check className="w-4 h-4" />
                Add Selected ({selectedQuestionIds.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {viewMode === "grid" ? (
        <QuestionPreview
          questions={filteredQuestions}
          selectable={true}
          onSelectionChange={handleQuestionSelection}
        />
      ) : (
        <QuestionTable questions={filteredQuestions} />
      )}
    </div>
  );
}
