"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Bank, { BankSchema } from "@/repo/bank/bank";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import { Search, Database, FileQuestion, Hash, Calendar } from "lucide-react";

interface BankSelectionStepProps {
  onBankSelect: (bank: BankSchema) => void;
  selectedBank?: BankSchema;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export function BankSelectionStep({
  onBankSelect,
  selectedBank,
}: BankSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  // Color palette for bank cards
  const bankColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white",
    "bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 text-white",
    "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 text-white",
    "bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 text-white",
    "bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500 text-white",
    "bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 text-white",
    "bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 text-white",
    "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-white",
  ];

  const getColorForBank = (bankId: string) => {
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

  const filteredBanks = useMemo(() => {
    if (!banks.length) return [];

    return banks.filter((bank: BankSchema) => {
      const matchesSearch =
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSemester =
        semesterFilter === "all" || bank.semester === semesterFilter;

      return matchesSearch && matchesSemester;
    });
  }, [banks, searchTerm, semesterFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select a Question Bank</h2>
          <p className="text-muted-foreground">
            Choose a question bank to add questions from
          </p>
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
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
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Database className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 dark:bg-orange-400 rounded-full flex items-center justify-center shadow-md">
            <FileQuestion className="h-4 w-4 text-white" />
          </div>
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No question banks found</h3>
          <p className="text-muted-foreground max-w-md">
            There are no question banks available at the moment. Please create a
            new bank to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select a Question Bank</h2>
        <p className="text-muted-foreground">
          Choose a question bank to add questions from
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <SearchInput
          placeholder="Search question banks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
          className="flex-1"
        />
        <Select value={semesterFilter} onValueChange={setSemesterFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                Semester {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {filteredBanks.length}
        </span>{" "}
        of <span className="font-medium text-foreground">{banks.length}</span>{" "}
        banks
      </div>

      {/* Banks Grid */}
      {filteredBanks.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center space-y-6 text-center rounded-lg border-2 border-dashed border-muted bg-muted/20 dark:bg-muted/10 p-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
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
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredBanks.map((bank: BankSchema) => (
            <motion.div key={bank.id} variants={cardVariants}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className={`cursor-pointer transition-all duration-200 ${
                  selectedBank?.id === bank.id
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
                onClick={() => onBankSelect(bank)}
              >
                <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20">
                  {/* Header with gradient background */}
                  <div
                    className={`h-20 flex items-center justify-center p-4 ${getColorForBank(bank.id)}`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mb-1">
                        {bank.courseCode}
                      </div>
                      <div className="text-xs text-white/90">Question Bank</div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                        {bank.name}
                      </h3>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        <Calendar className="mr-1 h-3 w-3" />
                        Sem {bank.semester}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-xs bg-muted/50 rounded px-2 py-1">
                        <FileQuestion className="h-3 w-3 text-primary" />
                        <span className="font-medium">{bank.questions}</span>
                        <span className="text-muted-foreground">questions</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs bg-muted/50 rounded px-2 py-1">
                        <Hash className="h-3 w-3 text-primary" />
                        <span className="font-medium">{bank.topics}</span>
                        <span className="text-muted-foreground">topics</span>
                      </div>
                    </div>

                    {selectedBank?.id === bank.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-2 border-t"
                      >
                        <Badge className="w-full justify-center">
                          Selected
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
