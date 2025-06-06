"use client";

import { useState } from "react";
import SemesterGrid from "@/components/admin/SemesterGrid";
import SemesterCourses from "@/components/admin/SemesterCourses";
import CourseDetailedView from "@/components/admin/CourseDetailedView";

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

interface Quiz {
  id: string;
  title: string;
  date: string;
  averageScore: number;
  totalQuestions: number;
  participantCount: number;
}

export default function Page() {
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Sample courses data
  const allCourses: Course[] = [
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
      ],
    },
    {
      code: "MA101",
      name: "Calculus I",
      semester: "1",
      status: "Active",
      credits: 4,
      description:
        "Introduction to differential and integral calculus with applications in science and engineering.",
      instructorName: "Prof. Sarah Johnson",
      instructorEmail: "sarah.johnson@university.edu",
      learningOutcomes: [
        "Master techniques of differentiation and integration",
        "Apply calculus concepts to solve real-world problems",
      ],
    },
    {
      code: "ENG101",
      name: "English Composition",
      semester: "1",
      status: "Active",
      credits: 3,
      description:
        "Development of writing skills through practice in various forms of composition.",
      instructorName: "Dr. Emily Wilson",
      instructorEmail: "emily.wilson@university.edu",
    },
    {
      code: "CS102",
      name: "Programming Fundamentals",
      semester: "2",
      status: "Active",
      credits: 3,
      description:
        "Advanced programming concepts including object-oriented programming and data structures.",
      instructorName: "Dr. Michael Brown",
      instructorEmail: "michael.brown@university.edu",
    },
    {
      code: "MA102",
      name: "Discrete Mathematics",
      semester: "2",
      status: "Active",
      credits: 4,
      description:
        "Mathematical structures and methods that are fundamentally discrete rather than continuous.",
      instructorName: "Prof. Emily Davis",
      instructorEmail: "emily.davis@university.edu",
    },
    {
      code: "PHY101",
      name: "Physics I",
      semester: "2",
      status: "Active",
      credits: 4,
      description:
        "Introduction to mechanics, thermodynamics, and wave phenomena.",
      instructorName: "Dr. James Miller",
      instructorEmail: "james.miller@university.edu",
    },
    {
      code: "CS201",
      name: "Data Structures",
      semester: "3",
      status: "Active",
      credits: 3,
      description:
        "Study of data structures and their applications including arrays, linked lists, stacks, queues, trees, and graphs.",
      instructorName: "Dr. Robert Wilson",
      instructorEmail: "robert.wilson@university.edu",
    },
    {
      code: "CS202",
      name: "Computer Architecture",
      semester: "3",
      status: "Active",
      credits: 3,
      description:
        "Introduction to computer organization and architecture principles.",
      instructorName: "Prof. Lisa Chen",
      instructorEmail: "lisa.chen@university.edu",
    },
    {
      code: "CS301",
      name: "Database Systems",
      semester: "5",
      status: "Active",
      credits: 4,
      description:
        "Introduction to database management systems, including data modeling, relational databases, SQL, and normalization.",
      instructorName: "Dr. Lisa Anderson",
      instructorEmail: "lisa.anderson@university.edu",
    },
    {
      code: "CS401",
      name: "Software Engineering",
      semester: "7",
      status: "Active",
      credits: 4,
      description:
        "Principles and practices of software development including project management, testing, and maintenance.",
      instructorName: "Dr. Kevin Zhang",
      instructorEmail: "kevin.zhang@university.edu",
    },
  ];

  // Sample quiz data
  const courseQuizzes: Record<string, Quiz[]> = {
    CS101: [
      {
        id: "1",
        title: "Basic Programming Concepts",
        date: "2024-01-15",
        averageScore: 85.5,
        totalQuestions: 20,
        participantCount: 45,
      },
      {
        id: "2",
        title: "Variables and Data Types",
        date: "2024-01-22",
        averageScore: 78.2,
        totalQuestions: 15,
        participantCount: 43,
      },
      {
        id: "3",
        title: "Control Structures",
        date: "2024-01-29",
        averageScore: 82.7,
        totalQuestions: 25,
        participantCount: 44,
      },
      {
        id: "4",
        title: "Functions and Methods",
        date: "2024-02-05",
        averageScore: 79.8,
        totalQuestions: 18,
        participantCount: 42,
      },
      {
        id: "5",
        title: "Arrays and Lists",
        date: "2024-02-12",
        averageScore: 88.1,
        totalQuestions: 22,
        participantCount: 46,
      },
    ],
    MA101: [
      {
        id: "1",
        title: "Limits and Continuity",
        date: "2024-01-16",
        averageScore: 76.3,
        totalQuestions: 15,
        participantCount: 38,
      },
      {
        id: "2",
        title: "Derivatives",
        date: "2024-01-23",
        averageScore: 81.4,
        totalQuestions: 20,
        participantCount: 37,
      },
    ],
  };

  const handleSemesterSelect = (semester: number) => {
    setSelectedSemester(semester);
    setSelectedCourse(null);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToSemesters = () => {
    setSelectedSemester(null);
    setSelectedCourse(null);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  const getCoursesForSemester = (semester: number) => {
    return allCourses.filter(
      (course) => course.semester === semester.toString(),
    );
  };

  const getQuizzesForCourse = (courseCode: string) => {
    return courseQuizzes[courseCode] || [];
  };

  // If a course is selected, show detailed view
  if (selectedCourse) {
    return (
      <CourseDetailedView
        course={selectedCourse}
        quizzes={getQuizzesForCourse(selectedCourse.code)}
        onBack={handleBackToCourses}
      />
    );
  }

  // If a semester is selected, show courses for that semester
  if (selectedSemester) {
    return (
      <SemesterCourses
        semester={selectedSemester}
        courses={getCoursesForSemester(selectedSemester)}
        onBack={handleBackToSemesters}
        onCourseSelect={handleCourseSelect}
      />
    );
  }

  // Default view: show semester grid
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Academic Semesters
          </h1>
        </div>
        <SemesterGrid
          onSemesterSelect={handleSemesterSelect}
          courses={allCourses}
        />
      </div>
    </div>
  );
}
