"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Files,
  Share,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Bank from "@/repo/bank/bank";
import { useRouter } from "next/navigation";

interface QuestionBank {
  id: string;
  name: string;
  courseCode: string;
  semester: number;
  description: string;
  topics: string[];
  questionCount: number;
  lastUpdated: string;
}

// Add interface for API response
interface BankApiResponse {
  id?: string;
  bankId?: string;
  name?: string;
  courseCode?: string;
  semester?: string;
  questions?: number;
  created_at?: string;
}

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const BankDialog = ({
  mode,
  bank,
  onClose,
}: {
  mode: "add" | "edit";
  bank?: QuestionBank;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    bank?.courseCode || "",
  );
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(
    bank?.semester,
  );
  const [bankName, setBankName] = useState<string>(bank?.name || "");

  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const semesterOptions = semesters.map((semester) => ({
    value: semester.toString(),
    label: semester.toString(),
  }));

  const createBankMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      semester: number;
      courseCode: string;
    }) => {
      const payload = {
        name: data.name,
        semester: data.semester.toString(),
        courseCode: data.courseCode,
        topics: 0,
        questions: 0,
        access: [],
      };
      return await Bank.createBank(payload);
    },
    onMutate: () => {
      success("Creating question bank...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      success("Question bank created successfully");
      handleClose();
    },
    onError: (err) => {
      console.error("Error creating question bank:", err);
      error("Failed to create question bank. Please try again.");
    },
  });

  const editBankMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      courseCode: string;
      semester?: number;
    }) => {
      const payload = {
        name: data.name,
        courseCode: data.courseCode,
        ...(data.semester ? { semester: data.semester.toString() } : {}),
      };
      return await Bank.updateBank(data.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      success("Question bank updated successfully");
      handleClose();
    },
    onError: (err) => {
      error("Failed to update question bank. Please try again.");
      console.error("Edit error:", err);
    },
  });

  const handleSubmit = () => {
    if (!bankName.trim()) {
      error("Please enter a bank name");
      return;
    }

    if (!selectedCourseCode) {
      error("Please enter a course code");
      return;
    }

    if (!selectedSemester) {
      error("Please select a semester");
      return;
    }

    if (mode === "add") {
      createBankMutation.mutate({
        name: bankName,
        semester: selectedSemester,
        courseCode: selectedCourseCode,
      });
    } else if (mode === "edit" && bank) {
      editBankMutation.mutate({
        id: bank.id,
        name: bankName,
        courseCode: selectedCourseCode,
        semester: selectedSemester,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Create" : "Edit"} Question Bank
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new question bank to organize your questions for different subjects and categories."
              : "Update the details of your question bank."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              placeholder="e.g., Programming Fundamentals MCQs"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-code">Course Code</Label>
              <Input
                id="course-code"
                placeholder="e.g., CS101"
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <SearchableSelect
                options={semesterOptions}
                value={selectedSemester?.toString() ?? ""}
                onValueChange={(val) => {
                  const parsed = parseInt(val);
                  if (!isNaN(parsed)) setSelectedSemester(parsed);
                }}
                placeholder="Select semester"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              mode === "add"
                ? createBankMutation.isPending
                : editBankMutation.isPending
            }
          >
            {mode === "add"
              ? createBankMutation.isPending
                ? "Creating..."
                : "Create Bank"
              : editBankMutation.isPending
                ? "Saving..."
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function QuestionBankPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof QuestionBank>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState<QuestionBank | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  const { success, error } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [
      "questionBanks",
      page,
      pageSize,
      searchTerm,
      semesterFilter,
      sortField,
      sortDirection,
    ],
    queryFn: async () => {
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append("page", String(page - 1)); // API uses 0-based index
        queryParams.append("size", String(pageSize));

        // Add sorting parameters
        // Map frontend fields to backend field names
        const sortMapping: Record<string, string> = {
          name: "name",
          courseCode: "course",
          semester: "semester",
          questionCount: "bank_question",
          lastUpdated: "created_at",
          // Add other mappings as needed
        };

        const backendSortField = sortMapping[sortField] || "name";
        queryParams.append("sort", `${backendSortField},${sortDirection}`);

        // Add search/filter parameters if needed
        // This would depend on backend API capabilities

        // Make the API call
        const response = await Bank.getAllBanks();

        // Transform API response to match QuestionBank interface
        let filteredBanks: QuestionBank[] = response.map(
          (bank: BankApiResponse) => ({
            id: bank.id || bank.bankId || "",
            name: bank.name || "",
            courseCode: bank.courseCode || "",
            semester: parseInt(bank.semester || "0") || 0,
            description: bank.courseCode || "", // Use courseCode as description fallback
            topics: [],
            questionCount: bank.questions || 0,
            lastUpdated: bank.created_at || new Date().toISOString(),
          }),
        );

        if (searchTerm) {
          filteredBanks = filteredBanks.filter(
            (bank) =>
              bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (bank.courseCode &&
                bank.courseCode
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())),
          );
        }

        if (semesterFilter !== null) {
          filteredBanks = filteredBanks.filter(
            (bank) => bank.semester === semesterFilter,
          );
        }

        // Apply client-side sorting if needed
        // This helps when server-side sorting doesn't work as expected
        filteredBanks.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
          }

          return 0;
        });

        // Get pagination info from response
        const totalBanks = response.page?.total_elements || 0;
        const totalPages = response.page?.total_pages || 0;

        return {
          banks: filteredBanks,
          totalBanks,
          totalPages,
        };
      } catch (err: unknown) {
        // Properly type the error and provide more descriptive messages based on error type
        if (err instanceof Error) {
          console.error("Error fetching question banks:", err.message);
          error(`Failed to load question banks: ${err.message}`);
        } else if (typeof err === "object" && err && "response" in err) {
          // Axios error
          const axiosError = err as {
            response?: { status: number; data?: unknown };
          };
          const statusCode = axiosError.response?.status;
          console.error(
            `API Error (${statusCode}):`,
            axiosError.response?.data,
          );
          error(`Failed to load question banks: Server returned ${statusCode}`);
        } else {
          console.error("Unknown error fetching question banks:", err);
          error("Failed to load question banks: Unknown error");
        }

        return {
          banks: [],
          totalBanks: 0,
          totalPages: 0,
        };
      }
    },
  });

  const handleSort = (field: keyof QuestionBank) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (field: keyof QuestionBank) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = data?.totalPages || 0;
    const currentPage = page;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("ellipsis-end");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Filter options
  // Course code now uses an input field, so we don't need options

  // const semesterOptions = semesters.map(semester => ({
  //   value: semester,
  //   label: semester
  // }));

  const semesterOptions = semesters.map((semester) => ({
    value: semester.toString(),
    label: `Semester ${semester}`,
  }));

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "courseCode-asc", label: "Course Code (A-Z)" },
    { value: "courseCode-desc", label: "Course Code (Z-A)" },
    { value: "questionCount-desc", label: "Most Questions" },
    { value: "questionCount-asc", label: "Least Questions" },
    { value: "lastUpdated-desc", label: "Recently Updated" },
    { value: "lastUpdated-asc", label: "Oldest Updated" },
  ];

  const queryClient = useQueryClient();

  // Single delete action
  const deleteBankMutation = useMutation({
    mutationFn: async (bankId: string) => {
      return await Bank.deleteBank(bankId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      success(`Question bank deleted successfully.`);
    },
    onError: (err) => {
      error(`Failed to delete question bank. Please try again.`);
      console.error("Delete error:", err);
    },
  });

  const handleEditBank = (bank: QuestionBank) => {
    setCurrentBank(bank);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const router = useRouter();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Question Banks</CardTitle>
            <CardDescription>
              Manage your question banks for quizzes and assessments
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setDialogMode("add");
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Bank
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-2 w-full max-w-sm items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search question banks..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <SlidersHorizontal size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <SearchableSelect
                  options={sortOptions}
                  value={`${sortField}-${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split("-") as [
                      keyof QuestionBank,
                      "asc" | "desc",
                    ];
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                  placeholder="Sort by..."
                  className="w-[160px]"
                />
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => setPageSize(parseInt(value))}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {filterOpen && (
              <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/20 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="semester-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Semester:
                  </Label>
                  <SearchableSelect
                    options={semesterOptions}
                    value={
                      semesterFilter !== null ? semesterFilter.toString() : ""
                    }
                    onValueChange={(value) => {
                      const parsed = parseInt(value);
                      setSemesterFilter(!isNaN(parsed) ? parsed : null);
                    }}
                    placeholder="All semesters"
                    className="w-[180px]"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // setSubjectFilter(null);
                    setSemesterFilter(null);
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}

            <div className="rounded-md border relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Bank Name{getSortIndicator("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("courseCode")}
                    >
                      Course Code{getSortIndicator("courseCode")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("semester")}
                    >
                      Semester{getSortIndicator("semester")}
                    </TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("questionCount")}
                    >
                      Questions{getSortIndicator("questionCount")}
                    </TableHead>
                    <TableHead className="w-[70px] text-center">View</TableHead>
                    <TableHead className="w-[70px] text-center">
                      Share
                    </TableHead>
                    <TableHead className="w-[70px] text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: pageSize }).map((_, index) => (
                      <TableRow key={`loading-${index}`}>
                        <TableCell>
                          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data?.banks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No question banks found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.banks.map((bank) => (
                      <TableRow
                        key={bank.id}
                        onClick={() => {
                          router.push(`/question-bank/${bank.id}`);
                        }}
                      >
                        <TableCell>
                          <div className="font-medium">{bank.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                          >
                            {bank.courseCode || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{bank.semester}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                          >
                            {bank.topics.length} topics
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Files
                              size={14}
                              className="text-muted-foreground"
                            />
                            {bank.questionCount}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full"
                          >
                            <Files className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full"
                          >
                            <Share className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild className="ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditBank(bank)}
                              >
                                Edit Bank
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  deleteBankMutation.mutate(bank.id)
                                }
                              >
                                Delete Bank
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing
                {Math.min((page - 1) * pageSize + 1, data?.totalBanks || 0)} to
                {Math.min(page * pageSize, data?.totalBanks || 0)} of
                {data?.totalBanks || 0} question banks
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {generatePageNumbers().map((pageNumber, index) => (
                    <PaginationItem key={index}>
                      {pageNumber === "ellipsis-start" ||
                      pageNumber === "ellipsis-end" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pageNumber as number);
                          }}
                          isActive={pageNumber === page}
                        >
                          {pageNumber}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < (data?.totalPages || 0)) setPage(page + 1);
                      }}
                      className={
                        page === (data?.totalPages || 0)
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
      {dialogOpen && (
        <BankDialog
          mode={dialogMode}
          bank={currentBank || undefined}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}
