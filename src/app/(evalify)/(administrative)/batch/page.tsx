"use client";

import React, { useState, useEffect } from "react";
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
  DialogTrigger,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  BookOpen,
  Calendar,
  Trash2,
  UserCheck,
  UserX,
  CheckSquare,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Batch {
  id: string;
  name: string;
  batch: number;
  department: string;
  section: string;
  isActive: boolean;
  studentCount: number;
  managerCount: number;
  semesterCount: number;
  quizCount: number;
  bankCount: number;
}

const departments = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Economics",
  "Mathematics",
  "Physics",
];

const sections = ["A", "B", "C", "D", "E"];

const mockBatches: Batch[] = Array.from({ length: 25 }, (_, i) => ({
  id: `uuid-batch-${i + 1}`,
  name: `Batch ${2020 + (i % 5)}-${departments[i % departments.length]}-${
    sections[i % sections.length]
  }`,
  batch: 2020 + (i % 5),
  department: departments[i % departments.length],
  section: sections[i % sections.length],
  isActive: i % 8 !== 0,
  studentCount: Math.floor(Math.random() * 45) + 15,
  managerCount: Math.floor(Math.random() * 3) + 1,
  semesterCount: Math.floor(Math.random() * 8) + 1,
  quizCount: Math.floor(Math.random() * 20) + 5,
  bankCount: Math.floor(Math.random() * 8) + 2,
}));

const AddBatchDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedManager, setSelectedManager] = useState<string>("");

  const departmentOptions = departments.map((dept) => ({
    value: dept,
    label: dept,
  }));

  const sectionOptions = sections.map((section) => ({
    value: section,
    label: `Section ${section}`,
  }));

  const managerOptions = [
    { value: "manager1", label: "Dr. John Smith" },
    { value: "manager2", label: "Prof. Jane Doe" },
    { value: "manager3", label: "Dr. Mike Johnson" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogDescription>
            Create a new batch and assign students to specific semester and
            section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch-year">Batch Year</Label>
              <Input
                id="batch-year"
                type="number"
                placeholder="2024"
                min="2020"
                max="2030"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <SearchableSelect
                options={departmentOptions}
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                placeholder="Select department"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <SearchableSelect
              options={sectionOptions}
              value={selectedSection}
              onValueChange={setSelectedSection}
              placeholder="Select section"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional batch information..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assign Manager</Label>
              <SearchableSelect
                options={managerOptions}
                value={selectedManager}
                onValueChange={(value) => setSelectedManager(value)}
                placeholder="Select manager"
              />
            </div>
            <div className="space-y-2">
              <Label>Initial Semester</Label>
              <Input type="number" placeholder="1" min="1" max="8" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create Batch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function BatchPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [batchYearFilter, setBatchYearFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Batch>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);

  // Bulk operations state
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<
    "activate" | "deactivate" | "delete" | null
  >(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const { success, error } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [
      "batches",
      page,
      pageSize,
      searchTerm,
      departmentFilter,
      sectionFilter,
      statusFilter,
      batchYearFilter,
      sortField,
      sortDirection,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      let filteredBatches = [...mockBatches];

      if (searchTerm) {
        filteredBatches = filteredBatches.filter(
          (batch) =>
            batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            batch.department.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (departmentFilter) {
        filteredBatches = filteredBatches.filter(
          (batch) => batch.department === departmentFilter,
        );
      }

      if (sectionFilter) {
        filteredBatches = filteredBatches.filter(
          (batch) => batch.section === sectionFilter,
        );
      }

      if (statusFilter) {
        const isActive = statusFilter === "active";
        filteredBatches = filteredBatches.filter(
          (batch) => batch.isActive === isActive,
        );
      }

      if (batchYearFilter) {
        filteredBatches = filteredBatches.filter(
          (batch) => batch.batch.toString() === batchYearFilter,
        );
      }

      filteredBatches.sort((a, b) => {
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

        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortDirection === "asc"
            ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
            : (bValue ? 1 : 0) - (aValue ? 1 : 0);
        }

        return 0;
      });

      const totalBatches = filteredBatches.length;
      const totalPages = Math.ceil(totalBatches / pageSize);
      const paginatedBatches = filteredBatches.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      return {
        batches: paginatedBatches,
        totalBatches,
        totalPages,
      };
    },
  });

  const handleSort = (field: keyof Batch) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (field: keyof Batch) => {
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

  const uniqueDepartments = departments.map((dept) => ({
    value: dept,
    label: dept,
  }));

  const uniqueSections = sections.map((section) => ({
    value: section,
    label: `Section ${section}`,
  }));

  const uniqueBatchYears = Array.from(new Set(mockBatches.map((b) => b.batch)))
    .sort((a, b) => b - a)
    .map((year) => ({
      value: year.toString(),
      label: year.toString(),
    }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "batch-desc", label: "Newest First" },
    { value: "batch-asc", label: "Oldest First" },
    { value: "studentCount-desc", label: "Most Students" },
    { value: "studentCount-asc", label: "Least Students" },
  ];

  // Bulk operations handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageBatchIds = data?.batches.map((batch) => batch.id) || [];
      setSelectedBatches(currentPageBatchIds);
      setSelectAll(true);
    } else {
      setSelectedBatches([]);
      setSelectAll(false);
    }
  };

  const handleSelectBatch = (batchId: string, checked: boolean) => {
    if (checked) {
      setSelectedBatches((prev) => [...prev, batchId]);
    } else {
      setSelectedBatches((prev) => prev.filter((id) => id !== batchId));
    }
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete") => {
    setBulkActionType(action);
    setShowBulkConfirm(true);
  };

  const executeBulkAction = async () => {
    if (!bulkActionType || selectedBatches.length === 0) return;

    setIsBulkProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const actionText =
        bulkActionType === "activate"
          ? "activated"
          : bulkActionType === "deactivate"
            ? "deactivated"
            : "deleted";

      success(
        `${selectedBatches.length} batch(es) ${actionText} successfully.`,
      );
      // Reset selections
      setSelectedBatches([]);
      setSelectAll(false);
      setShowBulkConfirm(false);
      setBulkActionType(null);
    } catch (e) {
      error(`Failed to ${bulkActionType} batches. Please try again.`);
      console.log(e);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Effects for bulk operations
  useEffect(() => {
    setShowBulkActions(selectedBatches.length > 0);
  }, [selectedBatches]);

  useEffect(() => {
    if (data?.batches) {
      const currentPageBatchIds = data.batches.map((batch) => batch.id);
      const allSelected =
        currentPageBatchIds.length > 0 &&
        currentPageBatchIds.every((id) => selectedBatches.includes(id));
      setSelectAll(allSelected);
    }
  }, [selectedBatches, data?.batches]);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              Batch Management
            </CardTitle>
            <CardDescription>
              Manage student batches, sections, and enrollment
            </CardDescription>
          </div>
          <AddBatchDialog />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 w-full max-w-sm items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search batches..."
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
              <div className="flex items-center gap-2">
                <SearchableSelect
                  options={sortOptions}
                  value={`${sortField}-${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split("-") as [
                      keyof Batch,
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
                    htmlFor="department-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Department:
                  </Label>
                  <SearchableSelect
                    options={uniqueDepartments}
                    value={departmentFilter || ""}
                    onValueChange={(value) =>
                      setDepartmentFilter(value || null)
                    }
                    placeholder="All departments"
                    className="w-[180px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="section-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Section:
                  </Label>
                  <SearchableSelect
                    options={uniqueSections}
                    value={sectionFilter || ""}
                    onValueChange={(value) => setSectionFilter(value || null)}
                    placeholder="All sections"
                    className="w-[120px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="year-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Year:
                  </Label>
                  <SearchableSelect
                    options={uniqueBatchYears}
                    value={batchYearFilter || ""}
                    onValueChange={(value) => setBatchYearFilter(value || null)}
                    placeholder="All years"
                    className="w-[100px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="status-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Status:
                  </Label>
                  <SearchableSelect
                    options={statusOptions}
                    value={statusFilter || ""}
                    onValueChange={(value) => setStatusFilter(value || null)}
                    placeholder="All status"
                    className="w-[120px]"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDepartmentFilter(null);
                    setSectionFilter(null);
                    setBatchYearFilter(null);
                    setStatusFilter(null);
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
            {showBulkActions && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {selectedBatches.length} batch(es) selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("activate")}
                    disabled={isBulkProcessing}
                    className="gap-2 text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <UserCheck className="h-4 w-4" />
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("deactivate")}
                    disabled={isBulkProcessing}
                    className="gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <UserX className="h-4 w-4" />
                    Deactivate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("delete")}
                    disabled={isBulkProcessing}
                    className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedBatches([]);
                      setSelectAll(false);
                    }}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
            <div className="rounded-md border relative">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <div className="flex items-center h-full">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Batch Name{getSortIndicator("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("department")}
                    >
                      Department{getSortIndicator("department")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("section")}
                    >
                      Section{getSortIndicator("section")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("studentCount")}
                    >
                      Students{getSortIndicator("studentCount")}
                    </TableHead>
                    <TableHead>Managers</TableHead>
                    <TableHead>Semesters</TableHead>
                    <TableHead>Quizzes</TableHead>
                    <TableHead>Banks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
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
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data?.batches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="h-24 text-center">
                        No batches found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.batches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell>
                          <div className="flex items-center h-full">
                            <Checkbox
                              checked={selectedBatches.includes(batch.id)}
                              onCheckedChange={(checked) =>
                                handleSelectBatch(batch.id, checked as boolean)
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{batch.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Batch {batch.batch}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{batch.department}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-indigo-50 text-indigo-700 border-indigo-200"
                          >
                            Section {batch.section}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users
                              size={14}
                              className="text-muted-foreground"
                            />
                            {batch.studentCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users
                              size={14}
                              className="text-muted-foreground"
                            />
                            {batch.managerCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar
                              size={14}
                              className="text-muted-foreground"
                            />
                            {batch.semesterCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen
                              size={14}
                              className="text-muted-foreground"
                            />
                            {batch.quizCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen
                              size={14}
                              className="text-muted-foreground"
                            />
                            {batch.bankCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={batch.isActive ? "default" : "secondary"}
                          >
                            {batch.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Batch</DropdownMenuItem>
                              <DropdownMenuItem>
                                Manage Students
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Manage Managers
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Courses</DropdownMenuItem>
                              <DropdownMenuItem>View Quizzes</DropdownMenuItem>
                              <DropdownMenuItem>
                                Question Banks
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className={
                                  batch.isActive
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                              >
                                {batch.isActive ? "Deactivate" : "Activate"}
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
                Showing{" "}
                {Math.min((page - 1) * pageSize + 1, data?.totalBatches || 0)}{" "}
                to {Math.min(page * pageSize, data?.totalBatches || 0)} of{" "}
                {data?.totalBatches || 0} batches
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

      <AlertDialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {bulkActionType} batches
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {bulkActionType === "delete"
                ? "delete these batches? This action cannot be undone."
                : bulkActionType === "activate"
                  ? "activate these batches?"
                  : "deactivate these batches?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkAction}
              disabled={isBulkProcessing}
              className={
                bulkActionType === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : bulkActionType === "activate"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
              }
            >
              {isBulkProcessing
                ? `${bulkActionType}ing...`
                : `Yes, ${bulkActionType} batches`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
