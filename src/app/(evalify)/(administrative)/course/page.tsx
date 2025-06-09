"use client";
import { useState, useEffect } from "react";
import type { Filters } from "@/components/admin/FilterButton";
import CourseManagement from "@/components/admin/CourseManagement";
import NewCourse from "@/components/admin/NewCourse";
import CourseHeader from "@/components/admin/CourseHeader";
import SelectionControls from "@/components/admin/SelectionControls";
import CourseTable from "@/components/admin/CourseTable";
import DeleteDialogs from "@/components/admin/DeleteDialogs";
import FilterIndicator from "@/components/admin/FilterIndicator";
import CourseDetails from "@/components/admin/CourseDetails";

interface Course {
  code: string;
  name: string;
  semester: string;
  status: string;
  credits: number;
  description?: string;
  instructorName?: string;
  instructorEmail?: string;
  learningOutcomes?: string[];
}

export default function Page() {
  const [allCourses, setAllCourses] = useState<Course[]>([
    {
      code: "CS101",
      name: "Introduction to Computing",
      semester: "1",
      status: "Active",
      credits: 3,
      description:
        "This course introduces students to the fundamental concepts of computer science and programming. Students will learn basic programming constructs, problem-solving techniques, and computational thinking.",
      instructorName: "Dr. John Smith",
      instructorEmail: "john.smith@university.edu",
      learningOutcomes: [
        "Understand basic programming concepts and syntax",
        "Apply problem-solving techniques to computational problems",
        "Develop simple programs using control structures and data types",
        "Demonstrate understanding of algorithm design principles",
      ],
    },
    {
      code: "MA102",
      name: "Discrete Mathematics",
      semester: "2",
      status: "Archived",
      credits: 4,
      description:
        "An introduction to mathematical structures and methods that are fundamentally discrete rather than continuous. Topics include logic, set theory, combinatorics, and graph theory.",
      instructorName: "Prof. Sarah Johnson",
      instructorEmail: "sarah.johnson@university.edu",
      learningOutcomes: [
        "Master fundamental concepts of discrete mathematics",
        "Apply logical reasoning to mathematical proofs",
        "Solve combinatorial problems using appropriate techniques",
        "Analyze graph theory problems and applications",
      ],
    },
    {
      code: "CS201",
      name: "Data Structures",
      semester: "3",
      status: "Active",
      credits: 3,
      description:
        "Study of data structures and their applications. Topics include arrays, linked lists, stacks, queues, trees, and graphs, along with their implementation and analysis.",
      instructorName: "Dr. Michael Brown",
      instructorEmail: "michael.brown@university.edu",
      learningOutcomes: [
        "Implement and analyze fundamental data structures",
        "Choose appropriate data structures for specific problems",
        "Understand time and space complexity analysis",
        "Design efficient algorithms using various data structures",
      ],
    },
    {
      code: "CS301",
      name: "Database Systems",
      semester: "5",
      status: "Inactive",
      credits: 4,
      description:
        "Introduction to database management systems, including data modeling, relational databases, SQL, normalization, and transaction processing.",
      instructorName: "Dr. Emily Davis",
      instructorEmail: "emily.davis@university.edu",
      learningOutcomes: [
        "Design and implement relational database schemas",
        "Write complex SQL queries for data retrieval and manipulation",
        "Apply normalization techniques to optimize database design",
        "Understand transaction processing and concurrency control",
      ],
    },
    {
      code: "MA201",
      name: "Calculus",
      semester: "2",
      status: "Active",
      credits: 5,
      description:
        "Differential and integral calculus with applications. Topics include limits, derivatives, integrals, and their applications in various fields.",
      instructorName: "Prof. Robert Wilson",
      instructorEmail: "robert.wilson@university.edu",
      learningOutcomes: [
        "Master techniques of differentiation and integration",
        "Apply calculus concepts to solve real-world problems",
        "Understand the fundamental theorem of calculus",
        "Analyze functions using calculus methods",
      ],
    },
  ]);

  const [filters, setFilters] = useState<Filters>({
    courseCode: "",
    courseName: "",
    semester: "",
    status: "",
  });

  const [filteredCourses, setFilteredCourses] = useState<Course[]>(allCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCourseForAction, setSelectedCourseForAction] =
    useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  // Function to add new course
  const handleAddCourse = (newCourse: Course) => {
    setAllCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  // Function to update existing course
  const handleUpdateCourse = (oldCode: string, updatedCourse: Course) => {
    setAllCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.code === oldCode) {
          // Ensure we preserve any fields that might not be in updatedCourse
          return {
            ...course,
            ...updatedCourse,
          };
        }
        return course;
      }),
    );

    // Update viewing course if it's the one being edited
    if (viewingCourse && viewingCourse.code === oldCode) {
      setViewingCourse((prev) => ({
        ...prev!,
        ...updatedCourse,
      }));
    }
  };

  // Function to delete course
  const handleDeleteCourse = (courseCode: string) => {
    setAllCourses((prevCourses) =>
      prevCourses.filter((course) => course.code !== courseCode),
    );
  };

  // Function to delete multiple courses
  const handleBulkDeleteCourses = (courseCodes: string[]) => {
    setAllCourses((prevCourses) =>
      prevCourses.filter((course) => !courseCodes.includes(course.code)),
    );
  };

  // Function to export courses to CSV
  const exportCoursesToCSV = (courses: Course[]) => {
    // Create CSV header
    const headers = [
      "Course Code",
      "Course Name",
      "Semester",
      "Status",
      "Credits",
    ];

    // Create CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...courses.map((course) =>
        [
          `"${course.code}"`,
          `"${course.name}"`,
          `"${course.semester}"`,
          `"${course.status}"`,
          `"${course.credits}"`,
        ].join(","),
      ),
    ];

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `courses_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Apply filters and search
  const applyFilters = () => {
    let result = [...allCourses];

    // Apply search query first (real-time search)
    if (searchQuery.trim()) {
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.status.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply filters (only when explicitly applied via button)
    if (filters.courseCode.trim()) {
      result = result.filter((course) =>
        course.code.toLowerCase().includes(filters.courseCode.toLowerCase()),
      );
    }

    if (filters.courseName.trim()) {
      result = result.filter((course) =>
        course.name.toLowerCase().includes(filters.courseName.toLowerCase()),
      );
    }

    if (filters.semester.trim()) {
      result = result.filter((course) => course.semester === filters.semester);
    }

    if (filters.status) {
      result = result.filter(
        (course) =>
          course.status.toLowerCase() === filters.status.toLowerCase(),
      );
    }

    setFilteredCourses(result);
  };

  // Apply filters when search query or courses change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, allCourses]);

  // Toggle select mode
  const handleSelectToggle = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      // Clear selections when exiting select mode
      setSelectedCourses(new Set());
    }
    // Clear any selected course for actions when toggling select mode
    setSelectedCourseForAction(null);
  };

  // Handle individual course selection
  const handleCourseSelect = (courseCode: string, checked: boolean) => {
    const newSelected = new Set(selectedCourses);
    if (checked) {
      newSelected.add(courseCode);
    } else {
      newSelected.delete(courseCode);
    }
    setSelectedCourses(newSelected);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allCodes = new Set(filteredCourses.map((course) => course.code));
      setSelectedCourses(allCodes);
    } else {
      setSelectedCourses(new Set());
    }
  };

  // Handle course row click (for edit/delete actions)
  const handleCourseClick = (course: Course) => {
    if (isSelectMode) return; // Don't show actions in select mode

    if (selectedCourseForAction?.code === course.code) {
      // If same course is clicked, deselect it
      setSelectedCourseForAction(null);
    } else {
      // Select this course for actions
      setSelectedCourseForAction(course);
    }
  };

  // Handle open button click
  const handleOpenClick = (course: Course) => {
    setViewingCourse(course);
    setSelectedCourseForAction(null);
  };

  // Handle edit button click
  const handleEditClick = (course: Course) => {
    setSelectedCourseForAction(course);
    setShowEditModal(true);
  };

  // Handle delete button click
  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteDialog(true);
  };

  // Handle bulk delete button click
  const handleBulkDeleteClick = () => {
    if (selectedCourses.size > 0) {
      setShowBulkDeleteDialog(true);
    }
  };

  // Handle bulk export button click
  const handleBulkExportClick = () => {
    const selectedCoursesData = allCourses.filter((course) =>
      selectedCourses.has(course.code),
    );
    exportCoursesToCSV(selectedCoursesData);
  };

  // Confirm single delete
  const confirmDelete = () => {
    if (courseToDelete) {
      handleDeleteCourse(courseToDelete.code);
      setShowDeleteDialog(false);
      setCourseToDelete(null);
      setSelectedCourseForAction(null);
    }
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    const courseCodesToDelete = Array.from(selectedCourses);
    handleBulkDeleteCourses(courseCodesToDelete);
    setShowBulkDeleteDialog(false);
    setSelectedCourses(new Set());
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setCourseToDelete(null);
  };

  // Cancel bulk delete
  const cancelBulkDelete = () => {
    setShowBulkDeleteDialog(false);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCourseForAction(null);
  };

  // Handle back from course details
  const handleBackFromDetails = () => {
    setViewingCourse(null);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      courseCode: "",
      courseName: "",
      semester: "",
      status: "",
    });
    applyFilters();
  };

  // Get selected courses data for display
  const selectedCoursesData = allCourses.filter((course) =>
    selectedCourses.has(course.code),
  );

  // If viewing a course, show the details view
  if (viewingCourse) {
    return (
      <CourseDetails
        course={viewingCourse}
        onBack={handleBackFromDetails}
        onEdit={handleEditClick}
        onUpdate={handleUpdateCourse}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="text-center m-1">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Academic Courses
        </h1>
      </div>
      <div className="flex flex-col gap-4 justify-end items-start p-4 w-full flex-shrink-0">
        <CourseManagement onAddCourse={handleAddCourse} />
      </div>

      <CourseHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={applyFilters}
        isSelectMode={isSelectMode}
        onToggleSelectMode={handleSelectToggle}
      />

      <SelectionControls
        isSelectMode={isSelectMode}
        selectedCourses={selectedCourses}
        filteredCourses={filteredCourses}
        onSelectAll={handleSelectAll}
        onBulkDelete={handleBulkDeleteClick}
        onBulkExport={handleBulkExportClick}
      />

      <CourseTable
        filteredCourses={filteredCourses}
        isSelectMode={isSelectMode}
        selectedCourses={selectedCourses}
        selectedCourseForAction={selectedCourseForAction}
        onCourseClick={handleCourseClick}
        onCourseSelect={handleCourseSelect}
        onOpenClick={handleOpenClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <FilterIndicator filters={filters} onClearFilters={clearAllFilters} />

      {/* Edit Course Modal */}
      <NewCourse
        isOpen={showEditModal}
        onClose={closeEditModal}
        onUpdateCourse={handleUpdateCourse}
        editingCourse={selectedCourseForAction}
      />

      {/* Delete Dialogs */}
      <DeleteDialogs
        showDeleteDialog={showDeleteDialog}
        showBulkDeleteDialog={showBulkDeleteDialog}
        courseToDelete={courseToDelete}
        selectedCourses={selectedCourses}
        selectedCoursesData={selectedCoursesData}
        onConfirmDelete={confirmDelete}
        onConfirmBulkDelete={confirmBulkDelete}
        onCancelDelete={cancelDelete}
        onCancelBulkDelete={cancelBulkDelete}
        setShowDeleteDialog={setShowDeleteDialog}
        setShowBulkDeleteDialog={setShowBulkDeleteDialog}
      />
    </div>
  );
}
