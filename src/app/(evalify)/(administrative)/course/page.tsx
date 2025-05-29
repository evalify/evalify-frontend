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
  GraduationCap,
  Calendar,
  Trash2,
  UserCheck,
  UserX,
  CheckSquare,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";

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
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

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
              <MultiSelect
                options={[
                  { value: "instructor1", label: "Dr. John Smith" },
                  { value: "instructor2", label: "Prof. Jane Doe" },
                  { value: "instructor3", label: "Dr. Mike Johnson" },
                ]}
                value={selectedInstructors}
                onValueChange={setSelectedInstructors}
                placeholder="Select instructors"
              />
            </div>
            <div className="space-y-2">
              <Label>Assign Batches</Label>
              <MultiSelect
                options={[
                  { value: "batch1", label: "Batch 2024-CS-A" },
                  { value: "batch2", label: "Batch 2024-CS-B" },
                  { value: "batch3", label: "Batch 2023-IT-A" },
                ]}
                value={selectedBatches}
                onValueChange={setSelectedBatches}
                placeholder="Select batches"
              />
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

  // Bulk operations state
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<
    "activate" | "deactivate" | "delete" | null
  >(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const toast = useToast();

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

  const uniqueTypes = [
    { value: CourseType.CORE, label: "Core" },
    { value: CourseType.ELECTIVE, label: "Elective" },
    { value: CourseType.MICRO_CREDENTIAL, label: "Micro Credential" },
  ];

  const semesterOptions = uniqueSemesters.map((semester) => ({
    value: semester.toString(),
    label: `Semester ${semester}`,
  }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Bulk operations handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageCourseIds =
        data?.courses.map((course) => course.id) || [];
      setSelectedCourses(currentPageCourseIds);
      setSelectAll(true);
    } else {
      setSelectedCourses([]);
      setSelectAll(false);
    }
  };

  const handleSelectCourse = (courseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses((prev) => [...prev, courseId]);
    } else {
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
    }
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete") => {
    setBulkActionType(action);
    setShowBulkConfirm(true);
  };

  const executeBulkAction = async () => {
    if (!bulkActionType || selectedCourses.length === 0) return;

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

      toast.success(
        `${selectedCourses.length} course(s) ${actionText} successfully.`,
      );

      // Reset selections
      setSelectedCourses([]);
      setSelectAll(false);
      setShowBulkConfirm(false);
      setBulkActionType(null);
    } catch (error) {
      toast.error(`Failed to ${bulkActionType} courses. Please try again.`);
      console.log(error);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Effects for bulk operations
  useEffect(() => {
    setShowBulkActions(selectedCourses.length > 0);
  }, [selectedCourses]);

  useEffect(() => {
    if (data?.courses) {
      const currentPageCourseIds = data.courses.map((course) => course.id);
      const allSelected =
        currentPageCourseIds.length > 0 &&
        currentPageCourseIds.every((id) => selectedCourses.includes(id));
      setSelectAll(allSelected);
    }
  }, [selectedCourses, data?.courses]);

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
                  <SearchableSelect
                    options={uniqueTypes}
                    value={typeFilter || ""}
                    onValueChange={(value) => setTypeFilter(value || null)}
                    placeholder="All types"
                    className="w-[140px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="semester-filter"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Semester:
                  </Label>
                  <SearchableSelect
                    options={semesterOptions}
                    value={semesterFilter || ""}
                    onValueChange={(value) => setSemesterFilter(value || null)}
                    placeholder="All semesters"
                    className="w-[120px]"
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
            {showBulkActions && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {selectedCourses.length} course(s) selected
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
                      setSelectedCourses([]);
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
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </TableCell>
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
                      <TableCell colSpan={11} className="h-24 text-center">
                        No courses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center h-full">
                            <Checkbox
                              checked={selectedCourses.includes(course.id)}
                              onCheckedChange={(checked) =>
                                handleSelectCourse(
                                  course.id,
                                  checked as boolean,
                                )
                              }
                            />
                          </div>
                        </TableCell>
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

      <AlertDialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {bulkActionType} courses
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {bulkActionType === "delete"
                ? "delete these courses? This action cannot be undone."
                : bulkActionType === "activate"
                  ? "activate these courses?"
                  : "deactivate these courses?"}
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
                : `Yes, ${bulkActionType} courses`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
