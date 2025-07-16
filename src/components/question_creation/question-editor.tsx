"use client";

import React from "react";
import { QuestionType } from "./question-type-selector";
import MCQQuestion from "./question-types/mcq-question";
import TrueFalseQuestion from "./question-types/true-false-question";
import FillupQuestion from "./question-types/fillup-question";
import DescriptiveQuestion from "./question-types/descriptive-question";
import CodingQuestion from "./question-types/coding-question";
import MatchFollowingQuestion from "./question-types/match-following-question";
import FileUploadQuestion from "./question-types/file-upload-question";
import { FunctionMetadata } from "./types";

// Type definitions for different question data
interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface FillupBlank {
  id: string;
  position: number;
  acceptedAnswers: string[];
}

interface MatchItem {
  id: string;
  leftText: string;
  rightText: string;
}

interface TestCase {
  id: string;
  inputs: Record<string, string>;
  expectedOutput: string;
  isHidden: boolean;
}

// Base question data interface
interface BaseQuestionData {
  question: string;
  explanation?: string;
  showExplanation: boolean;
}

// Specific question data interfaces
interface MCQData extends BaseQuestionData {
  type: "mcq";
  options: MCQOption[];
  allowMultipleCorrect: boolean;
}

interface TrueFalseData extends BaseQuestionData {
  type: "true-false";
  correctAnswer: boolean | null;
}

interface FillupData extends BaseQuestionData {
  type: "fillup";
  blanks: FillupBlank[];
  strictMatch: boolean;
  useHybridEvaluation: boolean;
}

interface DescriptiveData extends BaseQuestionData {
  type: "descriptive";
  sampleAnswer?: string;
  wordLimit?: number;
  gradingCriteria?: string;
}

interface CodingData extends BaseQuestionData {
  type: "coding";
  language: string;
  starterCode?: string;
  testCases: TestCase[];
  timeLimit?: number;
  memoryLimit?: number;
  functionName?: string;
  functionMetadata?: FunctionMetadata;
}

interface MatchFollowingData extends BaseQuestionData {
  type: "match-following";
  matchItems: MatchItem[];
}

interface FileUploadData extends BaseQuestionData {
  type: "file-upload";
  allowedFileTypes: string[];
  maxFileSize: number;
  maxFiles: number;
}

type QuestionData =
  | MCQData
  | TrueFalseData
  | FillupData
  | DescriptiveData
  | CodingData
  | MatchFollowingData
  | FileUploadData;

