export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export interface Question {
  id: string;
  number: number;
  description: string;
  answer: string;
  options?: Option[];
  marks: number;
  type: string;
  courseOutcome: number;
  bloomsTaxonomy: string;
  topic?: string;
  difficulty?: string;
  source?: string; // Question bank source
}

export interface Quiz {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  startTime: string; // ISO 8601 timestamp
  endTime: string; // ISO 8601 timestamp
  duration: string; // ISO 8601 duration (e.g., PT1H30M)
  password: string | null;
  fullScreen: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  linearQuiz: boolean;
  calculator: boolean;
  autoSubmit: boolean;
  publishResult: boolean;
  publishQuiz: boolean;
  createdAt: string; // ISO 8601 timestamp
  course: string[]; // Array of UUID
  student: string[]; // Array of UUID
  lab: string[]; // Array of UUID
  batch: string[]; // Array of UUID
  createdBy: string | object; // UUID or object
}

export interface Course {
  id: string;
  name: string;
  code: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
}

export interface Lab {
  id: string;
  name: string;
  location: string;
}

export interface Batch {
  id: string;
  name: string;
  year: number;
}
