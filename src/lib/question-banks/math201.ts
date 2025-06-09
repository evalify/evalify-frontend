import type { Question } from "../types";

export const mathQuestions: Question[] = [
  {
    id: "math_q1",
    number: 1,
    description: "State and explain the fundamental theorem of calculus.",
    answer:
      "The Fundamental Theorem of Calculus states that if a function f is continuous on the closed interval [a, b] and F is the indefinite integral of f, then the definite integral of f from a to b equals F(b) - F(a). This establishes the relationship between differentiation and integration as inverse processes.",
    marks: 8,
    type: "Essay",
    courseOutcome: 2,
    bloomsTaxonomy: "Understand",
    topic: "Calculus",
    difficulty: "Medium",
  },
  {
    id: "math_q2",
    number: 2,
    description: "Solve the system of equations:\n3x + 2y = 7\n5x - 3y = 8",
    answer: "x = 2, y = 1/2",
    marks: 5,
    type: "Short Answer",
    courseOutcome: 1,
    bloomsTaxonomy: "Apply",
    topic: "Algebra",
    difficulty: "Medium",
  },
  {
    id: "math_q3",
    number: 3,
    description:
      "Which of the following is the correct formula for calculating the standard deviation?",
    answer: "C) σ = sqrt(Σ(x_i - μ)²/n)",
    options: [
      { id: "a", text: "σ = Σ(x_i - μ)/n", isCorrect: false },
      { id: "b", text: "σ = Σ(x_i - μ)²/n", isCorrect: false },
      { id: "c", text: "σ = sqrt(Σ(x_i - μ)²/n)", isCorrect: true },
      { id: "d", text: "σ = Σ(x_i - μ)", isCorrect: false },
    ],
    marks: 2,
    type: "Multiple Choice",
    courseOutcome: 2,
    bloomsTaxonomy: "Remember",
    topic: "Statistics",
    difficulty: "Easy",
  },
  {
    id: "math_q4",
    number: 4,
    description:
      "Prove by induction that 1 + 2 + ... + n = n(n+1)/2 for all positive integers n.",
    answer:
      "Base case: When n = 1, LHS = 1 and RHS = 1(1+1)/2 = 1, so the statement holds.\n\nInduction hypothesis: Assume the statement is true for n = k, that is, 1 + 2 + ... + k = k(k+1)/2.\n\nInductive step: We need to show that the statement is true for n = k+1, that is, 1 + 2 + ... + k + (k+1) = (k+1)(k+2)/2.\n\nFrom the induction hypothesis, 1 + 2 + ... + k = k(k+1)/2.\nSo, 1 + 2 + ... + k + (k+1) = k(k+1)/2 + (k+1) = (k+1)(k/2 + 1) = (k+1)(k+2)/2.\nHence, the statement is true for n = k+1.\n\nBy the principle of mathematical induction, the statement is true for all positive integers n.",
    marks: 10,
    type: "Essay",
    courseOutcome: 3,
    bloomsTaxonomy: "Apply",
    topic: "Algebra",
    difficulty: "Hard",
  },
  {
    id: "math_q5",
    number: 5,
    description: "Find the derivative of f(x) = e^x * sin(x).",
    answer: "f'(x) = e^x * sin(x) + e^x * cos(x) = e^x(sin(x) + cos(x))",
    marks: 5,
    type: "Short Answer",
    courseOutcome: 2,
    bloomsTaxonomy: "Apply",
    topic: "Calculus",
    difficulty: "Medium",
  },
];
