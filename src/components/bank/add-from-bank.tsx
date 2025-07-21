"use client";

import React, { useState, useMemo } from "react";
import { BankSchema } from "@/repo/bank/bank";
import Bank from "@/repo/bank/bank";
import { BankCard } from "@/components/bank/bank-card";
import { BankSearchFilters } from "@/components/bank/bank-search-filters";
import { BankTable } from "@/components/bank/bank-table";
import { MultiStepBankModal } from "@/components/bank/multi-step-bank-modal";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/search-input";
import { Search, Grid, List, Database, FileQuestion, Plus } from "lucide-react";

type Props = {
  quizId?: string;
  sectionId?: string;
};

type ViewMode = "cards" | "table";
type SortField =
  | "name"
  | "courseCode"
  | "semester"
  | "questions"
  | "topics"
  | "created_at";
type SortOrder = "asc" | "desc";

const AddfromBank = ({ quizId, sectionId }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default IDs if not provided as props
  const defaultQuizId = "aefd84e5-76ba-4ef1-8969-29b3784df73a";
  const defaultSectionId = "aa1d5c1d-0567-41d5-a2d1-ed67e1537722";

  const currentQuizId = quizId || defaultQuizId;
  const currentSectionId = sectionId || defaultSectionId;

  // Color palette for bank cards - optimized for light and dark modes
  const bankColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white",
    "bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 text-white",
    "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 text-white",
    "bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 text-white",
    "bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500 text-white",
    "bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 text-white",
    "bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 text-white",
    "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-white",
    "bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-400 dark:to-cyan-500 text-white",
    "bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 text-white",
    "bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 text-white",
    "bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-400 dark:to-rose-500 text-white",
  ];

  const getColorForBank = (bankId: string) => {
    // Use multiple characters from the ID for better distribution
    const hash = bankId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % bankColors.length;
    return bankColors[index];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["banks"],
    queryFn: () => Bank.getAllBanks(),
  });

  const banks = useMemo(() => data?.content || [], [data?.content]);

  const semesters = useMemo(() => {
    if (!banks.length) return [];
    const uniqueSemesters = Array.from(
      new Set(banks.map((bank: BankSchema) => bank.semester)),
    );
    return uniqueSemesters.sort();
  }, [banks]);

  const filteredAndSortedBanks = useMemo(() => {
    if (!banks.length) return [];

    const filtered = banks.filter((bank: BankSchema) => {
      const matchesSearch =
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSemester =
        semesterFilter === "all" || bank.semester === semesterFilter;

      return matchesSearch && matchesSemester;
    });

    filtered.sort((a: BankSchema, b: BankSchema) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "courseCode":
          comparison = a.courseCode.localeCompare(b.courseCode);
          break;
        case "semester":
          comparison = a.semester.localeCompare(b.semester);
          break;
        case "questions":
          comparison = a.questions - b.questions;
          break;
        case "topics":
          comparison = a.topics - b.topics;
          break;
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [banks, searchTerm, semesterFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderContent = () => {
    if (viewMode === "cards") {
      return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedBanks.map((bank) => (
            <div key={bank.id} className="relative">
              <BankCard
                bank={bank}
                colorClass={getColorForBank(bank.id)}
                onSelect={() => setIsModalOpen(true)}
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <BankTable
        banks={filteredAndSortedBanks}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={toggleSort}
        getColorForBank={getColorForBank}
        onSelectBank={() => setIsModalOpen(true)}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Skeleton className="h-10 w-full md:flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => ({
            id: `skeleton-${Date.now()}-${i}`,
          })).map((skeleton) => (
            <Card key={skeleton.id} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="h-12 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!banks.length) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center space-y-6 text-center p-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-xl dark:shadow-black/20">
            <Database className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 dark:bg-orange-400 rounded-full flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-black/20">
            <FileQuestion className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            No question banks found
          </h3>
          <p className="text-muted-foreground max-w-md">
            There are no question banks available at the moment. Create a new
            bank to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Select A Question Bank
          </h1>
          <p className="text-muted-foreground">
            Choose a question bank to add questions from
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Questions
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="transition-all"
          >
            <Grid className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Cards</span>
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="transition-all"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Table</span>
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchInput
            placeholder="Search question banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
          />
        </div>

        <BankSearchFilters
          semesters={semesters}
          semesterFilter={semesterFilter}
          setSemesterFilter={setSemesterFilter}
          sortField={sortField}
          sortOrder={sortOrder}
          setSortField={setSortField}
          setSortOrder={setSortOrder}
        />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredAndSortedBanks.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{banks.length}</span>{" "}
          banks
        </div>
        {filteredAndSortedBanks.length > 0 && (
          <Badge variant="outline" className="font-medium">
            {viewMode === "cards" ? "Card View" : "Table View"}
          </Badge>
        )}
      </div>

      {/* Content */}
      {filteredAndSortedBanks.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 text-center rounded-lg border-2 border-dashed border-muted bg-muted/20 dark:bg-muted/10 p-8">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded-xl flex items-center justify-center shadow-lg dark:shadow-xl dark:shadow-black/20">
              <Search className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              No banks match your search
            </h3>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your search terms or filters to find the question
              banks you&apos;re looking for.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSemesterFilter("all");
            }}
            className="mt-4 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        renderContent()
      )}

      {/* Multi-Step Modal */}
      <MultiStepBankModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quizId={currentQuizId}
        sectionId={currentSectionId}
      />
    </div>
  );
};

export default AddfromBank;
