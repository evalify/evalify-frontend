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

// Language configurations for boilerplate generation
export const SUPPORTED_LANGUAGES = [
  "python",
  "javascript",
  "java",
  "cpp",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
