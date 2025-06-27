import { QuestionData } from "./question-editor";

interface QuestionCreationSettings {
    marks: number;
    difficulty: string;
    bloomsTaxonomy: string;
    courseOutcome: string;
    topics: { value: string; label: string }[];
}

export const transformQuestionDataForAPI = (
    questionData: QuestionData,
    settings: QuestionCreationSettings
) => {
    const basePayload = {
        question: questionData.question,
        topicIds: settings.topics.map(topic => topic.value),
        marks: settings.marks,
        bloomsTaxonomy: settings.bloomsTaxonomy.toUpperCase(),
        co: parseInt(settings.courseOutcome) || 1,
        difficulty: settings.difficulty.toUpperCase(),
    };

    switch (questionData.type) {
        case "mcq":
            return {
                ...basePayload,
                type: "MCQ",
                explanation: questionData.explanation,
                hint: "",
                negativeMark: 0,
                options: questionData.options.map(option => ({
                    text: option.text,
                    isCorrect: option.isCorrect
                }))
            };

        case "fillup":
            return {
                ...basePayload,
                type: "FILL_UP",
                blanks: questionData.blanks.map((blank, index) => ({
                    id: (index + 1).toString(),
                    answers: blank.acceptedAnswers
                })),
                template: questionData.question.replace(/\s*_{3}\s*/g, " __ "),
                strictMatch: questionData.strictMatch || false
            };

        case "descriptive":
            return {
                ...basePayload,
                type: "DESCRIPTIVE",
                expectedAnswer: questionData.sampleAnswer || "",
                strictness: 0.8,
                guidelines: questionData.gradingCriteria || ""
            };

        case "match-following":
            return {
                ...basePayload,
                type: "MATCH_THE_FOLLOWING",
                keys: questionData.matchItems.map((item, index) => ({
                    id: (index + 1).toString(),
                    leftPair: item.leftText,
                    rightPair: item.rightText
                }))
            };

        case "coding":
            return {
                ...basePayload,
                type: "CODING",
                driverCode: "",
                boilerCode: questionData.starterCode || "",
                functionName: questionData.functionMetadata?.name || "",
                returnType: questionData.functionMetadata?.returnType || "int",
                params: questionData.functionMetadata?.parameters.map(param => ({
                    param: param.name,
                    type: param.type
                })) || [],
                testcases: questionData.testCases.map(testCase => ({
                    input: Object.values(testCase.inputs),
                    expected: testCase.expectedOutput
                })),
                language: [questionData.language],
                strictMatch: true,
                llmEval: questionData.useHybridEvaluation || false
            };

        case "true-false":
            return {
                ...basePayload,
                type: "MCQ",
                explanation: questionData.explanation,
                hint: "",
                negativeMark: 0,
                options: [
                    { text: "True", isCorrect: questionData.correctAnswer === true },
                    { text: "False", isCorrect: questionData.correctAnswer === false }
                ]
            };

        case "file-upload":
            return {
                ...basePayload,
                type: "DESCRIPTIVE",
                expectedAnswer: "File upload submission",
                strictness: 1.0,
                guidelines: `Allowed file types: ${questionData.allowedFileTypes.join(', ')}. Max file size: ${questionData.maxFileSize}MB. Max files: ${questionData.maxFiles}`
            };

        default:
            throw new Error(`Unsupported question type: ${(questionData as any).type || "unknown"}`);
    }
};
