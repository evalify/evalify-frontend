// API utilities for results data
import axiosInstance from "@/lib/axios/axios-client";
import type {
  TestSummary,
  DetailedTestResult,
} from "@/components/results/common/types";
import type {
  StudentOverallResult,
  CourseResult,
} from "@/components/results/student/types";
import type {
  TeacherCourseOverview,
  TestOverview,
  DetailedTestStatistics,
  PerformanceDistribution,
  StudentTestResult,
  QuestionStat,
} from "@/components/results/teacher/types";

export class ResultsAPI {
  // Get student's overall results summary
  static async getStudentOverview(
    studentId: string,
  ): Promise<StudentOverallResult> {
    try {
      const response = await axiosInstance.get(
        `/students/${studentId}/results/overview`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch student overview:", error);
      throw new Error("Failed to load student results overview");
    }
  }

  // Get course-wise results for a student
  static async getCourseResults(studentId: string): Promise<CourseResult[]> {
    try {
      const response = await axiosInstance.get(
        `/students/${studentId}/results/courses`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch course results:", error);
      throw new Error("Failed to load course results");
    }
  }

  // Get test summaries for a specific course
  static async getTestSummaries(
    studentId: string,
    courseId: string,
  ): Promise<TestSummary[]> {
    try {
      const response = await axiosInstance.get(
        `/students/${studentId}/courses/${courseId}/tests`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch test summaries:", error);
      throw new Error("Failed to load test summaries");
    }
  }

  // Get detailed test result
  static async getTestResult(
    studentId: string,
    testId: string,
  ): Promise<DetailedTestResult> {
    try {
      const response = await axiosInstance.get(
        `/students/${studentId}/tests/${testId}/result`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch test result:", error);
      throw new Error("Failed to load test result");
    }
  }

  // Get recent test results (for dashboard/overview)
  static async getRecentResults(
    studentId: string,
    limit: number = 5,
  ): Promise<TestSummary[]> {
    try {
      const response = await axiosInstance.get(
        `/students/${studentId}/results/recent?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recent results:", error);
      throw new Error("Failed to load recent results");
    }
  }
}

// Mock data for development/testing
export const MockResultsAPI = {
  getStudentOverview: async (
    studentId: string,
  ): Promise<StudentOverallResult> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      studentId,
      studentName: "John Doe",
      totalTests: 15,
      averageScore: 78.5,
      highestScore: 95,
      lowestScore: 62,
      totalTimeTaken: 450,
      recentTests: [
        {
          testId: "test-1",
          testName: "Data Structures Midterm",
          courseName: "Data Structures and Algorithms",
          score: 85,
          maxScore: 100,
          percentage: 85,
          timeTaken: 90,
          completedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 1 day ago (most recent)
          status: "completed",
        },
        {
          testId: "test-2",
          testName: "Database Design Quiz",
          courseName: "Database Management Systems",
          score: 92,
          maxScore: 100,
          percentage: 92,
          timeTaken: 45,
          completedAt: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 3 days ago
          status: "completed",
        },
        {
          testId: "test-3",
          testName: "OOP Concepts Test",
          courseName: "Object Oriented Programming",
          score: 78,
          maxScore: 100,
          percentage: 78,
          timeTaken: 60,
          completedAt: new Date(
            Date.now() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 6 days ago
          status: "completed",
        },
        // Note: We're only showing tests from the last 7 days, sorted by most recent
      ],
    };
  },
  getCourseResults: async (studentId: string): Promise<CourseResult[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // In real implementation, filter courses by studentId
    console.log("Loading courses for student:", studentId);

    return [
      {
        courseId: "course-1",
        courseName: "Data Structures and Algorithms",
        courseCode: "CS301",
        totalTests: 5,
        completedTests: 4,
        averageScore: 82.5,
        highestScore: 95,
        lastTestDate: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        testResults: [
          {
            testId: "test-1-1",
            testName: "Arrays and Linked Lists",
            score: 78,
            maxScore: 100,
            percentage: 78,
            timeTaken: 55,
            completedAt: new Date(
              Date.now() - 60 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 15,
            correctAnswers: 11,
            status: "completed",
          },
          {
            testId: "test-1-2",
            testName: "Stacks and Queues",
            score: 85,
            maxScore: 100,
            percentage: 85,
            timeTaken: 62,
            completedAt: new Date(
              Date.now() - 45 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 20,
            correctAnswers: 17,
            status: "completed",
          },
          {
            testId: "test-1-3",
            testName: "Trees and Graphs",
            score: 72,
            maxScore: 100,
            percentage: 72,
            timeTaken: 75,
            completedAt: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "hard",
            questionCount: 18,
            correctAnswers: 13,
            status: "completed",
          },
          {
            testId: "test-1-4",
            testName: "Sorting Algorithms",
            score: 95,
            maxScore: 100,
            percentage: 95,
            timeTaken: 48,
            completedAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "hard",
            questionCount: 20,
            correctAnswers: 19,
            status: "completed",
          },
        ],
      },
      {
        courseId: "course-2",
        courseName: "Database Management Systems",
        courseCode: "CS302",
        totalTests: 3,
        completedTests: 3,
        averageScore: 88.3,
        highestScore: 92,
        lastTestDate: new Date(
          Date.now() - 4 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        testResults: [
          {
            testId: "test-2-1",
            testName: "SQL Fundamentals",
            score: 90,
            maxScore: 100,
            percentage: 90,
            timeTaken: 40,
            completedAt: new Date(
              Date.now() - 40 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "easy",
            questionCount: 30,
            correctAnswers: 27,
            status: "completed",
          },
          {
            testId: "test-2-2",
            testName: "Database Design",
            score: 83,
            maxScore: 100,
            percentage: 83,
            timeTaken: 65,
            completedAt: new Date(
              Date.now() - 15 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 18,
            correctAnswers: 15,
            status: "completed",
          },
          {
            testId: "test-2-3",
            testName: "Transactions and Concurrency",
            score: 92,
            maxScore: 100,
            percentage: 92,
            timeTaken: 55,
            completedAt: new Date(
              Date.now() - 4 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "hard",
            questionCount: 25,
            correctAnswers: 23,
            status: "completed",
          },
        ],
      },
      {
        courseId: "course-3",
        courseName: "Object Oriented Programming",
        courseCode: "CS201",
        totalTests: 4,
        completedTests: 3,
        averageScore: 75.7,
        highestScore: 85,
        lastTestDate: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        testResults: [
          {
            testId: "test-3-1",
            testName: "Classes and Objects",
            score: 85,
            maxScore: 100,
            percentage: 85,
            timeTaken: 52,
            completedAt: new Date(
              Date.now() - 35 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "easy",
            questionCount: 20,
            correctAnswers: 17,
            status: "completed",
          },
          {
            testId: "test-3-2",
            testName: "Inheritance and Polymorphism",
            score: 72,
            maxScore: 100,
            percentage: 72,
            timeTaken: 60,
            completedAt: new Date(
              Date.now() - 20 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 25,
            correctAnswers: 18,
            status: "completed",
          },
          {
            testId: "test-3-3",
            testName: "Exception Handling",
            score: 70,
            maxScore: 100,
            percentage: 70,
            timeTaken: 58,
            completedAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 20,
            correctAnswers: 14,
            status: "completed",
          },
        ],
      },
      {
        courseId: "course-4",
        courseName: "Web Development",
        courseCode: "CS401",
        totalTests: 5,
        completedTests: 5,
        averageScore: 89.4,
        highestScore: 97,
        lastTestDate: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        testResults: [
          {
            testId: "test-4-1",
            testName: "HTML Fundamentals",
            score: 95,
            maxScore: 100,
            percentage: 95,
            timeTaken: 35,
            completedAt: new Date(
              Date.now() - 50 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "easy",
            questionCount: 20,
            correctAnswers: 19,
            status: "completed",
          },
          {
            testId: "test-4-2",
            testName: "CSS and Responsive Design",
            score: 88,
            maxScore: 100,
            percentage: 88,
            timeTaken: 55,
            completedAt: new Date(
              Date.now() - 40 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 25,
            correctAnswers: 22,
            status: "completed",
          },
          {
            testId: "test-4-3",
            testName: "JavaScript Fundamentals",
            score: 82,
            maxScore: 100,
            percentage: 82,
            timeTaken: 65,
            completedAt: new Date(
              Date.now() - 25 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 30,
            correctAnswers: 25,
            status: "completed",
          },
          {
            testId: "test-4-4",
            testName: "DOM Manipulation",
            score: 85,
            maxScore: 100,
            percentage: 85,
            timeTaken: 60,
            completedAt: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "hard",
            questionCount: 20,
            correctAnswers: 17,
            status: "completed",
          },
          {
            testId: "test-4-5",
            testName: "Modern Frontend Frameworks",
            score: 97,
            maxScore: 100,
            percentage: 97,
            timeTaken: 70,
            completedAt: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "hard",
            questionCount: 25,
            correctAnswers: 24,
            status: "completed",
          },
        ],
      },
      {
        courseId: "course-5",
        courseName: "Operating Systems",
        courseCode: "CS355",
        totalTests: 4,
        completedTests: 3,
        averageScore: 76.3,
        highestScore: 88,
        lastTestDate: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        testResults: [
          {
            testId: "test-5-1",
            testName: "Introduction to OS",
            score: 80,
            maxScore: 100,
            percentage: 80,
            timeTaken: 50,
            completedAt: new Date(
              Date.now() - 45 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "easy",
            questionCount: 20,
            correctAnswers: 16,
            status: "completed",
          },
          {
            testId: "test-5-2",
            testName: "Process Management",
            score: 88,
            maxScore: 100,
            percentage: 88,
            timeTaken: 65,
            completedAt: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 25,
            correctAnswers: 22,
            status: "completed",
          },
          {
            testId: "test-5-3",
            testName: "Memory Management",
            score: 61,
            maxScore: 100,
            percentage: 61,
            timeTaken: 70,
            completedAt: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "hard",
            questionCount: 20,
            correctAnswers: 12,
            status: "completed",
          },
        ],
      },
      {
        courseId: "course-6",
        courseName: "Machine Learning",
        courseCode: "CS450",
        totalTests: 4,
        completedTests: 2,
        averageScore: 90.5,
        highestScore: 94,
        lastTestDate: new Date(
          Date.now() - 12 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        testResults: [
          {
            testId: "test-6-1",
            testName: "Introduction to ML",
            score: 87,
            maxScore: 100,
            percentage: 87,
            timeTaken: 60,
            completedAt: new Date(
              Date.now() - 28 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "medium",
            questionCount: 25,
            correctAnswers: 22,
            status: "completed",
          },
          {
            testId: "test-6-2",
            testName: "Supervised Learning",
            score: 94,
            maxScore: 100,
            percentage: 94,
            timeTaken: 75,
            completedAt: new Date(
              Date.now() - 12 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            difficulty: "hard",
            questionCount: 30,
            correctAnswers: 28,
            status: "completed",
          },
        ],
      },
    ];
  },
  getTestSummaries: async (
    studentId: string,
    courseId: string,
  ): Promise<TestSummary[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // In real implementation, filter tests by studentId and courseId
    console.log("Loading tests for student:", studentId, "course:", courseId);

    return [
      {
        testId: "test-1",
        testName: "Data Structures Midterm",
        score: 85,
        maxScore: 100,
        percentage: 85,
        timeTaken: 90,
        completedAt: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        difficulty: "medium",
        questionCount: 20,
        correctAnswers: 17,
        status: "completed",
      },
      {
        testId: "test-2",
        testName: "Arrays and Linked Lists",
        score: 78,
        maxScore: 100,
        percentage: 78,
        timeTaken: 75,
        completedAt: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        difficulty: "easy",
        questionCount: 15,
        correctAnswers: 12,
        status: "completed",
      },
      {
        testId: "test-3",
        testName: "Trees and Graphs",
        score: 95,
        maxScore: 100,
        percentage: 95,
        timeTaken: 105,
        completedAt: new Date(
          Date.now() - 21 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        difficulty: "hard",
        questionCount: 25,
        correctAnswers: 24,
        status: "completed",
      },
      {
        testId: "test-4",
        testName: "Final Assessment",
        score: 0,
        maxScore: 100,
        percentage: 0,
        timeTaken: 0,
        completedAt: "",
        difficulty: "hard",
        questionCount: 30,
        correctAnswers: 0,
        status: "not-started",
      },
    ];
  },

  getTestResult: async (
    studentId: string,
    testId: string,
  ): Promise<DetailedTestResult> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      testId,
      testName: "Data Structures Midterm",
      courseName: "Data Structures and Algorithms",
      courseId: "course-1",
      courseCode: "CS301",
      score: 85,
      maxScore: 100,
      percentage: 85,
      timeSpent: 90,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      questionCount: 20,
      correctCount: 17,
      passingScore: 60,
      questions: [
        {
          questionId: "q1",
          questionText:
            "<p>What is the time complexity of searching in a balanced binary search tree?</p>",
          questionType: "mcq",
          marks: 5,
          studentAnswer: "option-2",
          correctAnswer: "option-2",
          isCorrect: true,
          timeTaken: 45,
          explanation:
            "<p>A balanced BST has a height of log(n), so search operations take O(log n) time.</p>",
          options: [
            { id: "option-1", text: "O(n)", isCorrect: false },
            { id: "option-2", text: "O(log n)", isCorrect: true },
            { id: "option-3", text: "O(n²)", isCorrect: false },
            { id: "option-4", text: "O(1)", isCorrect: false },
          ],
        },
        {
          questionId: "q2",
          questionText:
            "<p>Fill in the blank: The worst-case time complexity of Quick Sort is ____.</p>",
          questionType: "fillup",
          marks: 3,
          studentAnswer: "O(n²)",
          correctAnswer: ["O(n²)", "O(n^2)", "n²", "n^2"],
          isCorrect: true,
          timeTaken: 30,
          explanation:
            "<p>Quick Sort has O(n²) worst-case complexity when the pivot is always the smallest or largest element.</p>",
        },
        {
          questionId: "q3",
          questionText:
            "<p>A stack follows the LIFO (Last In, First Out) principle.</p>",
          questionType: "true-false",
          marks: 2,
          studentAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          timeTaken: 15,
          explanation:
            "<p>Yes, a stack is a LIFO data structure where the last element added is the first one to be removed.</p>",
        },
        {
          questionId: "q4",
          questionText:
            "<p>What is the space complexity of the recursive implementation of binary search?</p>",
          questionType: "mcq",
          marks: 4,
          studentAnswer: "option-1",
          correctAnswer: "option-2",
          isCorrect: false,
          timeTaken: 60,
          explanation:
            "<p>Recursive binary search uses O(log n) space due to the call stack, while iterative uses O(1).</p>",
          options: [
            { id: "option-1", text: "O(1)", isCorrect: false },
            { id: "option-2", text: "O(log n)", isCorrect: true },
            { id: "option-3", text: "O(n)", isCorrect: false },
            { id: "option-4", text: "O(n log n)", isCorrect: false },
          ],
        },
        {
          questionId: "q5",
          questionText:
            "<p>In a hash table, what happens when two keys map to the same index?</p>",
          questionType: "fillup",
          marks: 3,
          studentAnswer: "",
          correctAnswer: ["collision", "hash collision"],
          isCorrect: false,
          timeTaken: 0,
          explanation:
            "<p>When two keys hash to the same index, it's called a collision. This can be resolved using techniques like chaining or open addressing.</p>",
        },
      ],
    };
  },
};

// Mock data for teacher results

export const MockTeacherResultsAPI = {
  getTeacherCourses: async (
    teacherId: string,
  ): Promise<TeacherCourseOverview[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Log the teacher ID for debugging purposes
    console.log(`Fetching courses for teacher: ${teacherId}`);

    // In a real app, we would filter courses by teacher ID
    // For now, we're returning mock data regardless of teacherId
    return [
      {
        courseId: "course-1",
        courseName: "Data Structures and Algorithms",
        courseCode: "CSE-301",
        totalStudents: 65,
        totalTests: 5,
        averageScore: 76.4,
        highestScore: 98,
        lowestScore: 42,
        completionRate: 94.5,
        lastTestDate: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        courseId: "course-2",
        courseName: "Database Management Systems",
        courseCode: "CSE-401",
        totalStudents: 58,
        totalTests: 4,
        averageScore: 81.7,
        highestScore: 99,
        lowestScore: 55,
        completionRate: 97.2,
        lastTestDate: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        courseId: "course-3",
        courseName: "Object Oriented Programming",
        courseCode: "CSE-201",
        totalStudents: 72,
        totalTests: 6,
        averageScore: 68.9,
        highestScore: 95,
        lowestScore: 35,
        completionRate: 88.4,
        lastTestDate: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        courseId: "course-4",
        courseName: "Computer Networks",
        courseCode: "CSE-405",
        totalStudents: 45,
        totalTests: 3,
        averageScore: 72.3,
        highestScore: 96,
        lowestScore: 48,
        completionRate: 91.7,
        lastTestDate: new Date(
          Date.now() - 21 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        courseId: "course-5",
        courseName: "Operating Systems",
        courseCode: "CSE-302",
        totalStudents: 60,
        totalTests: 4,
        averageScore: 74.5,
        highestScore: 97,
        lowestScore: 40,
        completionRate: 93.8,
        lastTestDate: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        courseId: "course-6",
        courseName: "Software Engineering",
        courseCode: "CSE-403",
        totalStudents: 55,
        totalTests: 5,
        averageScore: 79.2,
        highestScore: 98,
        lowestScore: 51,
        completionRate: 95.6,
        lastTestDate: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    ];
  },

  getCourseTests: async (courseId: string): Promise<TestOverview[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const testData: Record<string, TestOverview[]> = {
      "course-1": [
        {
          testId: "test-1-1",
          testName: "Midterm Exam",
          courseName: "Data Structures and Algorithms",
          courseCode: "CSE-301",
          totalSubmissions: 63,
          averageScore: 75.6,
          highestScore: 98,
          lowestScore: 42,
          medianScore: 78,
          completionRate: 96.9,
          createdAt: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 90,
        },
        {
          testId: "test-1-2",
          testName: "Quiz 1: Arrays and Linked Lists",
          courseName: "Data Structures and Algorithms",
          courseCode: "CSE-301",
          totalSubmissions: 65,
          averageScore: 82.3,
          highestScore: 100,
          lowestScore: 55,
          medianScore: 85,
          completionRate: 100,
          createdAt: new Date(
            Date.now() - 45 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 30,
        },
        {
          testId: "test-1-3",
          testName: "Quiz 2: Trees and Graphs",
          courseName: "Data Structures and Algorithms",
          courseCode: "CSE-301",
          totalSubmissions: 61,
          averageScore: 68.7,
          highestScore: 95,
          lowestScore: 40,
          medianScore: 72,
          completionRate: 93.8,
          createdAt: new Date(
            Date.now() - 20 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 45,
        },
        {
          testId: "test-1-4",
          testName: "Final Exam",
          courseName: "Data Structures and Algorithms",
          courseCode: "CSE-301",
          totalSubmissions: 64,
          averageScore: 77.9,
          highestScore: 97,
          lowestScore: 45,
          medianScore: 80,
          completionRate: 98.5,
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 120,
        },
      ],
      "course-2": [
        {
          testId: "test-2-1",
          testName: "Midterm Exam",
          courseName: "Database Management Systems",
          courseCode: "CSE-401",
          totalSubmissions: 56,
          averageScore: 80.2,
          highestScore: 99,
          lowestScore: 55,
          medianScore: 82,
          completionRate: 96.6,
          createdAt: new Date(
            Date.now() - 35 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 90,
        },
        {
          testId: "test-2-2",
          testName: "SQL Quiz",
          courseName: "Database Management Systems",
          courseCode: "CSE-401",
          totalSubmissions: 58,
          averageScore: 85.7,
          highestScore: 100,
          lowestScore: 60,
          medianScore: 88,
          completionRate: 100,
          createdAt: new Date(
            Date.now() - 25 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 45,
        },
        {
          testId: "test-2-3",
          testName: "Final Project Review",
          courseName: "Database Management Systems",
          courseCode: "CSE-401",
          totalSubmissions: 55,
          averageScore: 82.5,
          highestScore: 98,
          lowestScore: 65,
          medianScore: 84,
          completionRate: 94.8,
          createdAt: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 60,
        },
      ],
      "course-3": [
        {
          testId: "test-3-1",
          testName: "Java Basics Quiz",
          courseName: "Object Oriented Programming",
          courseCode: "CSE-201",
          totalSubmissions: 70,
          averageScore: 72.4,
          highestScore: 95,
          lowestScore: 40,
          medianScore: 75,
          completionRate: 97.2,
          createdAt: new Date(
            Date.now() - 40 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 30,
        },
      ],
      "course-4": [
        {
          testId: "test-4-1",
          testName: "OSI Model Quiz",
          courseName: "Computer Networks",
          courseCode: "CSE-405",
          totalSubmissions: 42,
          averageScore: 71.8,
          highestScore: 96,
          lowestScore: 48,
          medianScore: 74,
          completionRate: 93.3,
          createdAt: new Date(
            Date.now() - 21 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          duration: 45,
        },
      ],
    };

    return testData[courseId] || [];
  },
  getRecentTests: async (
    _teacherId: string,
    limit: number = 3,
  ): Promise<TestOverview[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create all our mock tests
    const allTests = [
      {
        testId: "test-1-4",
        testName: "Final Exam",
        courseName: "Data Structures and Algorithms",
        courseCode: "CSE-301",
        totalSubmissions: 64,
        averageScore: 77.9,
        highestScore: 97,
        lowestScore: 45,
        medianScore: 80,
        completionRate: 98.5,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        duration: 120,
      },
      {
        testId: "test-6-2",
        testName: "Design Patterns Quiz",
        courseName: "Software Engineering",
        courseCode: "CSE-403",
        totalSubmissions: 53,
        averageScore: 81.2,
        highestScore: 98,
        lowestScore: 60,
        medianScore: 83,
        completionRate: 96.4,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        duration: 45,
      },
      {
        testId: "test-3-4",
        testName: "Design Principles Quiz",
        courseName: "Object Oriented Programming",
        courseCode: "CSE-201",
        totalSubmissions: 68,
        averageScore: 69.5,
        highestScore: 94,
        lowestScore: 35,
        medianScore: 72,
        completionRate: 94.4,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        duration: 40,
      },
      {
        testId: "test-5-2",
        testName: "Database Concepts Exam",
        courseName: "Database Systems",
        courseCode: "CSE-305",
        totalSubmissions: 59,
        averageScore: 72.3,
        highestScore: 95,
        lowestScore: 48,
        medianScore: 75,
        completionRate: 97.8,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago (beyond our 7-day window)
        duration: 90,
      },
      {
        testId: "test-2-3",
        testName: "Midterm Examination",
        courseName: "Algorithm Analysis",
        courseCode: "CSE-401",
        totalSubmissions: 61,
        averageScore: 74.8,
        highestScore: 93,
        lowestScore: 52,
        medianScore: 78,
        completionRate: 96.1,
        createdAt: new Date(
          Date.now() - 12 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 12 days ago (beyond our 7-day window)
        duration: 90,
      },
    ];

    // Filter tests to get only those from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return allTests
      .filter((test) => new Date(test.createdAt) >= sevenDaysAgo)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) // Sort by most recent
      .slice(0, limit); // Limit to max 3 tests
  },

  getTestStatistics: async (
    testId: string,
  ): Promise<DetailedTestStatistics> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data for one specific test
    const performanceDistribution: PerformanceDistribution[] = [
      { range: "0-20", count: 1, percentage: 1.6 },
      { range: "21-40", count: 3, percentage: 4.7 },
      { range: "41-60", count: 12, percentage: 18.8 },
      { range: "61-80", count: 28, percentage: 43.7 },
      { range: "81-100", count: 20, percentage: 31.2 },
    ];

    // Generate mock student results
    const studentResults: StudentTestResult[] = Array.from(
      { length: 20 },
      (_, i) => {
        const score = Math.floor(Math.random() * 60) + 40; // Random score between 40 and 100
        return {
          studentId: `student-${i + 1}`,
          studentName: `Student ${i + 1}`,
          score: score,
          maxScore: 100,
          percentage: score,
          timeTaken: Math.floor(Math.random() * 60) + 30, // Random time between 30 and 90 minutes
          completedAt: new Date(
            Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          status: "completed",
          attemptCount: Math.floor(Math.random() * 2) + 1, // 1 or 2 attempts
        };
      },
    );

    // Generate mock question stats
    const questionStats: QuestionStat[] = Array.from({ length: 10 }, (_, i) => {
      const correctPct = Math.floor(Math.random() * 60) + 40; // Random percentage between 40 and 100
      return {
        questionId: `q-${i + 1}`,
        questionNumber: i + 1,
        questionType:
          i % 3 === 0
            ? "Multiple Choice"
            : i % 3 === 1
              ? "True/False"
              : "Short Answer",
        difficulty:
          i % 4 === 0
            ? "Easy"
            : i % 4 === 1
              ? "Medium"
              : i % 4 === 2
                ? "Hard"
                : "Advanced",
        averageScore: (correctPct / 100) * (i % 3 === 2 ? 5 : 1), // Out of 1 or 5 points
        correctPercentage: correctPct,
        attemptedCount: 64 - Math.floor(Math.random() * 4), // Between 60-64 attempts
        skippedCount: Math.floor(Math.random() * 4), // Between 0-4 skips
      };
    });

    return {
      testId,
      testName: "Final Exam",
      courseId: "course-1",
      courseName: "Data Structures and Algorithms",
      courseCode: "CSE-301",
      totalQuestions: 10,
      totalMarks: 100,
      averageScore: 77.9,
      highestScore: 97,
      lowestScore: 45,
      medianScore: 80,
      standardDeviation: 12.5,
      averageCompletionTime: 72, // in minutes
      totalSubmissions: 64,
      performanceDistribution,
      studentResults,
      questionStats,
    };
  },
};
