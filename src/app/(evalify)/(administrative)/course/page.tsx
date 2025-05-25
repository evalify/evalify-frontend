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
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

enum CourseType {
  CORE = "CORE",
  ELECTIVE = "ELECTIVE",
  MICRO_CREDENTIAL = "MICRO_CREDENTIAL",
}

interface Course {
  id: string;
  name: string;
  description: string;
  type: CourseType;
  semester: number;
  studentCount: number;
  instructorCount: number;
  batchCount: number;
  quizCount: number;
  bankCount: number;
  isActive: boolean;
}

const mockCourses: Course[] = Array.from({ length: 30 }, (_, i) => {
  const courseNames = [
    "Data Structures and Algorithms",
    "Database Management Systems",
    "Object Oriented Programming",
    "Computer Networks",
    "Software Engineering",
    "Machine Learning",
    "Web Development",
    "Mobile App Development",
    "Artificial Intelligence",
    "Cybersecurity Fundamentals",
    "Digital Marketing",
    "Business Analytics",
    "Financial Management",
    "Project Management",
    "Human Resource Management",
  ];

  return {
    id: `uuid-course-${i + 1}`,
    name: courseNames[i % courseNames.length],
    description: `Comprehensive course covering ${courseNames[i % courseNames.length].toLowerCase()} concepts and practical applications.`,
    type: Object.values(CourseType)[i % 3],
    semester: Math.floor(Math.random() * 8) + 1,
    studentCount: Math.floor(Math.random() * 80) + 20,
    instructorCount: Math.floor(Math.random() * 3) + 1,
    batchCount: Math.floor(Math.random() * 5) + 1,
    quizCount: Math.floor(Math.random() * 20) + 5,
    bankCount: Math.floor(Math.random() * 8) + 2,
    isActive: i % 7 !== 0,
  };
});

const AddCourseDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course with details and assign to semester.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input id="course-name" placeholder="Data Structures" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-type">Course Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CourseType.CORE}>Core</SelectItem>
                  <SelectItem value={CourseType.ELECTIVE}>Elective</SelectItem>
                  <SelectItem value={CourseType.MICRO_CREDENTIAL}>
                    Micro Credential
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Course description and objectives..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              type="number"
              placeholder="1"
              min="1"
              max="8"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assign Instructors</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select instructors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instructor1">Dr. John Smith</SelectItem>
                  <SelectItem value="instructor2">Prof. Jane Doe</SelectItem>
                  <SelectItem value="instructor3">Dr. Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign Batches</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="batch1">Batch 2024-CS-A</SelectItem>
                  <SelectItem value="batch2">Batch 2024-CS-B</SelectItem>
                  <SelectItem value="batch3">Batch 2023-IT-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function CoursePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Course>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "courses",
      page,
      pageSize,
      searchTerm,
      typeFilter,
      semesterFilter,
      statusFilter,
      sortField,
      sortDirection,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      let filteredCourses = [...mockCourses];

      if (searchTerm) {
        filteredCourses = filteredCourses.filter(
          (course) =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (typeFilter) {
        filteredCourses = filteredCourses.filter(
          (course) => course.type === typeFilter,
        );
      }

      if (semesterFilter) {
        filteredCourses = filteredCourses.filter(
          (course) => course.semester.toString() === semesterFilter,
        );
      }

      if (statusFilter) {
        const isActive = statusFilter === "active";
        filteredCourses = filteredCourses.filter(
          (course) => course.isActive === isActive,
        );
      }

      filteredCourses.sort((a, b) => {
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

      const totalCourses = filteredCourses.length;
      const totalPages = Math.ceil(totalCourses / pageSize);
      const paginatedCourses = filteredCourses.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      return {
        courses: paginatedCourses,
        totalCourses,
        totalPages,
      };
    },
  });

  const handleSort = (field: keyof Course) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (field: keyof Course) => {
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

  const getTypeColor = (type: CourseType) => {
    switch (type) {
      case CourseType.CORE:
        return "bg-red-100 text-red-800 border-red-200";
      case CourseType.ELECTIVE:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case CourseType.MICRO_CREDENTIAL:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const uniqueSemesters = Array.from(
    new Set(mockCourses.map((c) => c.semester)),
  ).sort((a, b) => a - b);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              Course Management
            </CardTitle>
            <CardDescription>
              Manage courses, assignments, and academic content
            </CardDescription>
          </div>
          <AddCourseDialog />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 w-full max-w-sm items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
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
                      keyof Course,
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
                    <SelectItem value="type-asc">Type (A-Z)</SelectItem>
                    <SelectItem value="type-desc">Type (Z-A)</SelectItem>
                    <SelectItem value="studentCount-desc">
                      Most Students
                    </SelectItem>
                    <SelectItem value="studentCount-asc">
                      Least Students
                    </SelectItem>
                    <SelectItem value="quizCount-desc">Most Quizzes</SelectItem>
                    <SelectItem value="quizCount-asc">Least Quizzes</SelectItem>
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
                    htmlFor="type-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Type:
                  </Label>
                  <Select
                    value={typeFilter || "all"}
                    onValueChange={(value) =>
                      setTypeFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger id="type-filter" className="w-[140px]">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value={CourseType.CORE}>Core</SelectItem>
                      <SelectItem value={CourseType.ELECTIVE}>
                        Elective
                      </SelectItem>
                      <SelectItem value={CourseType.MICRO_CREDENTIAL}>
                        Micro Credential
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="semester-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Semester:
                  </Label>
                  <Select
                    value={semesterFilter || "all"}
                    onValueChange={(value) =>
                      setSemesterFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger id="semester-filter" className="w-[120px]">
                      <SelectValue placeholder="All semesters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {uniqueSemesters.map((semester) => (
                        <SelectItem key={semester} value={semester.toString()}>
                          Semester {semester}
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
                    setTypeFilter(null);
                    setSemesterFilter(null);
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
                      Course Name{getSortIndicator("name")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      Type{getSortIndicator("type")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("semester")}
                    >
                      Semester{getSortIndicator("semester")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("studentCount")}
                    >
                      Students{getSortIndicator("studentCount")}
                    </TableHead>
                    <TableHead>Instructors</TableHead>
                    <TableHead>Batches</TableHead>
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
                          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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
                  ) : data?.courses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        No courses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <div className="font-medium truncate">
                              {course.name}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {course.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getTypeColor(course.type)}
                          >
                            {course.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Semester {course.semester}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users
                              size={14}
                              className="text-muted-foreground"
                            />
                            {course.studentCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <GraduationCap
                              size={14}
                              className="text-muted-foreground"
                            />
                            {course.instructorCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar
                              size={14}
                              className="text-muted-foreground"
                            />
                            {course.batchCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen
                              size={14}
                              className="text-muted-foreground"
                            />
                            {course.quizCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen
                              size={14}
                              className="text-muted-foreground"
                            />
                            {course.bankCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={course.isActive ? "default" : "secondary"}
                          >
                            {course.isActive ? "Active" : "Inactive"}
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
                              <DropdownMenuItem>Edit Course</DropdownMenuItem>
                              <DropdownMenuItem>
                                Manage Students
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Manage Instructors
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Manage Batches
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Quizzes</DropdownMenuItem>
                              <DropdownMenuItem>
                                Question Banks
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className={
                                  course.isActive
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                              >
                                {course.isActive ? "Deactivate" : "Activate"}
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
                {Math.min((page - 1) * pageSize + 1, data?.totalCourses || 0)}{" "}
                to {Math.min(page * pageSize, data?.totalCourses || 0)} of{" "}
                {data?.totalCourses || 0} courses
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
