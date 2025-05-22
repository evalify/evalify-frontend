export interface BaseQuestion {
  id: string | number; // Allow both string and number IDs
  question: string;
  marks: number;
  type: string;
  sectionId: number;
  topic?: string[];
}
export interface MCQQuestion extends BaseQuestion {
  type: "MCQ";
  options: Option[];
}
export interface MultipleSelectQuestion extends BaseQuestion {
  type: "MULTI_SELECT";
  options: Option[];
}
export interface CodingQuestion extends BaseQuestion {
  type: "CODING";
  driverCode: string;
  boilerTemplate: string;
}

export interface MatchtheFollowingQuestion extends BaseQuestion {
  type: "MATCH_THE_FOLLOWING";
  key: {
    id: string;
    text: string;
  }[];
  value: {
    id: string;
    text: string;
  }[];
}

export interface FillInTheBlanksQuestion extends BaseQuestion {
  type: "FILL_IN_THE_BLANKS";
}

export interface DescriptiveQuestion extends BaseQuestion {
  type: "DESCRIPTIVE";
  maxWordLimit?: number;
}

export type Question =
  | MCQQuestion
  | MultipleSelectQuestion
  | CodingQuestion
  | MatchtheFollowingQuestion
  | FillInTheBlanksQuestion
  | DescriptiveQuestion
  | BaseQuestion;

export interface MatchTheFollowingAnswer {
  [key_id: string]: string;
}

export interface FillInTheBlanksAnswer {
  blanks: string[];
}

export interface DescriptiveAnswer {
  text: string;
}

export interface MCQAnswer {
  selectedOption: number;
}

export interface MultipleSelectAnswer {
  selectedOptions: number[];
}

export interface CodingAnswer {
  code: string;
  language: string;
  activeFileId?: string;
  files: Array<{
    id: string;
    name: string;
    language: string;
    content: string;
  }>;
}

export interface Option {
  text: string;
  correct: boolean;
}

export interface Section {
  id: number;
  name: string;
  totalMarks: number;
  totalQuestions: number;
  timeLimit: number;
}

export interface QuizData {
  id: string | number;
  sections: Section[];
  totalMarks: number;
  totalQuestions: number;
  timeLimit: number;
  title: string;
  description: string;
  instructions: string;
  startTime: string;
  questions: Question[];
}

export interface QuizStats {
  attempted: number;
  viewed: number;
  notViewed: number;
  forReview: number;
  total: number;
}

export interface QuizContextType {
  questionStatus: Record<string, number>;
  currentQuestionId: string | number;
  currentSectionId: number;
  setCurrentQuestionId: (id: string | number) => void;
  setCurrentSectionId: (id: number) => void;
  markQuestionAttempted: (id: string | number) => void;
  markQuestionViewed: (id: string | number) => void;
  markQuestionForReview: (id: string | number) => void;
  stats: QuizStats;
  matchAnswers: Record<string, MatchTheFollowingAnswer[]>;
  setMatchAnswers: (
    questionId: string | number,
    answers: MatchTheFollowingAnswer[],
  ) => void;
  blanksAnswers: Record<string, FillInTheBlanksAnswer>;
  setBlanksAnswers: (
    questionId: string | number,
    answers: FillInTheBlanksAnswer,
  ) => void;
  descriptiveAnswers: Record<string, DescriptiveAnswer>;
  setDescriptiveAnswers: (
    questionId: string | number,
    answer: DescriptiveAnswer,
  ) => void;
  mcqAnswers: Record<string, MCQAnswer>;
  setMCQAnswers: (questionId: string | number, answer: MCQAnswer) => void;
  codingAnswers: Record<string, CodingAnswer>;
  setCodingAnswers: (
    questionId: string | number,
    answer: CodingAnswer,
    hasChanged?: boolean,
  ) => void;
  multipleSelectAnswers: Record<string, MultipleSelectAnswer>;
  setMultipleSelectAnswers: (
    questionId: string | number,
    answer: MultipleSelectAnswer,
  ) => void;
}
