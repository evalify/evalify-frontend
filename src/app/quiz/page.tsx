"use client"

import TestHeader from "@/components/quiz/test-header"
import TestContent from "@/components/quiz/test-content"
import Sidebar from "@/components/quiz/sidebar"
import { QuizProvider } from "@/components/quiz/quiz-context"

const rawData = {
    id:"1",
    sections: [
        {
        id: 1,
        name: "Geography",
        timeLimit: 30
        },
        {
        id: 2,
        name: "Astronomy",
        timeLimit: 30
        }],
    timeLimit: 60,
    title: "General Knowledge Quiz",
    description: "This is a general knowledge quiz covering various topics.",
    instructions: "Please read the questions carefully and select the correct answer.",
    startTime: "2023-10-01T10:00:00Z",
  
    questions: [
    {
        id: 1,
        question: "What is the capital of France?",
        marks: 2,
        type: "MCQ",
        sectionId: 1,
        options: [{ text: "Paris", correct: true }, { text: "London", correct: false }, { text: "Berlin", correct: false }, { text: "Madrid", correct: false }]
    },
    {
        id: 2,
        question: "What is the largest planet in our solar system?",
        marks: 2,
        type: "MCQ",
        sectionId: 2,
        options: [{ text: "Earth", correct: false }, { text: "Mars", correct: false }, { text: "Jupiter", correct: true }, { text: "Saturn", correct: false }]
    },
    {
        id: 3,
        question: "are ___ and manasa ___?",
        marks: 2,
        type: "FILL_IN_THE_BLANKS",
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
        { id: "k1", text: "Gowtham" },
        { id: "k2", text: "Rithesh" },
        { id: "k3", text: "Aksay" },
        { id: "k4", text: "Sarveshwar" },
      ],
      value: [
        { id: "v1", text: "Evalify" },
        { id: "v2", text: "God" },
        { id: "v3", text: "Black" },
        { id: "v4", text: "God Slayer" },
        { id: "v5", text: "Vetti (ans:4)" },
      ],
    },
    {
      id: 5,
      question: "Explain the importance of renewable energy sources for sustainable development in about 200 words.",
      marks: 5,
      type: "DESCRIPTIVE",
      sectionId: 2,
      maxWordLimit: 200
    },
    {
      id: 6,
      question: "Write a Python function to calculate the factorial of a number using recursion.",
      marks: 10,
      type: "CODING",
      sectionId: 2,
      driverCode: "# This is the driver code that will test your function\ndef test_factorial():\n    assert factorial(0) == 1\n    assert factorial(1) == 1\n    assert factorial(5) == 120\n    assert factorial(10) == 3628800\n    print('All test cases passed!')\n\ntest_factorial()",
      boilerTemplate: "# Write your factorial function below\n\ndef factorial(n):\n    # Your code here\n    pass\n\n# Example usage:\n# factorial(5) should return 120"
    }
]}

// Process data to calculate totals from questions array
// Type assertion to help TypeScript understand the data structure

// Define a specific type for our quiz data
type ProcessedQuizData = {
  id: string;
  sections: {
    id: number;
    name: string;
    timeLimit: number;
    totalQuestions: number;
    totalMarks: number;
  }[];
  totalMarks: number;
  totalQuestions: number;
  timeLimit: number;
  title: string;
  description: string;
  instructions: string;
  startTime: string;
  questions: {
    id: number;
    question: string;
    marks: number;
    type: string;
    sectionId: number;
    options?: { text: string; correct: boolean }[];
    key?: { id: string; text: string }[];
    value?: { id: string; text: string }[];
    maxWordLimit?: number;
    driverCode?: string;
    boilerTemplate?: string;
  }[];
};

// Process data to calculate totals from questions array
const data = (() => {
  const totalMarks = rawData.questions.reduce((sum, q) => sum + q.marks, 0);
  
  // Calculate section-specific totals
  const sectionsWithTotals = rawData.sections.map(section => {
    const sectionQuestions = rawData.questions.filter(q => q.sectionId === section.id);
    return {
      ...section,
      totalQuestions: sectionQuestions.length,
      totalMarks: sectionQuestions.reduce((sum, q) => sum + q.marks, 0)
    };
  });
  
  return {
    ...rawData,
    sections: sectionsWithTotals,
    totalMarks,
    totalQuestions: rawData.questions.length
  } as ProcessedQuizData;
})();

export default function TestPage() {
  return (
    <QuizProvider questions={data.questions as unknown as { id: string | number; sectionId: number; type: string }[]}>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <TestHeader title={data.title} />
        <div className="flex flex-col md:flex-row flex-1">
          <div className="flex-1 border-r border-gray-700">
            <TestContent data={data} />
          </div>
          <div className="w-full md:w-96 border-l border-gray-700">
            <Sidebar data={data} />
          </div>
        </div>
      </div>
    </QuizProvider>
  )
}
