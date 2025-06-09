import type { Question } from "../types";

export const physicsQuestions: Question[] = [
  {
    id: "phys_q1",
    number: 1,
    description: "State Newton's three laws of motion.",
    answer:
      "1. First Law (Law of Inertia): An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.\n2. Second Law: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F = ma).\n3. Third Law: For every action, there is an equal and opposite reaction.",
    marks: 6,
    type: "Short Answer",
    courseOutcome: 1,
    bloomsTaxonomy: "Remember",
    topic: "Mechanics",
    difficulty: "Medium",
  },
  {
    id: "phys_q2",
    number: 2,
    description: "Explain the first law of thermodynamics and give an example.",
    answer:
      "The first law of thermodynamics states that energy cannot be created or destroyed, only transferred or converted from one form to another. This is essentially the law of conservation of energy applied to thermodynamic systems. For example, when a gas is heated, the energy added as heat increases the internal energy of the gas, which might result in an increase in temperature and/or the performance of work by the gas as it expands against its surroundings.",
    marks: 8,
    type: "Essay",
    courseOutcome: 2,
    bloomsTaxonomy: "Understand",
    topic: "Thermodynamics",
    difficulty: "Medium",
  },
  {
    id: "phys_q3",
    number: 3,
    description: "Which of these is NOT a fundamental force in nature?",
    answer: "C) Frictional force",
    options: [
      { id: "a", text: "Gravitational force", isCorrect: false },
      { id: "b", text: "Electromagnetic force", isCorrect: false },
      { id: "c", text: "Frictional force", isCorrect: true },
      { id: "d", text: "Strong nuclear force", isCorrect: false },
    ],
    marks: 2,
    type: "Multiple Choice",
    courseOutcome: 1,
    bloomsTaxonomy: "Remember",
    topic: "Mechanics",
    difficulty: "Easy",
  },
  {
    id: "phys_q4",
    number: 4,
    description:
      "Derive the formula for the electric field due to a point charge using Coulomb's Law.",
    answer:
      "According to Coulomb's Law, the force between two point charges is given by F = k * q1 * q2 / r², where k is Coulomb's constant.\n\nThe electric field E at a point due to a charge q is defined as the force experienced by a unit positive charge placed at that point. So, E = F / q0, where q0 is the test charge.\n\nSubstituting, E = (k * q * q0 / r²) / q0 = k * q / r².\n\nIn vector form, E = k * q * r̂ / r², where r̂ is the unit vector from the charge q to the point where the field is being calculated.",
    marks: 10,
    type: "Essay",
    courseOutcome: 3,
    bloomsTaxonomy: "Apply",
    topic: "Electromagnetism",
    difficulty: "Hard",
  },
  {
    id: "phys_q5",
    number: 5,
    description:
      "A car moves with a constant acceleration of 2 m/s². If its initial velocity is 10 m/s, how far will it travel in 5 seconds?",
    answer:
      "Using the equation s = ut + (1/2)at², where s is displacement, u is initial velocity, a is acceleration, and t is time: s = 10 × 5 + (1/2) × 2 × 5² = 50 + 25 = 75 meters.",
    marks: 5,
    type: "Short Answer",
    courseOutcome: 2,
    bloomsTaxonomy: "Apply",
    topic: "Mechanics",
    difficulty: "Medium",
  },
];
