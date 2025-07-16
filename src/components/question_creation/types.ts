export interface FunctionParameter {
  id: string;
  name: string;
  type: string;
}

export interface TestCase {
  id: string;
  inputs: Record<string, string>; // parameter name -> value
  expectedOutput: string;
  isHidden: boolean;
}

export interface FunctionMetadata {
  name: string;
  parameters: FunctionParameter[];
  returnType: string;
  language: string;
}

export interface CodingQuestionData {
  functionMetadata: FunctionMetadata;
  testCases: TestCase[];
  boilerplateCode: string;
  description: string;
}

// Question creation and response types
export interface QuestionCreationRequest {
  type: string;
  data?: any; // Question-specific data (varies by question type)
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
  metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
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
