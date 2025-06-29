"use client";

import React from "react";
import MCQQuestion from "./question-types/mcq-question";
import TrueFalseQuestion from "./question-types/true-false-question";
import FillupQuestion from "./question-types/fillup-question";
import DescriptiveQuestion from "./question-types/descriptive-question";
import CodingQuestion from "./question-types/coding-question";
import MatchFollowingQuestion from "./question-types/match-following-question";
import FileUploadQuestion from "./question-types/file-upload-question";
import {
  QuestionData,
  QuestionEditorProps,
  createDefaultQuestionData,
} from "./question-creation-types";
import {
  MCQOption,
  Blank,
  MatchPair,
  TestCase,
} from "@/components/render-questions/types";

// Import types from question type components for type adapters
interface MCQOptionComponent {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface FillupBlankComponent {
  id: string;
  position: number;
  acceptedAnswers: string[];
}

interface MatchItemComponent {
  id: string;
  leftText: string;
  rightText: string;
}

interface TestCaseComponent {
  id: string;
  inputs: Record<string, string>;
  expectedOutput: string;
  isHidden: boolean;
}

// Type adapter functions
const adaptMCQOptions = (options: MCQOption[]): MCQOptionComponent[] => {
  return options.map((option, index) => ({
    id: option.id || `opt-${index + 1}`,
    text: option.text || "",
    isCorrect: option.isCorrect || false,
  }));
};

const adaptBlanks = (blanks: Blank[]): FillupBlankComponent[] => {
  return blanks.map((blank, index) => ({
    id: blank.id || `blank-${index + 1}`,
    position: index,
    acceptedAnswers: blank.answers || [],
  }));
};

const adaptMatchItems = (matchItems: MatchPair[]): MatchItemComponent[] => {
  return matchItems.map((item, index) => ({
    id: item.id || `match-${index + 1}`,
    leftText: item.leftPair || "",
    rightText: item.rightPair || "",
  }));
};

const adaptTestCases = (testCases: TestCase[]): TestCaseComponent[] => {
  return testCases.map((testCase, index) => {
    let inputs: Record<string, string> = {};

    if (Array.isArray(testCase.input)) {
      inputs = testCase.input.reduce(
        (acc: Record<string, string>, val, idx) => {
          acc[`param${idx}`] = String(val);
          return acc;
        },
        {},
      );
    } else {
      inputs = { input: String(testCase.input || "") };
    }

    return {
      id: testCase.id || `test-${index + 1}`,
      inputs,
      expectedOutput: String(testCase.expected || ""),
      isHidden: testCase.isHidden || false,
    };
  });
};

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  questionType,
  questionData,
  onQuestionDataChange,
}) => {
  // Initialize data if type doesn't match
  React.useEffect(() => {
    if (questionData.type !== questionType) {
      const defaultData = createDefaultQuestionData(questionType);
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
              options={adaptMCQOptions(questionData.options)}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              allowMultipleCorrect={questionData.allowMultipleCorrect}
              onQuestionChange={(question) => updateData({ question })}
              onOptionsChange={(options) =>
                updateData({
                  options: options.map((opt) => ({
                    id: opt.id || null,
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                  })),
                })
              }
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

      case "mmcq":
        if (questionData.type === "mmcq") {
          return (
            <MCQQuestion
              question={questionData.question}
              options={adaptMCQOptions(questionData.options)}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              allowMultipleCorrect={true}
              onQuestionChange={(question) => updateData({ question })}
              onOptionsChange={(options) =>
                updateData({
                  options: options.map((opt) => ({
                    id: opt.id || null,
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                  })),
                })
              }
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
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
              blanks={adaptBlanks(questionData.blanks)}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              strictMatch={questionData.strictMatch || false}
              useHybridEvaluation={false}
              onQuestionChange={(question) => updateData({ question })}
              onBlanksChange={(blanks) =>
                updateData({
                  blanks: blanks.map((blank) => ({
                    id: blank.id,
                    answers: blank.acceptedAnswers,
                  })),
                })
              }
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
              }
              onStrictMatchChange={(strictMatch) => updateData({ strictMatch })}
              onUseHybridEvaluationChange={() => {}}
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
              language={questionData.language[0] || "python"}
              starterCode={questionData.starterCode}
              testCases={adaptTestCases(questionData.testCases)}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              functionName={questionData.functionName}
              onQuestionChange={(question) => updateData({ question })}
              onLanguageChange={(language) =>
                updateData({ language: [language] })
              }
              onStarterCodeChange={(starterCode) => updateData({ starterCode })}
              onTestCasesChange={(testCases) =>
                updateData({
                  testCases: testCases.map((tc) => ({
                    id: tc.id || undefined,
                    input: Object.values(tc.inputs || {}),
                    expected: tc.expectedOutput,
                    isHidden: tc.isHidden,
                  })),
                })
              }
              onExplanationChange={(explanation) => updateData({ explanation })}
              onShowExplanationChange={(showExplanation) =>
                updateData({ showExplanation })
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
              matchItems={adaptMatchItems(questionData.matchItems)}
              explanation={questionData.explanation}
              showExplanation={questionData.showExplanation}
              onQuestionChange={(question) => updateData({ question })}
              onMatchItemsChange={(matchItems) =>
                updateData({
                  matchItems: matchItems.map((item) => ({
                    id: item.id,
                    leftPair: item.leftText,
                    rightPair: item.rightText,
                  })),
                })
              }
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

  return (
    <div className="h-full overflow-auto">{renderQuestionComponent()}</div>
  );
};

export default QuestionEditor;
export type {
  QuestionData,
  MCQOptionComponent,
  FillupBlankComponent,
  MatchItemComponent,
  TestCaseComponent,
};
