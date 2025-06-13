import {
  Question,
  QuestionTypes,
  Taxonomy,
  Difficulty,
  MCQQuestion,
  MMCQQuestion,
  TrueFalseQuestion,
  FillUpQuestion,
  MatchTheFollowingQuestion,
  DescriptiveQuestion,
  FileUploadQuestion,
  CodingQuestion,
  MCQAnswer,
  MMCQAnswer,
  TrueFalseAnswer,
  FillUpAnswer,
  MatchTheFollowingAnswer,
  DescriptiveAnswer,
  FileUploadAnswer,
  CodingAnswer,
} from "./types";

// Sample MCQ Question
export const sampleMCQQuestion: MCQQuestion = {
  id: "mcq-1",
  type: QuestionTypes.MCQ,
  question: "What is the time complexity of binary search algorithm?",
  explanation:
    "Binary search has O(log n) time complexity because it divides the search space in half at each step.",
  hint: "Think about how many times you can divide a number by 2.",
  marks: 2,
  bloomsTaxonomy: Taxonomy.UNDERSTAND,
  co: 1,
  negativeMark: 0.5,
  difficulty: Difficulty.MEDIUM,
  bank: { id: "bank-1", name: "Algorithms" },
  topics: [{ id: "topic-1", name: "Searching Algorithms" }],
  options: [
    { id: "opt-1", text: "O(n)", isCorrect: false },
    { id: "opt-2", text: "O(log n)", isCorrect: true },
    { id: "opt-3", text: "O(n²)", isCorrect: false },
    { id: "opt-4", text: "O(1)", isCorrect: false },
  ],
};

// Sample MMCQ Question
export const sampleMMCQQuestion: MMCQQuestion = {
  id: "mmcq-1",
  type: QuestionTypes.MMCQ,
  question:
    "Which of the following are properties of Object-Oriented Programming? (Select all that apply)",
  explanation:
    "OOP has four main principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.",
  marks: 3,
  bloomsTaxonomy: Taxonomy.REMEMBER,
  co: 2,
  difficulty: Difficulty.EASY,
  bank: { id: "bank-2", name: "OOP Concepts" },
  topics: [{ id: "topic-2", name: "Object-Oriented Programming" }],
  options: [
    { id: "opt-1", text: "Encapsulation", isCorrect: true },
    { id: "opt-2", text: "Inheritance", isCorrect: true },
    { id: "opt-3", text: "Recursion", isCorrect: false },
    { id: "opt-4", text: "Polymorphism", isCorrect: true },
    { id: "opt-5", text: "Abstraction", isCorrect: true },
  ],
};

// Sample True/False Question
export const sampleTrueFalseQuestion: TrueFalseQuestion = {
  id: "tf-1",
  type: QuestionTypes.TRUE_FALSE,
  question: "JavaScript is a compiled programming language.",
  explanation:
    "JavaScript is an interpreted language, not compiled. It runs directly in the browser or Node.js runtime.",
  hint: "Think about how JavaScript code is executed in web browsers.",
  marks: 1,
  bloomsTaxonomy: Taxonomy.UNDERSTAND,
  co: 1,
  difficulty: Difficulty.EASY,
  bank: { id: "bank-3", name: "JavaScript Basics" },
  topics: [{ id: "topic-3", name: "Programming Languages" }],
  answer: false,
};

// Sample Fill Up Question
export const sampleFillUpQuestion: FillUpQuestion = {
  id: "fill-1",
  type: QuestionTypes.FILL_UP,
  question:
    "Complete the SQL query: SELECT * FROM users WHERE age _____ 18 AND status = _____",
  explanation:
    "The correct query is: SELECT * FROM users WHERE age > 18 AND status = active",
  marks: 2,
  bloomsTaxonomy: Taxonomy.APPLY,
  co: 3,
  difficulty: Difficulty.MEDIUM,
  bank: { id: "bank-4", name: "Database Queries" },
  topics: [{ id: "topic-4", name: "SQL" }],
  strictMatch: false,
  llmEval: true,
  blanks: [
    {
      id: "blank-1",
      answers: [">", "greater than", ">=", "greater than or equal to"],
    },
    { id: "blank-2", answers: ["active", "'active'", '"active"'] },
  ],
};

// Sample Match the Following Question
export const sampleMatchTheFollowingQuestion: MatchTheFollowingQuestion = {
  id: "match-1",
  type: QuestionTypes.MATCH_THE_FOLLOWING,
  question: "Match the HTTP status codes with their meanings:",
  explanation: "These are standard HTTP status codes used in web development.",
  marks: 4,
  bloomsTaxonomy: Taxonomy.REMEMBER,
  co: 2,
  difficulty: Difficulty.MEDIUM,
  bank: { id: "bank-5", name: "Web Development" },
  topics: [{ id: "topic-5", name: "HTTP Protocol" }],
  keys: [
    { id: "pair-1", leftPair: "200", rightPair: "OK - Success" },
    { id: "pair-2", leftPair: "404", rightPair: "Not Found" },
    { id: "pair-3", leftPair: "500", rightPair: "Internal Server Error" },
    { id: "pair-4", leftPair: "401", rightPair: "Unauthorized" },
  ],
};

