import type { Question } from "../types";

export const databaseQuestions: Question[] = [
  {
    id: "db_q1",
    number: 1,
    description: "What is normalization in database design?",
    answer:
      "Normalization is a systematic approach to decomposing tables to eliminate data redundancy and undesirable characteristics like Insertion, Update and Deletion Anomalies. It is a multi-step process that puts data into tabular form, removing duplicated data from the relation tables. The normal forms (1NF, 2NF, 3NF, BCNF, etc.) represent guidelines for record design.",
    marks: 5,
    type: "Short Answer",
    courseOutcome: 2,
    bloomsTaxonomy: "Understand",
    topic: "Normalization",
    difficulty: "Medium",
  },
  {
    id: "db_q2",
    number: 2,
    description: "Explain the ACID properties of database transactions.",
    answer:
      "ACID is an acronym that stands for:\n\nAtomicity: A transaction is an atomic unit of work, either completely done or not done at all.\n\nConsistency: A transaction takes the database from one consistent state to another consistent state.\n\nIsolation: A transaction should not make its updates visible to other transactions until it is committed.\n\nDurability: Once a transaction has been committed, its effects are permanently in place in the system, even if there are system failures.",
    marks: 8,
    type: "Essay",
    courseOutcome: 2,
    bloomsTaxonomy: "Understand",
    topic: "Transaction Processing",
    difficulty: "Medium",
  },
  {
    id: "db_q3",
    number: 3,
    description: "Which SQL statement is used to extract data from a database?",
    answer: "A) SELECT",
    options: [
      { id: "a", text: "SELECT", isCorrect: true },
      { id: "b", text: "EXTRACT", isCorrect: false },
      { id: "c", text: "GET", isCorrect: false },
      { id: "d", text: "OPEN", isCorrect: false },
    ],
    marks: 2,
    type: "Multiple Choice",
    courseOutcome: 1,
    bloomsTaxonomy: "Remember",
    topic: "SQL",
    difficulty: "Easy",
  },
  {
    id: "db_q4",
    number: 4,
    description:
      "Write a SQL query to find the second highest salary from an Employees table.",
    answer:
      "SELECT MAX(Salary) FROM Employees WHERE Salary < (SELECT MAX(Salary) FROM Employees);\n\nAlternatively:\nSELECT Salary FROM Employees ORDER BY Salary DESC LIMIT 1,1;\n\nOr using a subquery with DENSE_RANK():\nSELECT Salary FROM (SELECT Salary, DENSE_RANK() OVER (ORDER BY Salary DESC) as RnkNum FROM Employees) as RankedSalaries WHERE RnkNum = 2;",
    marks: 5,
    type: "Short Answer",
    courseOutcome: 3,
    bloomsTaxonomy: "Apply",
    topic: "SQL",
    difficulty: "Hard",
  },
  {
    id: "db_q5",
    number: 5,
    description:
      "Explain the difference between primary key and foreign key in a relational database.",
    answer:
      "A primary key is a column or set of columns in a table that uniquely identifies each row in the table. It must contain unique values and cannot be NULL. A table can have only one primary key.\n\nA foreign key is a column or set of columns in one table that references the primary key in another table. It establishes a relationship between two tables. A table can have multiple foreign keys, and they can be NULL (unless there are constraints).\n\nThe primary key enforces entity integrity, while the foreign key enforces referential integrity in the database.",
    marks: 5,
    type: "Short Answer",
    courseOutcome: 2,
    bloomsTaxonomy: "Understand",
    topic: "Normalization",
    difficulty: "Medium",
  },
];
