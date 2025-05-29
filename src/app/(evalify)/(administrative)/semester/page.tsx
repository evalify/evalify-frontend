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
  BookOpen,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Semester {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
  courseCount: number;
  managerCount: number;
  createdAt: string;
}

const mockSemesters: Semester[] = Array.from({ length: 50 }, (_, i) => {
  const years = [2024, 2023, 2022, 2021, 2020];
  const year = years[i % years.length];
  const isEven = i % 2 === 0;
  const semesterType = isEven ? "Even" : "Odd";

  return {
    id: `uuid-semester-${i + 1}`,
    name: `${semesterType} Semester ${year}`,
    year: year,
    isActive: i % 7 !== 0,
    courseCount: Math.floor(Math.random() * 25) + 5,
    managerCount: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(year, i % 12, 1 + i).toISOString(),
  };
});

const AddSemesterDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedSemesterType, setSelectedSemesterType] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const getSemesterName = () => {
    if (selectedSemesterType && selectedYear) {
      return `${selectedSemesterType.charAt(0).toUpperCase() + selectedSemesterType.slice(1)} Semester ${selectedYear}`;
    }
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add Semester
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Semester</DialogTitle>
          <DialogDescription>
            Create a new semester with courses and manager assignments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester-type">Semester Type</Label>
              <Select
                value={selectedSemesterType}
                onValueChange={setSelectedSemesterType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="odd">Odd Semester</SelectItem>
                  <SelectItem value="even">Even Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2024"
                min="2020"
                max="2030"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester-name">Semester Name</Label>
            <Input
              id="semester-name"
              placeholder="Even Semester 2024"
              value={getSemesterName()}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label>Assign Managers</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select managers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager1">Dr. Sarah Wilson</SelectItem>
                <SelectItem value="manager2">Prof. Robert Chen</SelectItem>
                <SelectItem value="manager3">Dr. Emily Davis</SelectItem>
                <SelectItem value="manager4">Prof. Michael Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="active" defaultChecked />
            <Label htmlFor="active">Active Semester</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create Semester</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function SemesterPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Semester>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "semesters",
      page,
      pageSize,
      searchTerm,
      yearFilter,
      statusFilter,
      sortField,
      sortDirection,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let filteredSemesters = [...mockSemesters];

      if (searchTerm) {
        filteredSemesters = filteredSemesters.filter((semester) =>
          semester.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (yearFilter) {
        filteredSemesters = filteredSemesters.filter(
          (semester) => semester.year.toString() === yearFilter,
        );
      }

      if (statusFilter) {
        const isActive = statusFilter === "active";
        filteredSemesters = filteredSemesters.filter(
          (semester) => semester.isActive === isActive,
        );
      }

      filteredSemesters.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          if (sortField === "createdAt") {
            const aDate = new Date(aValue).getTime();
            const bDate = new Date(bValue).getTime();
            return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
          }
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

      const totalSemesters = filteredSemesters.length;
      const totalPages = Math.ceil(totalSemesters / pageSize);
      const paginatedSemesters = filteredSemesters.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      return {
        semesters: paginatedSemesters,
        totalSemesters,
        totalPages,
      };
    },
  });

  const handleSort = (field: keyof Semester) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (field: keyof Semester) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  const uniqueYears = Array.from(
    new Set(mockSemesters.map((s) => s.year)),
  ).sort((a, b) => b - a);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              Semester Management
            </CardTitle>
            <CardDescription>
              Manage academic semesters, courses, and assignments
            </CardDescription>
          </div>
          <AddSemesterDialog />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 w-full max-w-sm items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search semesters..."
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
                      keyof Semester,
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
                    <SelectItem value="year-desc">Year (Newest)</SelectItem>
                    <SelectItem value="year-asc">Year (Oldest)</SelectItem>
                    <SelectItem value="courseCount-desc">
                      Most Courses
                    </SelectItem>
                    <SelectItem value="courseCount-asc">
                      Least Courses
                    </SelectItem>
                    <SelectItem value="createdAt-desc">
                      Recently Created
                    </SelectItem>
                    <SelectItem value="createdAt-asc">
                      Oldest Created
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
                      Semester Name{getSortIndicator("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("year")}
                    >
                      Year{getSortIndicator("year")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("courseCount")}
                    >
                      Courses{getSortIndicator("courseCount")}
                    </TableHead>
                    <TableHead>Managers</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      Created{getSortIndicator("createdAt")}
                    </TableHead>
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
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data?.semesters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No semesters found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.semesters.map((semester) => (
                      <TableRow key={semester.id}>
                        <TableCell className="font-medium">
                          {semester.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            {semester.year}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen
                              size={14}
                              className="text-muted-foreground"
                            />
                            {semester.courseCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <GraduationCap
                              size={14}
                              className="text-muted-foreground"
                            />
                            {semester.managerCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar
                              size={14}
                              className="text-muted-foreground"
                            />
                            {formatDate(semester.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              semester.isActive ? "default" : "secondary"
                            }
                          >
                            {semester.isActive ? "Active" : "Inactive"}
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
                              <DropdownMenuItem>Edit Semester</DropdownMenuItem>
                              <DropdownMenuItem>
                                Manage Courses
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Manage Managers
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className={
                                  semester.isActive
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                              >
                                {semester.isActive ? "Deactivate" : "Activate"}
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
                {Math.min((page - 1) * pageSize + 1, data?.totalSemesters || 0)}{" "}
                to {Math.min(page * pageSize, data?.totalSemesters || 0)} of{" "}
                {data?.totalSemesters || 0} semesters
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
