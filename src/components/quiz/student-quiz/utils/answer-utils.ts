/**
 * Utility functions for handling quiz answers with proper typing
 * Converts between different answer formats and question types
 */

import {
    QuizAnswerData,
    FillUpAnswer,
    MatchAnswer,
} from "../types/quiz-types";
import {
    QuizAnswerUpdate,
    StringAnswerUpdate,
    BooleanAnswerUpdate,
    UuidAnswerUpdate,
    ListUuidAnswerUpdate,
    FillUpAnswerUpdate,
    MatchAnswerUpdate,
} from "@/repo/student/quiz/student-quiz";

/**
 * Type guard functions
 */
export const isStringAnswer = (answer: QuizAnswerData): answer is string => {
    return typeof answer === "string";
};

export const isBooleanAnswer = (answer: QuizAnswerData): answer is boolean => {
    return typeof answer === "boolean";
};

export const isArrayAnswer = (answer: QuizAnswerData): answer is QuizAnswerData[] => {
    return Array.isArray(answer);
};

export const isFillUpAnswer = (answer: QuizAnswerData): answer is FillUpAnswer[] => {
    return Array.isArray(answer) &&
        answer.length > 0 &&
        answer.every(item =>
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            "answer" in item
        );
};

export const isMatchAnswer = (answer: QuizAnswerData): answer is MatchAnswer[] => {
    return Array.isArray(answer) &&
        answer.length > 0 &&
        answer.every(item =>
            typeof item === "object" &&
            item !== null &&
            "leftPairId" in item &&
            "rightPairId" in item
        );
};

export const isStringArrayAnswer = (answer: QuizAnswerData): answer is string[] => {
    return Array.isArray(answer) &&
        answer.every(item => typeof item === "string");
};

/**
 * Convert QuizAnswerData to properly typed QuizAnswerUpdate based on question type
 * @param questionId - The question ID
 * @param answer - The answer data
 * @param duration - Time spent on the question
 * @param questionType - The type of question
 * @returns Properly typed QuizAnswerUpdate
 */
export const createTypedAnswerUpdate = (
    questionId: string,
    answer: QuizAnswerData,
    duration: number,
    questionType: string
): QuizAnswerUpdate => {
    switch (questionType) {
        case "TRUE_FALSE":
            return {
                questionId,
                duration,
                booleanAnswer: Boolean(answer),
            } as BooleanAnswerUpdate;

        case "MCQ":
            return {
                questionId,
                duration,
                uuidAnswer: String(answer),
            } as UuidAnswerUpdate;

        case "MMCQ":
            const mmcqAnswer = isStringArrayAnswer(answer) ? answer : [];
            return {
                questionId,
                duration,
                listUUIDAnswer: mmcqAnswer,
            } as ListUuidAnswerUpdate;

        case "FILL_UP":
            const fillUpAnswer = isFillUpAnswer(answer) ? answer : [];
            return {
                questionId,
                duration,
                fillupAnswer: fillUpAnswer,
            } as FillUpAnswerUpdate;

        case "MATCH":
            const matchAnswer = isMatchAnswer(answer) ? answer : [];
            return {
                questionId,
                duration,
                matchAnswer: matchAnswer,
            } as MatchAnswerUpdate;

        case "DESCRIPTIVE":
        case "CODING":
        case "FILE_UPLOAD":
        default:
            return {
                questionId,
                duration,
                stringAnswer: String(answer || ""),
            } as StringAnswerUpdate;
    }
};

/**
 * Validate answer format based on question type
 * @param answer - The answer to validate
 * @param questionType - The type of question
 * @returns True if the answer format is valid for the question type
 */
export const validateAnswerFormat = (
    answer: QuizAnswerData,
    questionType: string
): boolean => {
    switch (questionType) {
        case "TRUE_FALSE":
            return isBooleanAnswer(answer);

        case "MCQ":
            return isStringAnswer(answer);

        case "MMCQ":
            return isStringArrayAnswer(answer);

        case "FILL_UP":
            return isFillUpAnswer(answer);

        case "MATCH":
            return isMatchAnswer(answer);

        case "DESCRIPTIVE":
        case "CODING":
        case "FILE_UPLOAD":
            return isStringAnswer(answer);

        default:
            return false;
    }
};

/**
 * Get empty answer for a specific question type
 * @param questionType - The type of question
 * @returns Empty answer in the correct format
 */
export const getEmptyAnswerByType = (questionType: string): QuizAnswerData => {
    switch (questionType) {
        case "TRUE_FALSE":
            return false;

        case "MCQ":
            return "";

        case "MMCQ":
            return [];

        case "FILL_UP":
            return [];

        case "MATCH":
            return [];

        case "DESCRIPTIVE":
        case "CODING":
        case "FILE_UPLOAD":
        default:
            return "";
    }
};

/**
 * Check if an answer is empty based on question type
 * @param answer - The answer to check
 * @param questionType - The type of question
 * @returns True if the answer is empty
 */
export const isAnswerEmpty = (
    answer: QuizAnswerData,
    questionType: string
): boolean => {
    switch (questionType) {
        case "TRUE_FALSE":
            return answer === null || answer === undefined;

        case "MCQ":
            return !answer || String(answer).trim() === "";

        case "MMCQ":
            return !Array.isArray(answer) || answer.length === 0;

        case "FILL_UP":
            if (!Array.isArray(answer)) return true;
            const fillUpAnswers = answer as FillUpAnswer[];
            return fillUpAnswers.every(
                ans => !ans.answer || ans.answer.trim() === ""
            );

        case "MATCH":
            return !Array.isArray(answer) || answer.length === 0;

        case "DESCRIPTIVE":
        case "CODING":
        case "FILE_UPLOAD":
        default:
            return !answer || String(answer).trim() === "";
    }
};