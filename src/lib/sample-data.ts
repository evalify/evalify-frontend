import type { Question } from "./types";

export const sampleQuestions: Question[] = [
  {
    id: "q1",
    number: 1,
    description: "What is the time complexity of binary search algorithm?",
    answer: "O(log n)",
    marks: 5,
    type: "Short Answer",
    courseOutcome: 2,
    bloomsTaxonomy: "Understand",
    topic: "Algorithms",
    difficulty: "Medium",
    source: "cs101",
  },
  {
    id: "q2",
    number: 2,
    description:
      "Explain the concept of polymorphism in object-oriented programming with an example.",
    answer:
      "Polymorphism is the ability of an object to take on many forms. The most common use of polymorphism in OOP occurs when a parent class reference is used to refer to a child class object. For example, consider a base class Shape with a method draw() and derived classes Circle, Rectangle, etc. that override the draw() method. We can create an array of Shape references that each refer to different derived class objects and call draw() on each, which will execute the appropriate derived class method.",
    marks: 10,
    type: "Essay",
    courseOutcome: 3,
    bloomsTaxonomy: "Apply",
    topic: "Object-Oriented Programming",
    difficulty: "Hard",
    source: "cs101",
  },
  {
    id: "q3",
    number: 3,
    description: "Which of the following is NOT a valid data structure?",
    answer: "C) Circuit",
    options: [
      { id: "a", text: "Array", isCorrect: false },
      { id: "b", text: "Queue", isCorrect: false },
      { id: "c", text: "Circuit", isCorrect: true },
      { id: "d", text: "Tree", isCorrect: false },
    ],
    marks: 2,
    type: "Multiple Choice",
    courseOutcome: 1,
    bloomsTaxonomy: "Remember",
    topic: "Data Structures",
    difficulty: "Easy",
    source: "math201",
  },
];
