// Question bank definitions
import { csQuestions } from "./cs101";
import { mathQuestions } from "./math201";
import { physicsQuestions } from "./physics101";
import { databaseQuestions } from "./db101";

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  topics: string[];
  lastUpdated: string;
}

// Bank metadata for all question banks
export const banks: Record<string, QuestionBank> = {
  cs101: {
    id: "cs101",
    name: "Computer Science Fundamentals",
    description:
      "Basic concepts of computer science including algorithms, data structures, and programming paradigms",
    questionCount: csQuestions.length,
    topics: ["Algorithms", "Data Structures", "Object-Oriented Programming"],
    lastUpdated: "2025-05-15",
  },
  math201: {
    id: "math201",
    name: "Mathematics",
    description:
      "Questions covering calculus, algebra, statistics, and discrete mathematics",
    questionCount: mathQuestions.length,
    topics: ["Calculus", "Algebra", "Statistics"],
    lastUpdated: "2025-05-10",
  },
  physics101: {
    id: "physics101",
    name: "Physics",
    description:
      "Questions on mechanics, electromagnetism, thermodynamics, and modern physics",
    questionCount: physicsQuestions.length,
    topics: ["Mechanics", "Thermodynamics", "Electromagnetism"],
    lastUpdated: "2025-05-18",
  },
  db101: {
    id: "db101",
    name: "Database Systems",
    description:
      "Questions on database design, SQL, normalization, and transaction processing",
    questionCount: databaseQuestions.length,
    topics: ["SQL", "Normalization", "Transaction Processing"],
    lastUpdated: "2025-05-20",
  },
};

// Function to get questions by bank ID
export function getQuestionsByBankId(bankId: string) {
  let questions;

  switch (bankId) {
    case "cs101":
      questions = csQuestions;
      break;
    case "math201":
      questions = mathQuestions;
      break;
    case "physics101":
      questions = physicsQuestions;
      break;
    case "db101":
      questions = databaseQuestions;
      break;
    case "any":
      // For "any" bank, combine all questions from all banks
      return [
        ...csQuestions.map((q) => ({ ...q, source: "cs101" })),
        ...mathQuestions.map((q) => ({ ...q, source: "math201" })),
        ...physicsQuestions.map((q) => ({ ...q, source: "physics101" })),
        ...databaseQuestions.map((q) => ({ ...q, source: "db101" })),
      ];
    default:
      return [];
  }

  // Add source information to each question
  return questions.map((question) => ({
    ...question,
    source: bankId,
  }));
}
