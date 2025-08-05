import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Bank from "@/repo/bank/bank";
import { QuestionFilters } from "@/components/quiz/types/quiz-types";
import { useQuestionFilters } from "@/components/quiz/hooks/use-question-filters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function BackendQuestionFilters() {
  const { quizId } = useParams();
  const [selectedBankId, setSelectedBankId] = useState<string>("any");

  // Frontend filter state
  const [filters, setFilters] = useState<QuestionFilters>({
    bank: "any",
    topic: "any",
    difficulty: "any",
    questionType: "any",
    courseOutcome: "any",
    bloomsTaxonomy: "any",
    marks: "any",
    numQuestions: "10",
  });

  // Custom hook for question filtering
  const { filteredQuestions, loading, error, filterQuestions } =
    useQuestionFilters();

  // Get all banks for bank selector
  const { data: banksData } = useQuery({
    queryKey: ["allBanks"],
    queryFn: () => Bank.getAllBanks(),
  });

  // Get topics for selected bank
  const { data: bankTopics } = useQuery({
    queryKey: ["bankTopics", selectedBankId],
    queryFn: () => Bank.getBankTopics(selectedBankId),
    enabled: selectedBankId !== "any",
  });

  // Filter questions when filters change
  useEffect(() => {
    if (quizId && typeof quizId === "string") {
      filterQuestions(quizId, filters);
    }
  }, [filters, quizId, filterQuestions]);

  const handleFilterChange = (key: keyof QuestionFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset topic when bank changes
      ...(key === "bank" && { topic: "any" }),
    }));

    if (key === "bank") {
      setSelectedBankId(value);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      bank: "any",
      topic: "any",
      difficulty: "any",
      questionType: "any",
      courseOutcome: "any",
      bloomsTaxonomy: "any",
      marks: "any",
      numQuestions: "10",
    });
    setSelectedBankId("any");
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Question Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Question Bank Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Question Bank
              </label>
              <Select
                value={filters.bank}
                onValueChange={(value) => handleFilterChange("bank", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank">
                    {filters.bank === "any" ? "Any" : filters.bank}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {banksData?.content?.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium">Topic</label>
              <Select
                value={filters.topic}
                onValueChange={(value) => handleFilterChange("topic", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topic">
                    {filters.topic === "any" ? "Any" : filters.topic}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {bankTopics?.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Difficulty
              </label>
              <Select
                value={filters.difficulty}
                onValueChange={(value) =>
                  handleFilterChange("difficulty", value)
                }
              >
                <SelectTrigger>
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

            {/* Question Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Question Type
              </label>
              <Select
                value={filters.questionType}
                onValueChange={(value) =>
                  handleFilterChange("questionType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type">
                    {filters.questionType === "any"
                      ? "Any"
                      : filters.questionType === "mcq"
                        ? "Multiple Choice"
                        : filters.questionType === "truefalse"
                          ? "True/False"
                          : filters.questionType === "coding"
                            ? "Coding"
                            : filters.questionType === "descriptive"
                              ? "Descriptive"
                              : filters.questionType}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="truefalse">True/False</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="descriptive">Descriptive</SelectItem>
                  <SelectItem value="fillup">Fill in the Blanks</SelectItem>
                  <SelectItem value="match-following">
                    Match the Following
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Preview Questions
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span className="text-sm bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {filteredQuestions.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading questions...</span>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No questions found with the current filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">
                        {index + 1}. {question.question}
                      </p>
                      <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                        <span>Difficulty: {question.difficulty}</span>
                        <span>•</span>
                        <span>Type: {question.questionType}</span>
                        <span>•</span>
                        <span>Marks: {question.marks}</span>
                      </div>
                      {question.topics && question.topics.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {question.topics.map((topic) => (
                            <span
                              key={topic.id}
                              className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                            >
                              {topic.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BackendQuestionFilters;
