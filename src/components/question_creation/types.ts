export interface CodingTestCase {
  id: string;
  code: string;
  tags: "SAMPLE" | "HIDDEN";
  isMinimal: boolean;
  language: string;
}

export interface CodingQuestionData {
  testCases: CodingTestCase[];
  boilerplateCode: string;
  driverCode: string;
  description: string;
  strictMatch: boolean;
  llmEval: boolean;
  languages: string[];
}

// Question creation and response types
export interface QuestionCreationRequest {
  type: string;
  data?: Record<string, unknown>; // Question-specific data (varies by question type)
  settings?: {
    marks: number;
    difficulty: string;
    bloomsTaxonomy: string;
    courseOutcome: string;
    topics: { value: string; label: string }[];
  };
  content?: string;
  marks?: number;
  difficulty?: string;
  bloomsTaxonomy?: string;
  courseOutcome?: string;
  topics?: string[];
  metadata?: Record<string, unknown>;
}

export interface QuestionResponse {
  id: string;
  type: string;
  content: string;
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  courseOutcome: string;
  topics: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Language configurations for boilerplate generation
export const SUPPORTED_LANGUAGES = [
  "python",
  "javascript",
  "java",
  "cpp",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
