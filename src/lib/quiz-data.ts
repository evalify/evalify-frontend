import { QuizData, ServerOption, Option } from "@/components/quiz/types/types";

// This file would contain functions to fetch quiz data from API
// For now, we'll export the mock data

// Helper function to transform server options to client options
// This removes the 'correct' property to prevent leaking answers to the client
function transformOptions(options: ServerOption[]): Option[] {
  return options.map((option, index) => ({
    text: option.text,
    id: option.id || `option-${index}`,
  }));
}

export async function getQuizData(
  quizId: string,
): Promise<Omit<QuizData, "totalMarks" | "totalQuestions">> {
  // In a real application, this would be an API call
  // For now, return a mock data
  return {
    id: quizId,
    sections: [
      {
        id: 1,
        name: "Geography",
        timeLimit: 30,
        totalMarks: 0,
        totalQuestions: 0,
      },
      {
        id: 2,
        name: "Astronomy",
        timeLimit: 30,
        totalMarks: 0,
        totalQuestions: 0,
      },
      {
        id: 3,
        name: "General Knowledge",
        timeLimit: 30,
        totalMarks: 0,
        totalQuestions: 0,
      },
    ],
    timeLimit: 60,
    title: "General Knowledge Quiz",
    description: "This is a general knowledge quiz covering various topics.",
    instructions:
      "Please read the questions carefully and select the correct answer.",
    startTime: "2023-10-01T10:00:00Z",

    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        marks: 2,
        type: "MCQ",
        sectionId: 1,
        options: [
          { text: "Paris", correct: true },
          { text: "London", correct: false },
          { text: "Berlin", correct: false },
          { text: "Madrid", correct: false },
          { text: "Rome", correct: false },
          { text: "Lisbon", correct: false },
          { text: "Amsterdam", correct: false },
          { text: "Brussels", correct: false },
          { text: "Vienna", correct: false },
          { text: "Prague", correct: false },
          { text: "Budapest", correct: false },
          { text: "Warsaw", correct: false },
          { text: "Copenhagen", correct: false },
          { text: "Oslo", correct: false },
          { text: "Stockholm", correct: false },
        ],
      },
      {
        id: 2,
        question: "What is the largest planet in our solar system?",
        marks: 2,
        type: "MCQ",
        sectionId: 2,
        options: [
          { text: "Earth", correct: false },
          { text: "Mars", correct: false },
          { text: "Jupiter", correct: true },
          { text: "Saturn", correct: false },
        ],
      },
      {
        id: 3,
        question: "___ and ___ are the largest planets in our solar system?",
        marks: 2,
        type: "FILL_UP",
        sectionId: 1,
      },
      {
        id: 4,
        question: "Match the following",
        marks: 4,
        type: "MATCH_THE_FOLLOWING",
        sectionId: 1,
        topic: ["General Knowledge"],
        key: [
          { id: "k1", text: "Jupiter" },
          { id: "k2", text: "Saturn" },
          { id: "k3", text: "Mars" },
          { id: "k4", text: "Earth" },
          { id: "k5", text: "Venus" },
          { id: "k6", text: "Mercury" },
          { id: "k7", text: "Neptune" },
          { id: "k8", text: "Uranus" },
          { id: "k9", text: "Pluto" },
          { id: "k10", text: "Moon" },
        ],
        value: [
          { id: "v1", text: "Jupiter" },
          { id: "v2", text: "Saturn" },
          { id: "v3", text: "Mars" },
          { id: "v4", text: "Earth" },
          { id: "v5", text: "Venus" },
          { id: "v6", text: "Mercury" },
          { id: "v7", text: "Neptune" },
          { id: "v8", text: "Uranus" },
          { id: "v9", text: "Pluto" },
          { id: "v10", text: "Moon" },
        ],
      },
      {
        id: 5,
        question:
          "Explain the importance of renewable energy sources for sustainable development in about 200 words.",
        marks: 5,
        type: "DESCRIPTIVE",
        sectionId: 2,
        maxWordLimit: 200,
      },
      {
        id: 6,
        question:
          "Write a Python function to calculate the factorial of a number using recursion.",
        marks: 10,
        type: "CODING",
        sectionId: 2,
        driverCode:
          "# This is the driver code that will test your function\ndef test_factorial():\n    assert factorial(0) == 1\n    assert factorial(1) == 1\n    assert factorial(5) == 120\n    assert factorial(10) == 3628800\n    print('All test cases passed!')\n\ntest_factorial()",
        boilerTemplate:
          "# Write your factorial function below\n\ndef factorial(n):\n    # Your code here\n    pass\n\n# Example usage:\n# factorial(5) should return 120",
      },
      {
        id: 7,
        question: "Select all the planets in our solar system.",
        marks: 5,
        type: "MMCQ",
        sectionId: 2,
        options: [
          { text: "Mercury", correct: true },
          { text: "Venus", correct: true },
          { text: "Earth", correct: true },
          { text: "Mars", correct: true },
          { text: "Jupiter", correct: true },
          { text: "Saturn", correct: true },
          { text: "Uranus", correct: true },
          { text: "Neptune", correct: true },
          { text: "Pluto", correct: false },
          { text: "Moon", correct: false },
          { text: "Sun", correct: false },
        ],
      },
    ],
  };
}

// Process quiz data to calculate totals
export function processQuizData(
  rawData: Omit<QuizData, "totalMarks" | "totalQuestions">,
): QuizData {
  const totalMarks = rawData.questions.reduce(
    (sum: number, q) => sum + q.marks,
    0,
  );

  // Process questions to transform ServerOption to Option
  const processedQuestions = rawData.questions.map((question) => {
    if (
      question.type === "MCQ" ||
      question.type === "MMCQ" ||
      question.type === "TRUEFALSE"
    ) {
      return {
        ...question,
        options: transformOptions(question.options as ServerOption[]),
      };
    }
    return question;
  });

  // Calculate section-specific totals
  const sectionsWithTotals = rawData.sections.map((section) => {
    const sectionQuestions = processedQuestions.filter(
      (q) => q.sectionId === section.id,
    );
    return {
      ...section,
      totalQuestions: sectionQuestions.length,
      totalMarks: sectionQuestions.reduce((sum: number, q) => sum + q.marks, 0),
    };
  });

  return {
    ...rawData,
    questions: processedQuestions,
    sections: sectionsWithTotals,
    totalMarks,
    totalQuestions: rawData.questions.length,
  };
}
