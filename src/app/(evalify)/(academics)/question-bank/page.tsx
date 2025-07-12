"use client";

import React, { useState, useMemo, useCallback } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Files,
  Download,
  Upload,
  Copy,
  Minus,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Bank from "@/repo/bank/bank";
import { useRouter } from "next/navigation";
import ShareDialog from "@/components/bank/ShareDialog";

// Types and Interfaces
interface QuestionBank {
  id: string;
  name: string;
  courseCode: string;
  semester: string;
  topics: number;
  questionCount: number;
  lastUpdated: string;
}

interface BankApiResponse {
  id?: string;
  bankId?: string;
  name?: string;
  courseCode?: string;
  semester?: string;
  questions?: number;
  created_at?: string;
  topics?: number;
}

// Constants
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_FIELD = "name" as const;
const DEFAULT_SORT_DIRECTION = "asc" as const;

// Utility functions
const transformApiResponseToQuestionBank = (
  bank: BankApiResponse,
): QuestionBank => ({
  id: bank.id || bank.bankId || "",
  name: bank.name || "",
  courseCode: bank.courseCode || "",
  semester: bank.semester || "1", // Default to "1" instead of "S1"
  topics: bank?.topics || 0,
  questionCount: bank.questions || 0,
  lastUpdated: bank.created_at || new Date().toISOString(),
});

