/**
 * Utility functions for handling quiz start responses and extracting answers
 * Processes existing responses from the API and converts them to the local format
 */

import { QuizAnswerData, FillUpAnswer, MatchAnswer, QuizInterface, QuizQuestion } from "../types/quiz-types";

/**
 * API response structure from the quiz start endpoint
 */
export interface QuizStartResponse {
    questionId: string;
    duration: number;
    stringAnswer: string | null;
    uuidAnswer: string | null;
    listUUIDAnswer: string[] | null;
    booleanAnswer: boolean | null;
    fillupAnswer: FillUpAnswer[] | null;
    matchAnswer: MatchAnswer[] | null;
}

/**
 * Extract the actual answer from the API response based on question type
 * @param response - The API response object
 * @param questionType - The type of question
 * @returns The answer in the correct format, or null if no answer exists
 */
export const extractAnswerFromResponse = (
    response: QuizStartResponse | null,
    questionType: string
): QuizAnswerData | null => {
    if (!response) return null;

    switch (questionType) {
        case "DESCRIPTIVE":
        case "CODING":
        case "FILE_UPLOAD":
            return response.stringAnswer;

        case "TRUE_FALSE":
        case "TRUEFALSE":
            return response.booleanAnswer;

        case "MCQ":
            return response.uuidAnswer;

        case "MMCQ":
            return response.listUUIDAnswer;

        case "FILL_UP":
            return response.fillupAnswer;

        case "MATCH_THE_FOLLOWING":
            return response.matchAnswer;

        default:
            console.warn(`Unknown question type: ${questionType}`);
            return null;
    }
};

/**
 * Check if a response has any answer data
 * @param response - The API response object
 * @returns True if any answer field contains data
 */
export const hasAnswerInResponse = (response: QuizStartResponse | null): boolean => {
    if (!response) return false;

    return !!(
        response.stringAnswer ||
        response.booleanAnswer !== null ||
        response.uuidAnswer ||
        (response.listUUIDAnswer && response.listUUIDAnswer.length > 0) ||
        (response.fillupAnswer && response.fillupAnswer.length > 0) ||
        (response.matchAnswer && response.matchAnswer.length > 0)
    );
};

/**
 * Get the time spent from the response
 * @param response - The API response object
 * @returns The duration in milliseconds, or 0 if no response
 */
export const getTimeSpentFromResponse = (response: QuizStartResponse | null): number => {
    return response?.duration || 0;
};

/**
 * Validate that the extracted answer matches the expected type
 * @param answer - The extracted answer
 * @param questionType - The expected question type
 * @returns True if the answer format is valid for the question type
 */
export const validateExtractedAnswer = (
    answer: QuizAnswerData | null,
    questionType: string
): boolean => {
    if (answer === null) return true; // No answer is always valid

    switch (questionType) {
        case "DESCRIPTIVE":
        case "CODING":
        case "FILE_UPLOAD":
            return typeof answer === "string";

        case "TRUE_FALSE":
        case "TRUEFALSE":
            return typeof answer === "boolean";

        case "MCQ":
            return typeof answer === "string";

        case "MMCQ":
            return Array.isArray(answer) && answer.every(item => typeof item === "string");

        case "FILL_UP":
            return Array.isArray(answer) && answer.every(item =>
                typeof item === "object" &&
                item !== null &&
                "id" in item &&
                "answer" in item
            );

        case "MATCH":
        case "MATCH_THE_FOLLOWING":
            return Array.isArray(answer) && answer.every(item =>
                typeof item === "object" &&
                item !== null &&
                "leftPairId" in item &&
                "rightPairId" in item
            );

        default:
            return false;
    }
};

/**
 * Process quiz start data and extract all existing responses
 * @param quizData - The complete quiz data from the start API
 * @returns Map of questionId to extracted answer data
 */
export const processQuizStartResponses = (quizData: QuizInterface): Map<string, {
    answer: QuizAnswerData;
    timeSpent: number;
}> => {
    const responses = new Map<string, {
        answer: QuizAnswerData;
        timeSpent: number;
    }>();

    if (!quizData.questions || !Array.isArray(quizData.questions)) {
        console.warn("Invalid quiz data structure");
        return responses;
    }

    quizData.questions.forEach((questionItem: QuizQuestion) => {
        try {
            const questionId = questionItem.question?.questions?.questionId;
            const questionType = questionItem.question?.type;
            const apiResponse = questionItem.response;

            if (!questionId || !questionType) {
                console.warn("Missing questionId or questionType:", questionItem);
                return;
            }

            if (!hasAnswerInResponse(apiResponse)) {
                // No existing answer for this question
                return;
            }

            const extractedAnswer = extractAnswerFromResponse(apiResponse, questionType);
            const timeSpent = getTimeSpentFromResponse(apiResponse);

            if (extractedAnswer !== null && validateExtractedAnswer(extractedAnswer, questionType)) {
                responses.set(questionId, {
                    answer: extractedAnswer,
                    timeSpent,
                });

                console.log(`Loaded existing answer for question ${questionId} (${questionType}):`, {
                    answer: extractedAnswer,
                    timeSpent,
                });
            } else {
                console.warn(`Invalid answer format for question ${questionId} (${questionType}):`, extractedAnswer);
            }
        } catch (error) {
            console.error("Error processing question response:", error, questionItem);
        }
    });

    return responses;
};

/**
 * Create a summary of loaded responses for logging
 * @param responses - Map of processed responses
 * @returns Summary object with statistics
 */
export const createResponseSummary = (responses: Map<string, {
    answer: QuizAnswerData;
    timeSpent: number;
}>): {
    totalResponses: number;
    totalTimeSpent: number;
    questionTypes: Record<string, number>;
} => {
    const summary = {
        totalResponses: responses.size,
        totalTimeSpent: 0,
        questionTypes: {} as Record<string, number>,
    };

    responses.forEach(({ timeSpent, answer }) => {
        summary.totalTimeSpent += timeSpent;

        // Determine answer type for statistics
        let answerType = "unknown";
        if (typeof answer === "string") answerType = "string";
        else if (typeof answer === "boolean") answerType = "boolean";
        else if (Array.isArray(answer)) {
            if (answer.length > 0 && typeof answer[0] === "string") answerType = "stringArray";
            else if (answer.length > 0 && typeof answer[0] === "object") {
                if ("id" in answer[0] && "answer" in answer[0]) answerType = "fillUp";
                else if ("leftPairId" in answer[0] && "rightPairId" in answer[0]) answerType = "match";
            }
        }

        summary.questionTypes[answerType] = (summary.questionTypes[answerType] || 0) + 1;
    });

    return summary;
};