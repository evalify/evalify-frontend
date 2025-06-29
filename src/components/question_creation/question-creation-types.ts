import {
  QuestionTypes,
  Difficulty,
  Taxonomy,
  MCQOption,
  Blank,
  MatchPair,
  FunctionParam,
  TestCase,
} from "@/components/render-questions/types";

// Map question creation types to render question types
export type QuestionType =
  | "mcq"
  | "mmcq"
  | "fillup"
  | "match-following"
  | "descriptive"
  | "true-false"
  | "coding"
  | "file-upload";

// Convert creation type to render type
export const questionTypeMapping: Record<QuestionType, QuestionTypes> = {
  mcq: QuestionTypes.MCQ,
  mmcq: QuestionTypes.MMCQ,
  fillup: QuestionTypes.FILL_UP,
  "match-following": QuestionTypes.MATCH_THE_FOLLOWING,
  descriptive: QuestionTypes.DESCRIPTIVE,
  "true-false": QuestionTypes.TRUE_FALSE,
  coding: QuestionTypes.CODING,
  "file-upload": QuestionTypes.FILE_UPLOAD,
};

// Question Settings Interface
export interface QuestionCreationSettings {
  marks: number;
  difficulty: Difficulty;
  bloomsTaxonomy: Taxonomy | "";
  courseOutcome: string;
  topics: TopicOption[];
}

export interface TopicOption {
  value: string;
  label: string;
}

// Base Question Data Interface for creation
interface BaseQuestionData {
  question: string;
  explanation?: string;
  showExplanation: boolean;
  hintText?: string;
}

// Specific question data interfaces for creation
export interface MCQQuestionData extends BaseQuestionData {
  type: "mcq";
  options: MCQOption[];
  allowMultipleCorrect: boolean;
}

export interface MMCQQuestionData extends BaseQuestionData {
  type: "mmcq";
  options: MCQOption[];
}

export interface TrueFalseQuestionData extends BaseQuestionData {
  type: "true-false";
  correctAnswer: boolean | null;
}

export interface FillupQuestionData extends BaseQuestionData {
  type: "fillup";
  blanks: Blank[];
  strictMatch?: boolean;
  llmEval?: boolean;
  template?: string;
}

export interface MatchFollowingQuestionData extends BaseQuestionData {
  type: "match-following";
  matchItems: MatchPair[];
}

export interface DescriptiveQuestionData extends BaseQuestionData {
  type: "descriptive";
  sampleAnswer?: string;
  wordLimit?: number;
  gradingCriteria?: string;
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;
}

export interface CodingQuestionData extends BaseQuestionData {
  type: "coding";
  language: string[];
  starterCode?: string;
  testCases: TestCase[];
  timeLimit?: number;
  memoryLimit?: number;
  functionName?: string;
  returnType?: string;
  params?: FunctionParam[];
  driverCode?: string;
  boilerCode?: string;
  answer?: string;
}

export interface FileUploadQuestionData extends BaseQuestionData {
  type: "file-upload";
  allowedFileTypes: string[];
  maxFileSize: number;
  maxFiles: number;
  expectedAnswer?: string;
  strictness?: number;
  guidelines?: string;
}

// Union type for all question data
export type QuestionData =
  | MCQQuestionData
  | MMCQQuestionData
  | TrueFalseQuestionData
  | FillupQuestionData
  | MatchFollowingQuestionData
  | DescriptiveQuestionData
  | CodingQuestionData
  | FileUploadQuestionData;

// API Request/Response interfaces
export interface QuestionCreationRequest {
  type: QuestionType;
  data: QuestionData;
  settings: QuestionCreationSettings;
}

export interface QuestionResponse {
  id: string;
  message: string;
  question: QuestionCreationRequest;
}

// Props interfaces
export interface QuestionCreationPageProps {
  isEdit?: boolean;
  initialQuestionData?: QuestionData;
  initialQuestionSettings?: QuestionCreationSettings;
  questionId?: string;
}

export interface QuestionEditorProps {
  questionType: QuestionType;
  questionData: QuestionData;
  onQuestionDataChange: (data: QuestionData) => void;
}

export interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onTypeSelect: (type: QuestionType) => void;
  onPreview: () => void;
  onSave: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
  hasChanges?: boolean;
}

export interface QuestionSettingsProps {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  courseOutcome: string;
  topics: TopicOption[];
  onMarksChange: (marks: number) => void;
  onDifficultyChange: (difficulty: string) => void;
  onBloomsTaxonomyChange: (bloomsTaxonomy: string) => void;
  onCourseOutcomeChange: (courseOutcome: string) => void;
  onTopicsChange: (topics: TopicOption[]) => void;
}

// Validation related types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Default data creators
export const createDefaultQuestionData = (type: QuestionType): QuestionData => {
  const baseData = {
    question: "",
    explanation: "",
    showExplanation: false,
  };

  switch (type) {
    case "mcq":
      return {
        ...baseData,
        type: "mcq",
        allowMultipleCorrect: false,
        options: [
          { id: null, text: "", isCorrect: false },
          { id: null, text: "", isCorrect: false },
          { id: null, text: "", isCorrect: false },
          { id: null, text: "", isCorrect: false },
        ],
      };
    case "mmcq":
      return {
        ...baseData,
        type: "mmcq",
        options: [
          { id: null, text: "", isCorrect: false },
          { id: null, text: "", isCorrect: false },
          { id: null, text: "", isCorrect: false },
          { id: null, text: "", isCorrect: false },
        ],
      };
    case "fillup":
      return {
        ...baseData,
        type: "fillup",
        blanks: [],
        strictMatch: false,
        llmEval: false,
      };
    case "match-following":
      return {
        ...baseData,
        type: "match-following",
        matchItems: [],
      };
    case "descriptive":
      return {
        ...baseData,
        type: "descriptive",
        sampleAnswer: "",
        wordLimit: 500,
        gradingCriteria: "",
      };
    case "true-false":
      return {
        ...baseData,
        type: "true-false",
        correctAnswer: null,
      };
    case "coding":
      return {
        ...baseData,
        type: "coding",
        language: ["python"],
        starterCode: "",
        testCases: [],
        timeLimit: 30,
        memoryLimit: 256,
        functionName: "",
      };
    case "file-upload":
      return {
        ...baseData,
        type: "file-upload",
        allowedFileTypes: [],
        maxFileSize: 10,
        maxFiles: 1,
      };
    default:
      return {
        ...baseData,
        type: "mcq",
        allowMultipleCorrect: false,
        options: [],
      };
  }
};

export const createDefaultQuestionSettings = (): QuestionCreationSettings => ({
  marks: 1,
  difficulty: Difficulty.MEDIUM,
  bloomsTaxonomy: "",
  courseOutcome: "",
  topics: [],
});