interface QuestionEditorProps {
  questionType: QuestionType;
  questionData: QuestionData;
  onQuestionDataChange: (data: QuestionData) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  questionType,
  questionData,
  onQuestionDataChange,
}) => {
  // Helper function to create default data for each question type
  const createDefaultData = (type: QuestionType): QuestionData => {
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
          options: [
            { id: "opt-1", text: "", isCorrect: false },
            { id: "opt-2", text: "", isCorrect: false },
            { id: "opt-3", text: "", isCorrect: false },
            { id: "opt-4", text: "", isCorrect: false },
          ],
          allowMultipleCorrect: false,
        };

      case "true-false":
        return {
          ...baseData,
          type: "true-false",
          correctAnswer: null,
        };
      case "fillup":
        return {
          ...baseData,
          type: "fillup",
          blanks: [],
          strictMatch: false,
          useHybridEvaluation: false,
        };

      case "descriptive":
        return {
          ...baseData,
          type: "descriptive",
          sampleAnswer: "",
          wordLimit: undefined,
          gradingCriteria: "",
        };
      case "coding":
        return {
          ...baseData,
          type: "coding",
          language: "python",
          starterCode: "",
          testCases: [
            { id: "test-1", inputs: {}, expectedOutput: "", isHidden: false },
          ],
          timeLimit: undefined,
          memoryLimit: undefined,
          functionName: "",
          functionMetadata: {
            name: "",
            parameters: [],
            returnType: "int",
            language: "python",
          },
        };

      case "match-following":
        return {
          ...baseData,
          type: "match-following",
          matchItems: [
            { id: "match-1", leftText: "", rightText: "" },
            { id: "match-2", leftText: "", rightText: "" },
          ],
        };

      case "file-upload":
        return {
          ...baseData,
          type: "file-upload",
          allowedFileTypes: [],
          maxFileSize: 5,
          maxFiles: 1,
        };
      default:
        return {
          ...baseData,
          type: "mcq",
          options: [],
          allowMultipleCorrect: false,
        } as QuestionData;
    }
  };
  // Initialize data if type doesn't match
  React.useEffect(() => {
    if (questionData.type !== questionType) {
      const defaultData = createDefaultData(questionType);
      // Preserve common fields if they exist
      defaultData.question = questionData.question || "";
      defaultData.explanation = questionData.explanation || "";
      defaultData.showExplanation = questionData.showExplanation || false;
      onQuestionDataChange(defaultData);
    }
  }, [
    questionType,
    questionData.type,
    questionData.question,
    questionData.explanation,
    questionData.showExplanation,
    onQuestionDataChange,
  ]);

  // Helper to update question data while preserving type safety
  const updateData = <T extends QuestionData>(updates: Partial<T>) => {
    onQuestionDataChange({
      ...questionData,
      ...updates,
    } as QuestionData);
  };

  // Render the appropriate question component based on type
  const renderQuestionComponent = () => {
    switch (questionType) {
      case "mcq":
        if (questionData.type === "mcq") {
          return (
            <MCQQuestion
              question={questionData.question}
              options={questionData.options}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              allowMultipleCorrect={questionData.allowMultipleCorrect}
              onQuestionChange={(question) => updateData({ question })}
              onOptionsChange={(options) => updateData({ options })}
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
              }
              onAllowMultipleCorrectChange={(allowMultipleCorrect) =>
                updateData({ allowMultipleCorrect })
              }
            />
          );
        }
        break;

      case "true-false":
        if (questionData.type === "true-false") {
          return (
            <TrueFalseQuestion
              question={questionData.question}
              correctAnswer={questionData.correctAnswer}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              onQuestionChange={(question) => updateData({ question })}
              onCorrectAnswerChange={(correctAnswer) =>
                updateData({ correctAnswer })
              }
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
              }
            />
          );
        }
        break;
      case "fillup":
        if (questionData.type === "fillup") {
          return (
            <FillupQuestion
              question={questionData.question}
              blanks={questionData.blanks}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              strictMatch={questionData.strictMatch}
              useHybridEvaluation={questionData.useHybridEvaluation}
              onQuestionChange={(question) => updateData({ question })}
              onBlanksChange={(blanks) => updateData({ blanks })}
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
              }
              onStrictMatchChange={(strictMatch) => updateData({ strictMatch })}
              onUseHybridEvaluationChange={(useHybridEvaluation) =>
                updateData({ useHybridEvaluation })
              }
            />
          );
        }
        break;

      case "descriptive":
        if (questionData.type === "descriptive") {
          return (
            <DescriptiveQuestion
              question={questionData.question}
              sampleAnswer={questionData.sampleAnswer}
              gradingCriteria={questionData.gradingCriteria}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              onQuestionChange={(question) => updateData({ question })}
              onSampleAnswerChange={(sampleAnswer) =>
                updateData({ sampleAnswer })
              }
              onGradingCriteriaChange={(gradingCriteria) =>
                updateData({ gradingCriteria })
              }
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
              }
            />
          );
        }
        break;
      case "coding":
        if (questionData.type === "coding") {
          return (
            <CodingQuestion
              question={questionData.question}
              language={questionData.language}
              starterCode={questionData.starterCode}
              testCases={questionData.testCases}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              functionName={questionData.functionName}
              functionMetadata={questionData.functionMetadata}
              onQuestionChange={(question) => updateData({ question })}
              onLanguageChange={(language) => updateData({ language })}
              onStarterCodeChange={(starterCode) => updateData({ starterCode })}
              onTestCasesChange={(testCases) => updateData({ testCases })}
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
              }
              onFunctionMetadataChange={(functionMetadata) =>
                updateData({
                  functionMetadata,
                  functionName: functionMetadata.name,
                })
              }
            />
          );
        }
        break;

      case "match-following":
        if (questionData.type === "match-following") {
          return (
            <MatchFollowingQuestion
              question={questionData.question}
              matchItems={questionData.matchItems}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              onQuestionChange={(question) => updateData({ question })}
              onMatchItemsChange={(matchItems) => updateData({ matchItems })}
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
              }
            />
          );
        }
        break;

      case "file-upload":
        if (questionData.type === "file-upload") {
          return (
            <FileUploadQuestion
              question={questionData.question}
              allowedFileTypes={questionData.allowedFileTypes}
              maxFileSize={questionData.maxFileSize}
              maxFiles={questionData.maxFiles}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              onQuestionChange={(question) => updateData({ question })}
              onAllowedFileTypesChange={(allowedFileTypes) =>
                updateData({ allowedFileTypes })
              }
              onMaxFileSizeChange={(maxFileSize) => updateData({ maxFileSize })}
              onMaxFilesChange={(maxFiles) => updateData({ maxFiles })}
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
              }
            />
          );
        }
        break;

      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>
              Please select a question type to begin creating your question.
            </p>
          </div>
        );
    }

    // Fallback if data type doesn't match selected type
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Loading question editor...</p>
      </div>
    );
  };

  return <div className="w-full">{renderQuestionComponent()}</div>;
};

export default QuestionEditor;
export type { QuestionData, MCQOption, FillupBlank, MatchItem, TestCase };
