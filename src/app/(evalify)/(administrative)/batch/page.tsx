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
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

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
  isActive: i % 6 !== 0,
  studentCount: Math.floor(Math.random() * 50) + 20,
  managerCount: Math.floor(Math.random() * 3) + 1,
  semesterCount: Math.floor(Math.random() * 8) + 1,
  quizCount: Math.floor(Math.random() * 15) + 5,
  bankCount: Math.floor(Math.random() * 10) + 2,
}));

const AddBatchDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogDescription>
            Create a new batch with department and section details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch-name">Batch Name</Label>
              <Input id="batch-name" placeholder="Batch 2024-CS-A" />
            </div>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Batch description..."
              className="min-h-[80px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="active" defaultChecked />
            <Label htmlFor="active">Active Batch</Label>
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
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Batch>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "batches",
      page,
      pageSize,
      searchTerm,
      departmentFilter,
      yearFilter,
      statusFilter,
      sortField,
      sortDirection,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let filteredBatches = [...mockBatches];

      if (searchTerm) {
        filteredBatches = filteredBatches.filter(
          (batch) =>
            batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            batch.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            batch.section.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (departmentFilter) {
        filteredBatches = filteredBatches.filter(
          (batch) => batch.department === departmentFilter,
        );
      }

      if (yearFilter) {
        filteredBatches = filteredBatches.filter(
          (batch) => batch.batch.toString() === yearFilter,
        );
      }

      if (statusFilter) {
        const isActive = statusFilter === "active";
        filteredBatches = filteredBatches.filter(
          (batch) => batch.isActive === isActive,
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

  const uniqueYears = Array.from(new Set(mockBatches.map((b) => b.batch))).sort(
    (a, b) => b - a,
  );

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              Batch Management
            </CardTitle>
            <CardDescription>
              Manage academic batches, departments, and sections
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
                <Select
                  value={`${sortField}-${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split("-") as [
                      keyof Batch,
                      "asc" | "desc",
                    ];
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="department-asc">
                      Department (A-Z)
                    </SelectItem>
                    <SelectItem value="department-desc">
                      Department (Z-A)
                    </SelectItem>
                    <SelectItem value="batch-desc">Year (Newest)</SelectItem>
                    <SelectItem value="batch-asc">Year (Oldest)</SelectItem>
                    <SelectItem value="studentCount-desc">
                      Most Students
                    </SelectItem>
                    <SelectItem value="studentCount-asc">
                      Least Students
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                    htmlFor="dept-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Department:
                  </Label>
                  <Select
                    value={departmentFilter || "all"}
                    onValueChange={(value) =>
                      setDepartmentFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger id="dept-filter" className="w-[180px]">
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="year-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Year:
                  </Label>
                  <Select
                    value={yearFilter || "all"}
                    onValueChange={(value) =>
                      setYearFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger id="year-filter" className="w-[120px]">
                      <SelectValue placeholder="All years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="status-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Status:
                  </Label>
                  <Select
                    value={statusFilter || "all"}
                    onValueChange={(value) =>
                      setStatusFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger id="status-filter" className="w-[120px]">
                      <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDepartmentFilter(null);
                    setYearFilter(null);
                    setStatusFilter(null);
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
                      Batch Name{getSortIndicator("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("batch")}
                    >
                      Year{getSortIndicator("batch")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("department")}
                    >
                      Department{getSortIndicator("department")}
                    </TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("studentCount")}
                    >
                      Students{getSortIndicator("studentCount")}
                    </TableHead>
                    <TableHead>Managers</TableHead>
                    <TableHead>Semesters</TableHead>
                    <TableHead>Quizzes</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("isActive")}
                    >
                      Status{getSortIndicator("isActive")}
                    </TableHead>
                    <TableHead className="w-[70px]"></TableHead>
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
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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
                      <TableCell colSpan={10} className="h-24 text-center">
                        No batches found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.batches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">
                          {batch.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {batch.batch}
                          </Badge>
                        </TableCell>
                        <TableCell>{batch.department}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{batch.section}</Badge>
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
                              <DropdownMenuItem>
                                View Semesters
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Quizzes</DropdownMenuItem>
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
    </div>
  );
}