const filterBanks = (
  banks: QuestionBank[],
  searchTerm: string,
  semesterFilter: number | null,
): QuestionBank[] => {
  let filtered = banks;

  if (searchTerm) {
    filtered = filtered.filter(
      (bank) =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bank.courseCode &&
          bank.courseCode.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }

  if (semesterFilter !== null) {
    filtered = filtered.filter(
      (bank) => parseInt(bank.semester) === semesterFilter,
    );
  }

  return filtered;
};

const sortBanks = (
  banks: QuestionBank[],
  sortField: keyof QuestionBank,
  sortDirection: "asc" | "desc",
): QuestionBank[] => {
  return [...banks].sort((a, b) => {
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
};

const semesters = SEMESTERS;

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

  const [formData, setFormData] = useState({
    name: bank?.name || "",
    courseCode: bank?.courseCode || "",
    semester: bank?.semester ? parseInt(bank.semester.toString()) : undefined,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const semesterOptions = semesters.map((semester) => ({
    value: semester.toString(),
    label: `Semester ${semester}`,
  }));

  const createBankMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      courseCode: string;
      semester: number;
    }) => {
      const payload = {
        name: data.name,
        courseCode: data.courseCode,
        semester: data.semester.toString(), // Convert to string for the API
        topics: 0,
        questions: 0,
        access: [],
      };
      return await Bank.createBank(payload);
    },
    onMutate: () => {
      toast("Creating question bank...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast("Question bank created successfully");
      handleClose();
    },
    onError: () => {
      toast("Failed to create question bank. Please try again.");
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
        ...(data.semester ? { semester: data.semester.toString() } : {}), // Convert to string for the API
      };
      return await Bank.updateBank(data.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast("Question bank updated successfully");
      handleClose();
    },
    onError: () => {
      toast("Failed to update question bank. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast("Please enter a bank name");
      return;
    }

    if (!formData.courseCode.trim()) {
      toast("Please enter a course code");
      return;
    }

    if (!formData.semester) {
      toast("Please select a semester");
      return;
    }

    if (mode === "add") {
      createBankMutation.mutate({
        name: formData.name,
        courseCode: formData.courseCode,
        semester: formData.semester,
      });
    } else if (mode === "edit" && bank) {
      editBankMutation.mutate({
        id: bank.id,
        name: formData.name,
        courseCode: formData.courseCode,
        semester: formData.semester,
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
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-code">Course Code</Label>
              <Input
                id="course-code"
                placeholder="e.g., CS101"
                value={formData.courseCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    courseCode: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <SearchableSelect
                options={semesterOptions}
                value={formData.semester?.toString() || ""}
                onValueChange={(val) => {
                  if (val === "") {
                    setFormData((prev) => ({ ...prev, semester: undefined }));
                  } else {
                    const parsed = parseInt(val);
                    if (!isNaN(parsed)) {
                      setFormData((prev) => ({ ...prev, semester: parsed }));
                    }
                  }
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

// Memoized components for better performance
const BankTableRow = React.memo(
  ({
    bank,
    onEdit,
    onDelete,
    onShare,
    onView,
    isSelected,
    onSelect,
  }: {
    bank: QuestionBank;
    onEdit: (bank: QuestionBank) => void;
    onDelete: (bankId: string) => void;
    onShare: (bank: QuestionBank) => (e: React.MouseEvent) => void;
    onView: (bankId: string) => void;
    isSelected: boolean;
    onSelect: (bankId: string, selected: boolean) => void;
  }) => (
    <TableRow
      key={bank.id}
      onClick={() => onView(bank.id)}
      className="cursor-pointer hover:bg-muted/50"
    >
      <TableCell className="w-[50px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(bank.id, checked as boolean)}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
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
      <TableCell>
        <Badge
          variant="outline"
          className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        >
          Semester {bank.semester}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
        >
          {bank.topics}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Files size={14} className="text-muted-foreground" />
          {bank.questionCount}
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full"
          onClick={onShare(bank)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-share"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
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
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(bank);
              }}
            >
              Edit Bank
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(bank.id);
              }}
            >
              Delete Bank
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ),
);

BankTableRow.displayName = "BankTableRow";

export default function QuestionBankPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
  const [sortField, setSortField] =
    useState<keyof QuestionBank>(DEFAULT_SORT_FIELD);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    DEFAULT_SORT_DIRECTION,
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState<QuestionBank | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedBanks, setSelectedBanks] = useState<Set<string>>(new Set());

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

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
        const response = await Bank.getAllBanks(queryParams);

        // Transform API response to match QuestionBank interface
        const transformedBanks: QuestionBank[] = response.content.map(
          transformApiResponseToQuestionBank,
        );

        // Apply client-side filtering and sorting
        const filteredBanks = filterBanks(
          transformedBanks,
          searchTerm,
          semesterFilter,
        );
        const sortedBanks = sortBanks(filteredBanks, sortField, sortDirection);

        // Get pagination info from response
        const totalBanks = response.totalElements || 0;
        const totalPages = response.totalPages || 0;

        return {
          banks: sortedBanks,
          totalBanks,
          totalPages,
        };
      } catch (error: unknown) {
        // Properly type the error and provide more descriptive messages based on error type
        if (error instanceof Error) {
          toast(`Failed to load question banks: ${error.message}`);
        } else if (typeof error === "object" && error && "response" in error) {
          // Axios error
          const axiosError = error as {
            response?: { status: number; data?: unknown };
          };
          const statusCode = axiosError.response?.status;
          toast(`Failed to load question banks: Server returned ${statusCode}`);
        } else {
          toast("Failed to load question banks: Unknown error");
        }

        return {
          banks: [],
          totalBanks: 0,
          totalPages: 0,
        };
      }
    },
  });

  const generatePageNumbers = useMemo(() => {
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
  }, [data?.totalPages, page]);

  // Single delete action
  const deleteBankMutation = useMutation({
    mutationFn: async (bankId: string) => {
      return await Bank.deleteBank(bankId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      toast("Question bank deleted successfully.");
    },
    onError: () => {
      toast("Failed to delete question bank. Please try again.");
    },
  });

  // Filter and sort options
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

  // Handlers with useCallback for performance
  const handleEditBank = useCallback((bank: QuestionBank) => {
    setCurrentBank(bank);
    setDialogMode("edit");
    setDialogOpen(true);
  }, []);

  const handleShare = useCallback(
    (bank: QuestionBank) => (e: React.MouseEvent) => {
      setCurrentBank(bank);
      e.preventDefault();
      e.stopPropagation();
      setIsShareDialogOpen(true);
    },
    [],
  );

  const handleViewBank = useCallback(
    (bankId: string) => {
      router.push(`/question-bank/${bankId}`);
    },
    [router],
  );

  const handleDeleteBank = useCallback(
    (bankId: string) => {
      deleteBankMutation.mutate(bankId);
    },
    [deleteBankMutation],
  );

  const handleSort = useCallback(
    (field: keyof QuestionBank) => {
      if (field === sortField) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection],
  );

  const getSortIndicator = useCallback(
    (field: keyof QuestionBank) => {
      if (field !== sortField) return null;
      return sortDirection === "asc" ? " ↑" : " ↓";
    },
    [sortField, sortDirection],
  );

  const handleResetFilters = useCallback(() => {
    setSemesterFilter(null);
    setSearchTerm("");
  }, []);

  const handleBankSelect = useCallback((bankId: string, selected: boolean) => {
    setSelectedBanks((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(bankId);
      } else {
        newSet.delete(bankId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allBankIds = new Set(data?.banks.map((bank) => bank.id) || []);
        setSelectedBanks(allBankIds);
      } else {
        setSelectedBanks(new Set());
      }
    },
    [data?.banks],
  );

  const isAllSelected = useMemo(() => {
    const bankIds = data?.banks.map((bank) => bank.id) || [];
    return bankIds.length > 0 && bankIds.every((id) => selectedBanks.has(id));
  }, [data?.banks, selectedBanks]);

  const isIndeterminate = useMemo(() => {
    const bankIds = data?.banks.map((bank) => bank.id) || [];
    const selectedCount = bankIds.filter((id) => selectedBanks.has(id)).length;
    return selectedCount > 0 && selectedCount < bankIds.length;
  }, [data?.banks, selectedBanks]);

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
          <div className="flex items-center gap-2">
            {selectedBanks.size > 0 && (
              <>
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm text-muted-foreground">
                    {selectedBanks.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Add download functionality for selected banks
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Add upload functionality for selected banks
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Add copy functionality for selected banks
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBanks(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </>
            )}
            <Button
              onClick={() => {
                setDialogMode("add");
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Bank
            </Button>
          </div>
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
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            )}

            <div className="rounded-md border relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <div className="relative">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          className="h-5 w-5"
                          aria-label="Select all"
                        />
                        {isIndeterminate && (
                          <Minus className="absolute inset-0 h-3 w-3 m-auto text-primary-foreground" />
                        )}
                      </div>
                    </TableHead>
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
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
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
                      <BankTableRow
                        key={bank.id}
                        bank={bank}
                        onEdit={handleEditBank}
                        onDelete={handleDeleteBank}
                        onShare={handleShare}
                        onView={handleViewBank}
                        isSelected={selectedBanks.has(bank.id)}
                        onSelect={handleBankSelect}
                      />
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

                  {generatePageNumbers.map(
                    (pageNumber: string | number, index: number) => (
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
                    ),
                  )}

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

      {isShareDialogOpen && (
        <ShareDialog
          bankId={currentBank?.id || ""}
          open={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
        />
      )}
    </div>
  );
}