// Sample Descriptive Question
export const sampleDescriptiveQuestion: DescriptiveQuestion = {
  id: "desc-1",
  type: QuestionTypes.DESCRIPTIVE,
  question:
    "Explain the concept of Big O notation and provide examples of different time complexities.",
  expectedAnswer:
    "Big O notation describes the upper bound of time complexity. Examples: O(1) - constant, O(n) - linear, O(log n) - logarithmic, O(n²) - quadratic.",
  explanation:
    "Big O notation is fundamental for analyzing algorithm efficiency.",
  guidelines:
    "Write a detailed answer covering definition, purpose, and at least 4 examples with explanations.",
  marks: 10,
  bloomsTaxonomy: Taxonomy.EVALUATE,
  co: 1,
  difficulty: Difficulty.HARD,
  bank: { id: "bank-6", name: "Algorithm Analysis" },
  topics: [{ id: "topic-6", name: "Complexity Analysis" }],
  strictness: 0.8,
};

// Sample File Upload Question
export const sampleFileUploadQuestion: FileUploadQuestion = {
  id: "file-1",
  type: QuestionTypes.FILE_UPLOAD,
  question: "Submit your solution for the database design assignment.",
  expectedAnswer:
    "ER diagram file showing normalized database schema with proper relationships.",
  guidelines:
    "Upload your ER diagram in PDF or image format. File size should not exceed 5MB.",
  marks: 15,
  bloomsTaxonomy: Taxonomy.CREATE,
  co: 4,
  difficulty: Difficulty.HARD,
  bank: { id: "bank-7", name: "Database Design" },
  topics: [{ id: "topic-7", name: "ER Diagrams" }],
  strictness: 0.9,
};

// Sample Coding Question
export const sampleCodingQuestion: CodingQuestion = {
  id: "code-1",
  type: QuestionTypes.CODING,
  question: "Implement a function to find the maximum element in an array.",
  explanation:
    "The function should iterate through the array and keep track of the maximum value found.",
  hint: "Initialize with the first element and compare with remaining elements.",
  marks: 8,
  bloomsTaxonomy: Taxonomy.APPLY,
  co: 1,
  difficulty: Difficulty.MEDIUM,
  bank: { id: "bank-8", name: "Programming Problems" },
  topics: [{ id: "topic-8", name: "Arrays" }],
  functionName: "findMax",
  returnType: "number",
  params: [{ name: "arr", type: "number[]", description: "Array of numbers" }],
  boilerCode: `function findMax(arr) {
  // Your code here
  
}`,
  driverCode: `// Test cases
console.log(findMax([1, 3, 2, 8, 5])); // Expected: 8
console.log(findMax([-1, -5, -2])); // Expected: -1`,
  language: ["javascript", "python", "java"],
  answer: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
  testcases: [
    {
      id: "test-1",
      input: "[1, 3, 2, 8, 5]",
      expectedOutput: "8",
      isHidden: false,
      points: 2,
    },
    {
      id: "test-2",
      input: "[-1, -5, -2]",
      expectedOutput: "-1",
      isHidden: false,
      points: 2,
    },
    {
      id: "test-3",
      input: "[100]",
      expectedOutput: "100",
      isHidden: true,
      points: 2,
    },
    {
      id: "test-4",
      input: "[5, 5, 5, 5]",
      expectedOutput: "5",
      isHidden: true,
      points: 2,
    },
  ],
};

// Sample user answers for demonstrating "student" mode
export const sampleUserAnswers: Record<
  string,
  | MCQAnswer
  | MMCQAnswer
  | TrueFalseAnswer
  | FillUpAnswer
  | MatchTheFollowingAnswer
  | DescriptiveAnswer
  | FileUploadAnswer
  | CodingAnswer
> = {
  "mcq-1": {
    selectedOption: "opt-3", // User selected O(n²) instead of correct O(log n)
  } as MCQAnswer,

  "mmcq-1": {
    selectedOptions: ["opt-1", "opt-2", "opt-3"], // User missed Polymorphism and Abstraction, included wrong Recursion
  } as MMCQAnswer,

  "tf-1": {
    answer: true, // User answered true, but correct answer is false
  } as TrueFalseAnswer,
  "fill-1": {
    blanks: { "blank-1": ">= 18", "blank-2": "pending" }, // User got first blank close but second blank wrong
  } as FillUpAnswer,
  "match-1": {
    matches: {
      "left-1": "right-2", // 200 → Created (wrong, should be OK)
      "left-2": "right-1", // 404 → OK (wrong, should be Not Found)
      "left-3": "right-3", // 500 → Server Error (correct)
      "left-4": "right-4", // 401 → Unauthorized (correct)
    },
  } as MatchTheFollowingAnswer,
  "desc-1": {
    text: "Recursion is when a function calls itself repeatedly until it reaches a base condition. It is useful for solving problems that can be broken down into smaller similar problems.",
  } as DescriptiveAnswer,
  "file-1": {
    files: [new File([""], "assignment.pdf", { type: "application/pdf" })],
  } as FileUploadAnswer,
  "code-1": {
    code: `def find_largest(arr):
    if not arr:
        return None
    largest = arr[0]
    for num in arr[1:]:
        if num > largest:
            largest = num
    return largest`,
    language: "python",
  } as CodingAnswer,
};

// Collection of all sample questions
export const sampleQuestions: Question[] = [
  sampleMCQQuestion,
  sampleMMCQQuestion,
  sampleTrueFalseQuestion,
  sampleFillUpQuestion,
  sampleMatchTheFollowingQuestion,
  sampleDescriptiveQuestion,
  sampleFileUploadQuestion,
  sampleCodingQuestion,
];
