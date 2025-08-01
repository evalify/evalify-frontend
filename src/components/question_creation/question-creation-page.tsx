"use client";

import React from "react";
import QuestionTypeSelector, { QuestionType } from "./question-type-selector";
import QuestionEditor, { QuestionData } from "./question-editor";
import QuestionSettings from "./question-settings";
import ValidationErrorModal from "./validation-error-modal";
import { validateQuestionData, ValidationError } from "./validation";
import { useToast } from "@/hooks/use-toast";
import {
  questionsService,
  CreateQuestionRequest,
} from "@/repo/question-queries/questions";
import Quiz from "@/repo/quiz/quiz";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Bank from "@/repo/bank/bank";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
interface BaseQuizQuestionDTO {
  type: string;
  question: string;
  topicIds: string[];
  explanation: string | null;
  hint: string | null;
  marks: number;
  bloomsTaxonomy: string;
  co: number;
  negativeMark: number | null;
  difficulty: string;
  sectionId: string;
}

interface MCQQuizQuestionDTO extends BaseQuizQuestionDTO {
  type: "MCQ" | "MMCQ";
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

interface TrueFalseQuizQuestionDTO extends BaseQuizQuestionDTO {
  type: "TRUEFALSE";
  answers: boolean | null;
}

interface FillupQuizQuestionDTO extends BaseQuizQuestionDTO {
  type: "FILL_UP";
  strictMatch: boolean;
  llmEval: boolean;
  template: string;
  blanks: Array<{
    id: string;
    answers: string[];
    position: number;
  }>;
}

interface DescriptiveQuizQuestionDTO extends BaseQuizQuestionDTO {
  type: "DESCRIPTIVE";
  expectedAnswer: string | null;
  strictness: number;
  guidelines: string | null;
}

interface CodingQuizQuestionDTO extends BaseQuizQuestionDTO {
  type: "CODING";
  driverCode: string | null;
  boilerCode: string | null;
  functionName: null;
  returnType: null;
  params: null;
  testcases: Array<{
    code: string;
    tags: string;
    isMinimal: boolean;
    language: string;
  }>;
  language: string[];
  answer: null;
}

interface MatchFollowingQuizQuestionDTO extends BaseQuizQuestionDTO {
  type: "MATCH_THE_FOLLOWING";
  keys: Array<{
    leftPair: {
      text: string;
    };
    rightPair: {
      text: string;
    };
  }>;
}

interface FileUploadQuizQuestionDTO extends BaseQuizQuestionDTO {
  type: "FILE_UPLOAD";
}

type QuizQuestionDTO =
  | MCQQuizQuestionDTO
  | TrueFalseQuizQuestionDTO
  | FillupQuizQuestionDTO
  | DescriptiveQuizQuestionDTO
  | CodingQuizQuestionDTO
  | MatchFollowingQuizQuestionDTO
  | FileUploadQuizQuestionDTO;

interface QuestionBaseSettings {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  courseOutcome: string;
}

interface QuestionCreationSettings extends QuestionBaseSettings {
  topics: { value: string; label: string }[];
}

export interface QuestionCreationConfig {
  isQuiz?: boolean;
  quizId?: string;
  sectionId?: string;
  courseId?: string;
}

interface QuestionCreationPageProps {
  isEdit?: boolean;
  initialQuestionData?: QuestionData;
  initialQuestionSettings?: QuestionCreationSettings;
  questionId?: string;
  bankId?: string;
  selectedTopics?: string[];
  config?: QuestionCreationConfig;
}

const QuestionCreationPage: React.FC<QuestionCreationPageProps> = ({
  isEdit = false,
  initialQuestionData,
  initialQuestionSettings,
  questionId,
  bankId,
  selectedTopics: initialSelectedTopics = [],
  config = { isQuiz: false },
}) => {
  // Initialize router and URL params for topic management
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize toast hook
  const { success, error } = useToast();

  const routes = React.useMemo(() => {
    if (config.isQuiz) {
      return {
        create: (questionData: CreateQuestionRequest) => {
          const transformedData = transformQuestionForQuiz(
            questionData,
            config.sectionId!,
          );
          return Quiz.createQuizQuestion(config.quizId!, transformedData);
        },
        update: (questionData: CreateQuestionRequest) => {
          const transformedData = transformQuestionForQuiz(
            questionData,
            config.sectionId!,
          );
          return Quiz.updateQuizQuestion(
            config.quizId!,
            questionId!,
            transformedData,
          );
        },
        delete: () => Quiz.deleteQuizQuestion(config.quizId!, questionId!),
        getTopics: () => Promise.resolve([]),
      };
    } else {
      return {
        create: (questionData: CreateQuestionRequest) =>
          questionsService.createQuestion(questionData, bankId!),
        update: (questionData: CreateQuestionRequest) =>
          questionsService.updateQuestion(questionId!, questionData, bankId!),
        delete: () => questionsService.deleteQuestion(questionId!, bankId!),
        getTopics: () => Bank.getBankTopics(bankId!),
      };
    }
  }, [config.isQuiz, config.quizId, config.sectionId, questionId, bankId]);

  const transformQuestionForQuiz = (
    questionData: CreateQuestionRequest,
    sectionId: string,
  ): QuizQuestionDTO => {
    const { type, data, settings } = questionData;

    const topicIds: string[] = [];

    const co = parseInt(settings.courseOutcome.replace(/^co/i, "")) || 0;

    const difficultyMap: Record<string, string> = {
      easy: "EASY",
      medium: "MEDIUM",
      hard: "HARD",
    };

    const taxonomyMap: Record<string, string> = {
      remember: "REMEMBER",
      understand: "UNDERSTAND",
      apply: "APPLY",
      analyze: "ANALYZE",
      evaluate: "EVALUATE",
      create: "CREATE",
    };

    const baseDTO: BaseQuizQuestionDTO = {
      type: type.toUpperCase().replace("-", "_"),
      question: data.question,
      topicIds,
      explanation: data.explanation || null,
      hint: "hint" in data ? (data.hint as string) || null : null,
      marks: settings.marks,
      bloomsTaxonomy: taxonomyMap[settings.bloomsTaxonomy] || "UNDERSTAND",
      co,
      negativeMark: null,
      difficulty: difficultyMap[settings.difficulty] || "MEDIUM",
      sectionId,
    };

    switch (data.type) {
      case "mcq":
        return {
          ...baseDTO,
          type: data.allowMultipleCorrect ? "MMCQ" : "MCQ",
          options: data.options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        } as MCQQuizQuestionDTO;

      case "true-false":
        return {
          ...baseDTO,
          type: "TRUEFALSE",
          answers: data.correctAnswer,
        } as TrueFalseQuizQuestionDTO;

      case "fillup":
        return {
          ...baseDTO,
          type: "FILL_UP",
          strictMatch: data.strictMatch || false,
          llmEval: data.useHybridEvaluation || false,
          template: data.question,
          blanks: data.blanks.map((blank) => ({
            id: blank.id,
            answers: blank.acceptedAnswers || [],
            position: blank.position || 0,
          })),
        } as FillupQuizQuestionDTO;

      case "descriptive":
        return {
          ...baseDTO,
          type: "DESCRIPTIVE",
          expectedAnswer: data.sampleAnswer || null,
          strictness: 0.7,
          guidelines: data.gradingCriteria || null,
        } as DescriptiveQuizQuestionDTO;

      case "coding":
        return {
          ...baseDTO,
          type: "CODING",
          driverCode: data.driverCode || null,
          boilerCode: data.starterCode || null,
          functionName: null,
          returnType: null,
          params: null,
          testcases: data.testCases.map((tc) => ({
            code: tc.code,
            tags: tc.tags,
            isMinimal: tc.isMinimal || false,
            language: tc.language,
          })),
          language: data.languages || (data.language ? [data.language] : []),
          answer: null,
        } as CodingQuizQuestionDTO;

      case "match-following":
        return {
          ...baseDTO,
          type: "MATCH_THE_FOLLOWING",
          keys: data.matchItems.map((item) => ({
            leftPair: {
              text: item.leftPair.text,
            },
            rightPair: {
              text: item.rightPair.text,
            },
          })),
        } as MatchFollowingQuizQuestionDTO;

      case "file-upload":
        return {
          ...baseDTO,
          type: "FILE_UPLOAD",
        } as FileUploadQuizQuestionDTO;

      default:
        return {
          ...baseDTO,
          type: "MCQ",
          options: [],
        } as MCQQuizQuestionDTO;
    }
  };

  const { data: allTopics = [] } = useQuery({
    queryKey: config.isQuiz ? ["bankTopics", bankId] : ["bankTopics", bankId],
    queryFn: routes.getTopics,
    enabled: !!bankId && !config.isQuiz,
  });

  // Fetch question details for edit mode
  const {
    data: editQuestionData,
    isLoading: isLoadingQuestion,
    error: questionError,
  } = useQuery({
    queryKey: config.isQuiz
      ? ["quizQuestionDetails", config.quizId, questionId]
      : ["questionDetails", questionId],
    queryFn: async () => {
      if (config.isQuiz && config.quizId) {
        const quizQuestion = await Quiz.getQuizQuestionById(
          config.quizId,
          questionId!,
        );
        return questionsService.transformBankQuestionToEdit(quizQuestion);
      } else {
        return questionsService.getQuestionForEdit(questionId!);
      }
    },
    enabled: isEdit && !!questionId && (config.isQuiz ? !!config.quizId : true),
    retry: 1,
  });

  React.useEffect(() => {
    if (questionError) {
      error("Failed to load question details", {
        description:
          questionError instanceof Error
            ? questionError.message
            : "Unknown error occurred",
      });
    }
  }, [questionError, error]);

  const resetForm = React.useCallback(() => {
    setSelectedType("mcq");
    setQuestionData({
      type: "mcq",
      question: "",
      explanation: "",
      showExplanation: false,
      allowMultipleCorrect: false,
      options: [],
    });
    setQuestionSettings({
      marks: 1,
      difficulty: "medium",
      bloomsTaxonomy: "",
      courseOutcome: "",
    });
    setSelectedTopicIds([]);
    setValidationErrors([]);
    setShowValidationModal(false);
  }, []);

  const createQuestionMutation = useMutation({
    mutationFn: async (questionToSave: CreateQuestionRequest) => {
      return await routes.create(questionToSave);
    },
    onSuccess: (response) => {
      console.log("Question saved successfully:", response);
      success("Question saved successfully!");
      resetForm();
    },
    onError: (err) => {
      console.error("Error saving question:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save question. Please try again.";
      error("Failed to save question", {
        description: errorMessage,
      });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async (questionToSave: CreateQuestionRequest) => {
      return await routes.update(questionToSave);
    },
    onSuccess: (response) => {
      console.log("Question updated successfully:", response);
      success("Question updated successfully!");
      const questionToSave = {
        type: selectedType,
        data: questionData,
        settings: {
          ...questionSettings,
          topics: currentTopicsForSettings,
        },
      };
      initialStateRef.current = questionToSave;
    },
    onError: (err) => {
      console.error("Error updating question:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update question. Please try again.";
      error("Failed to update question", {
        description: errorMessage,
      });
    },
  });

  const [selectedTopicIds, setSelectedTopicIds] = React.useState<string[]>(
    config.isQuiz ? [] : initialSelectedTopics,
  );

  React.useEffect(() => {
    if (!config.isQuiz) {
      const topicsParam = searchParams.get("topics");
      const urlTopics = topicsParam ? topicsParam.split(",") : [];
      setSelectedTopicIds(urlTopics);
    }
  }, [searchParams, config.isQuiz]);

  const currentTopicsForSettings = React.useMemo(() => {
    if (config.isQuiz) {
      return [];
    }

    if (editQuestionData?.questionSettings?.topics) {
      return editQuestionData.questionSettings.topics;
    }

    if (!allTopics.length || !selectedTopicIds.length) {
      return [];
    }
    return selectedTopicIds
      .map((topicId) => {
        const topic = allTopics.find((t) => t.id === topicId);
        return {
          value: topicId,
          label: topic?.name || topicId,
        };
      })
      .filter((topic) => topic.label !== topic.value);
  }, [
    selectedTopicIds,
    allTopics,
    editQuestionData?.questionSettings?.topics,
    config.isQuiz,
  ]);

  const updateTopicsInUrl = React.useCallback(
    (topicIds: string[]) => {
      if (config.isQuiz) return;

      const params = new URLSearchParams(searchParams);

      if (topicIds.length > 0) {
        params.set("topics", topicIds.join(","));
      } else {
        params.delete("topics");
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, config.isQuiz],
  );

  const [selectedType, setSelectedType] = React.useState<QuestionType>(
    editQuestionData?.questionData?.type || initialQuestionData?.type || "mcq",
  );

  const [questionData, setQuestionData] = React.useState<QuestionData>(
    editQuestionData?.questionData ||
      initialQuestionData || {
        type: "mcq",
        question: "",
        explanation: "",
        showExplanation: false,
        allowMultipleCorrect: false,
        options: [],
      },
  );

  const [questionSettings, setQuestionSettings] =
    React.useState<QuestionBaseSettings>(() => {
      const sourceSettings =
        editQuestionData?.questionSettings || initialQuestionSettings;
      return sourceSettings
        ? {
            marks: sourceSettings.marks,
            difficulty: sourceSettings.difficulty,
            bloomsTaxonomy: sourceSettings.bloomsTaxonomy,
            courseOutcome: sourceSettings.courseOutcome,
          }
        : {
            marks: 1,
            difficulty: "medium",
            bloomsTaxonomy: "",
            courseOutcome: "",
          };
    });

  const initialStateRef = React.useRef({
    type: selectedType,
    data: questionData,
    settings: {
      ...questionSettings,
      topics: currentTopicsForSettings,
    },
  });

  React.useEffect(() => {
    const sourceQuestionData =
      editQuestionData?.questionData || initialQuestionData;
    const sourceQuestionSettings =
      editQuestionData?.questionSettings || initialQuestionSettings;

    if (isEdit && sourceQuestionData && sourceQuestionSettings) {
      const newInitialState = {
        type: sourceQuestionData.type,
        data: sourceQuestionData,
        settings: {
          marks: sourceQuestionSettings.marks,
          difficulty: sourceQuestionSettings.difficulty,
          bloomsTaxonomy: sourceQuestionSettings.bloomsTaxonomy,
          courseOutcome: sourceQuestionSettings.courseOutcome,
          topics: sourceQuestionSettings.topics,
        },
      };
      initialStateRef.current = newInitialState;
      setSelectedType(sourceQuestionData.type);
      setQuestionData(sourceQuestionData);
      setQuestionSettings({
        marks: sourceQuestionSettings.marks,
        difficulty: sourceQuestionSettings.difficulty,
        bloomsTaxonomy: sourceQuestionSettings.bloomsTaxonomy,
        courseOutcome: sourceQuestionSettings.courseOutcome,
      });
      if (!config.isQuiz) {
        setSelectedTopicIds(sourceQuestionSettings.topics.map((t) => t.value));
      }
    }
  }, [
    isEdit,
    editQuestionData,
    initialQuestionData,
    initialQuestionSettings,
    config.isQuiz,
  ]);

  const hasChanges = React.useMemo(() => {
    if (!isEdit) return false;

    const current = {
      type: selectedType,
      data: questionData,
      settings: {
        ...questionSettings,
        topics: currentTopicsForSettings,
      },
    };

    return JSON.stringify(current) !== JSON.stringify(initialStateRef.current);
  }, [
    isEdit,
    selectedType,
    questionData,
    questionSettings,
    currentTopicsForSettings,
  ]);

  const [validationErrors, setValidationErrors] = React.useState<
    ValidationError[]
  >([]);
  const [showValidationModal, setShowValidationModal] = React.useState(false);
  const handleTypeSelect = (type: QuestionType) => {
    if (isEdit) {
      return;
    }
    setSelectedType(type);
    const baseData = {
      question: "",
      explanation: "",
      showExplanation: false,
    };

    let newQuestionData: QuestionData;

    switch (type) {
      case "mcq":
        newQuestionData = {
          ...baseData,
          type: "mcq",
          allowMultipleCorrect: false,
          options: [],
        };
        break;
      case "fillup":
        newQuestionData = {
          ...baseData,
          type: "fillup",
          blanks: [],
          strictMatch: false,
          useHybridEvaluation: false,
        };
        break;
      case "match-following":
        newQuestionData = {
          ...baseData,
          type: "match-following",
          matchItems: [],
        };
        break;
      case "descriptive":
        newQuestionData = {
          ...baseData,
          type: "descriptive",
          sampleAnswer: "",
          wordLimit: 500,
          gradingCriteria: "",
        };
        break;
      case "true-false":
        newQuestionData = {
          ...baseData,
          type: "true-false",
          correctAnswer: null,
        };
        break;
      case "coding":
        newQuestionData = {
          ...baseData,
          type: "coding",
          language: "",
          starterCode: "",
          testCases: [],
        };
        break;
      case "file-upload":
        newQuestionData = {
          ...baseData,
          type: "file-upload",
          allowedFileTypes: [],
          maxFileSize: 10,
          maxFiles: 1,
        };
        break;
      default:
        newQuestionData = {
          ...baseData,
          type: "mcq",
          allowMultipleCorrect: false,
          options: [],
        };
    }

    setQuestionData(newQuestionData);
  };

  const handleSaveAndBack = async () => {
    const success = await handleSave();
    if (success) {
      if (config.isQuiz && config.quizId && config.courseId) {
        router.push(`/course/${config.courseId}/quiz/${config.quizId}/view`);
      } else {
        router.push(`/question-bank/${bankId}`);
      }
    }
  };

  const handleSave = async (): Promise<boolean> => {
    const validationResult = validateQuestionData(
      questionData,
      questionSettings.marks,
    );

    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      setShowValidationModal(true);
      return false;
    }

    if (!config.isQuiz && !bankId) {
      error("Bank ID is required", {
        description: "Cannot save question without a valid bank ID",
      });
      return false;
    }

    const questionToSave = {
      type: selectedType,
      data: questionData,
      settings: {
        ...questionSettings,
        topics: currentTopicsForSettings,
      },
    };

    try {
      if (isEdit && questionId) {
        await updateQuestionMutation.mutateAsync(questionToSave);
      } else {
        await createQuestionMutation.mutateAsync(questionToSave);
      }
      return true;
    } catch (err) {
      console.error("Error saving question:", err);
      return false;
    }
  };

  const handleValidationModalClose = () => {
    setShowValidationModal(false);
    setValidationErrors([]);
  };

  const handleMarksChange = (marks: number) => {
    setQuestionSettings((prev) => ({ ...prev, marks }));
  };
  const handleDifficultyChange = (difficulty: string) => {
    setQuestionSettings((prev) => ({ ...prev, difficulty }));
  };

  const handleBloomsTaxonomyChange = (bloomsTaxonomy: string) => {
    setQuestionSettings((prev) => ({ ...prev, bloomsTaxonomy }));
  };

  const handleCourseOutcomeChange = (courseOutcome: string) => {
    setQuestionSettings((prev) => ({ ...prev, courseOutcome }));
  };

  const handleTopicsChange = (topicIds: string[]) => {
    if (config.isQuiz) return;

    setSelectedTopicIds(topicIds);
    updateTopicsInUrl(topicIds);
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isEdit && questionError && !isLoadingQuestion && (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-6 max-w-md">
            <CardContent className="text-center space-y-4">
              <div className="text-destructive text-xl">⚠️</div>
              <h3 className="text-lg font-semibold">Failed to Load Question</h3>
              <p className="text-muted-foreground">
                {questionError instanceof Error
                  ? questionError.message
                  : "Unable to load question details"}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                >
                  Go Back
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isEdit && isLoadingQuestion && (
        <div className="min-h-screen flex flex-col bg-background">
          <div className="border-b bg-background p-4">
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="flex-grow flex flex-col lg:flex-row">
            <div className="flex-1 lg:w-2/3 order-1 lg:order-1">
              <div className="p-4 lg:p-6 bg-background h-full space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 order-2 lg:order-2 lg:border-l bg-background">
              <Card className="m-4">
                <CardContent className="p-4 space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {(!isEdit || (!isLoadingQuestion && !questionError)) && (
        <>
          <QuestionTypeSelector
            selectedType={selectedType}
            onTypeSelect={handleTypeSelect}
            onSaveAndBack={handleSaveAndBack}
            onSave={handleSave}
            isLoading={
              createQuestionMutation.isPending ||
              updateQuestionMutation.isPending
            }
            isEdit={isEdit}
            hasChanges={hasChanges}
          />

          <div className="flex-grow flex flex-col lg:flex-row">
            <div className="flex-1 lg:w-2/3 order-1 lg:order-1">
              <div className="p-4 lg:p-6 bg-background h-full">
                <QuestionEditor
                  questionType={selectedType}
                  questionData={questionData}
                  onQuestionDataChange={setQuestionData}
                />
              </div>
            </div>

            <div className="lg:w-1/3 order-2 lg:order-2 lg:border-l bg-background">
              <QuestionSettings
                marks={questionSettings.marks}
                difficulty={questionSettings.difficulty}
                bloomsTaxonomy={questionSettings.bloomsTaxonomy}
                courseOutcome={questionSettings.courseOutcome}
                topics={currentTopicsForSettings}
                availableTopics={
                  config.isQuiz
                    ? []
                    : allTopics.map((topic) => ({
                        value: topic.id,
                        label: topic.name,
                      }))
                }
                onMarksChange={handleMarksChange}
                onDifficultyChange={handleDifficultyChange}
                onBloomsTaxonomyChange={handleBloomsTaxonomyChange}
                onCourseOutcomeChange={handleCourseOutcomeChange}
                onTopicsChange={handleTopicsChange}
              />
            </div>
          </div>

          <ValidationErrorModal
            isOpen={showValidationModal}
            onClose={handleValidationModalClose}
            errors={validationErrors}
            questionType={selectedType}
          />
        </>
      )}
    </div>
  );
};

export default QuestionCreationPage;
