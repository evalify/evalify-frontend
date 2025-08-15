/**
 * Question handlers for different question types
 * Each handler implements business logic for validation, formatting, and state management
 */

import { BaseQuestionHandler } from "../interfaces/quiz-interfaces";
import {
  QuizAnswerData,
  FillUpAnswer,
  MatchAnswer,
  BlankId,
  MatchKeyValues,
} from "../types/quiz-types";

/**
 * Handler for True/False questions
 */
export class TrueFalseHandler extends BaseQuestionHandler {
  questionType = "TRUE_FALSE";

  validate(answer: QuizAnswerData): boolean {
    return this.isValidBoolean(answer);
  }

  formatAnswer(answer: QuizAnswerData): QuizAnswerData {
    return Boolean(answer);
  }

  getEmptyAnswer(): QuizAnswerData {
    return false;
  }

  isAnswerEmpty(answer: QuizAnswerData): boolean {
    return answer === null || answer === undefined;
  }
}

/**
 * Handler for Multiple Choice Questions (single select)
 */
export class MCQHandler extends BaseQuestionHandler {
  questionType = "MCQ";

  validate(answer: QuizAnswerData): boolean {
    return this.isValidString(answer);
  }

  formatAnswer(answer: QuizAnswerData): QuizAnswerData {
    return String(answer).trim();
  }

  getEmptyAnswer(): QuizAnswerData {
    return "";
  }

  isAnswerEmpty(answer: QuizAnswerData): boolean {
    return !answer || String(answer).trim() === "";
  }
}

/**
 * Handler for Multiple Choice Questions (multiple select)
 */
export class MMCQHandler extends BaseQuestionHandler {
  questionType = "MMCQ";

  validate(answer: QuizAnswerData): boolean {
    return (
      this.isValidArray(answer) &&
      Array.isArray(answer) &&
      answer.every((item) => this.isValidString(item))
    );
  }

  formatAnswer(answer: QuizAnswerData): QuizAnswerData {
    if (!Array.isArray(answer)) return [];
    return (answer as string[]).filter(
      (item) => item && String(item).trim() !== "",
    );
  }

  getEmptyAnswer(): QuizAnswerData {
    return [];
  }

  isAnswerEmpty(answer: QuizAnswerData): boolean {
    return !Array.isArray(answer) || answer.length === 0;
  }
}

/**
 * Handler for Descriptive questions
 */
export class DescriptiveHandler extends BaseQuestionHandler {
  questionType = "DESCRIPTIVE";

  validate(answer: QuizAnswerData): boolean {
    return this.isValidString(answer);
  }

  formatAnswer(answer: QuizAnswerData): QuizAnswerData {
    return String(answer).trim();
  }

  getEmptyAnswer(): QuizAnswerData {
    return "";
  }

  isAnswerEmpty(answer: QuizAnswerData): boolean {
    return !answer || String(answer).trim() === "";
  }
}

/**
 * Handler for Fill in the blanks questions
 */
export class FillUpHandler extends BaseQuestionHandler {
  questionType = "FILL_UP";
  private blankIds: BlankId[];

  constructor(blankIds: BlankId[]) {
    super();
    this.blankIds = blankIds;
  }

  validate(answer: QuizAnswerData): boolean {
    if (!Array.isArray(answer)) return false;

    const fillUpAnswers = answer as FillUpAnswer[];

    // Check if all blanks have corresponding answers
    const requiredIds = this.blankIds.map((blank) => String(blank.id));
    const providedIds = fillUpAnswers.map((ans) => ans.id);

    return requiredIds.every((id) => providedIds.includes(id));
  }

  formatAnswer(answer: QuizAnswerData): QuizAnswerData {
    if (!Array.isArray(answer)) return this.getEmptyAnswer();

    const fillUpAnswers = answer as FillUpAnswer[];
    return fillUpAnswers.map((ans) => ({
      id: ans.id,
      answer: ans.answer ? String(ans.answer).trim() : null,
    }));
  }

  getEmptyAnswer(): QuizAnswerData {
    return this.blankIds.map((blank) => ({
      id: String(blank.id),
      answer: null,
    }));
  }

  isAnswerEmpty(answer: QuizAnswerData): boolean {
    if (!Array.isArray(answer)) return true;

    const fillUpAnswers = answer as FillUpAnswer[];
    return fillUpAnswers.every(
      (ans) => !ans.answer || ans.answer.trim() === "",
    );
  }
}

/**
 * Handler for Match the following questions
 */
export class MatchHandler extends BaseQuestionHandler {
  questionType = "MATCH";
  private keyValues: MatchKeyValues;

  constructor(keyValues: MatchKeyValues) {
    super();
    this.keyValues = keyValues;
  }

  validate(answer: QuizAnswerData): boolean {
    if (!Array.isArray(answer)) return false;

    const matchAnswers = answer as MatchAnswer[];
    const leftIds = this.keyValues.left.map((item) => item.id);
    const rightIds = this.keyValues.right.map((item) => item.id);

    return matchAnswers.every(
      (ans) =>
        leftIds.includes(ans.leftPairId) && rightIds.includes(ans.rightPairId),
    );
  }

  formatAnswer(answer: QuizAnswerData): QuizAnswerData {
    if (!Array.isArray(answer)) return this.getEmptyAnswer();

    const matchAnswers = answer as MatchAnswer[];
    return matchAnswers.filter((ans) => ans.leftPairId && ans.rightPairId);
  }

  getEmptyAnswer(): QuizAnswerData {
    return [];
  }

  isAnswerEmpty(answer: QuizAnswerData): boolean {
    if (!Array.isArray(answer)) return true;

    const matchAnswers = answer as MatchAnswer[];
    return matchAnswers.length === 0;
  }
}

/**
 * Handler for Coding questions
 */
export class CodingHandler extends BaseQuestionHandler {
  questionType = "CODING";

  validate(answer: QuizAnswerData): boolean {
    return this.isValidString(answer);
  }

  formatAnswer(answer: QuizAnswerData): QuizAnswerData {
    return String(answer);
  }

  getEmptyAnswer(): QuizAnswerData {
    return "";
  }

  isAnswerEmpty(answer: QuizAnswerData): boolean {
    return !answer || String(answer).trim() === "";
  }
}

/**
 * Handler for File upload questions
 */
export class FileUploadHandler extends BaseQuestionHandler {
  questionType = "FILE_UPLOAD";

  validate(answer: QuizAnswerData): boolean {
    return this.isValidString(answer);
  }

  formatAnswer(answer: QuizAnswerData): QuizAnswerData {
    return String(answer).trim();
  }

  getEmptyAnswer(): QuizAnswerData {
    return "";
  }

  isAnswerEmpty(answer: QuizAnswerData): boolean {
    return !answer || String(answer).trim() === "";
  }
}
