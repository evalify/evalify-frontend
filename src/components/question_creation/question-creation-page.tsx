"use client";

import React from "react";
import QuestionTypeSelector, { QuestionType } from "./question-type-selector";
import QuestionEditor, { QuestionData } from "./question-editor";
import QuestionSettings from "./question-settings";
import ValidationErrorModal from "./validation-error-modal";
import { validateQuestionData, ValidationError } from "./validation";
import { useToast } from "@/hooks/use-toast";
import { questionsService } from "@/repo/question-queries/questions";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Bank from "@/repo/bank/bank";

interface QuestionBaseSettings {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  courseOutcome: string;
}

interface QuestionCreationSettings extends QuestionBaseSettings {
  topics: { value: string; label: string }[];
}

interface QuestionCreationPageProps {
  isEdit?: boolean;
  initialQuestionData?: QuestionData;
  initialQuestionSettings?: QuestionCreationSettings;
  questionId?: string;
  bankId?: string;
  selectedTopics?: string[];
}

const QuestionCreationPage: React.FC<QuestionCreationPageProps> = ({
  isEdit = false,
  initialQuestionData,
  initialQuestionSettings,
  questionId,
  bankId,
  selectedTopics: initialSelectedTopics = [],
}) => {
  // Initialize router and URL params for topic management
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize toast hook
  const { info, success, error } = useToast();

  // Fetch all available topics for the bank
  const { data: allTopics = [] } = useQuery({
    queryKey: ["bankTopics", bankId],
    queryFn: () => Bank.getBankTopics(bankId!),
    enabled: !!bankId,
  });

  // State for selected topics (from URL or initial props)
  const [selectedTopicIds, setSelectedTopicIds] = React.useState<string[]>(
    initialSelectedTopics,
  );

  // Sync selected topics with URL changes
  React.useEffect(() => {
    const topicsParam = searchParams.get("topics");
    const urlTopics = topicsParam ? topicsParam.split(",") : [];
    setSelectedTopicIds(urlTopics);
  }, [searchParams]);

  // Derive topics for QuestionSettings directly using useMemo
  const currentTopicsForSettings = React.useMemo(() => {
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
  }, [selectedTopicIds, allTopics]);

  // Update URL when selected topics change
  const updateTopicsInUrl = React.useCallback(
    (topicIds: string[]) => {
      const params = new URLSearchParams(searchParams);

      if (topicIds.length > 0) {
        params.set("topics", topicIds.join(","));
      } else {
        params.delete("topics");
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Initialize question type from initial data or default to "mcq"
  const [selectedType, setSelectedType] = React.useState<QuestionType>(
    initialQuestionData?.type || "mcq",
  );

  // Initialize question data from initial data or use defaults
  const [questionData, setQuestionData] = React.useState<QuestionData>(
    initialQuestionData || {
      type: "mcq",
      question: "",
      explanation: "",
      showExplanation: false,
      allowMultipleCorrect: false,
      options: [],
    },
  );

  // Initialize question settings from initial data or use defaults
  const [questionSettings, setQuestionSettings] =
    React.useState<QuestionBaseSettings>(() => {
      return initialQuestionSettings
        ? {
            marks: initialQuestionSettings.marks,
            difficulty: initialQuestionSettings.difficulty,
            bloomsTaxonomy: initialQuestionSettings.bloomsTaxonomy,
            courseOutcome: initialQuestionSettings.courseOutcome,
          }
        : {
            marks: 1,
            difficulty: "medium",
            bloomsTaxonomy: "",
            courseOutcome: "",
          };
    });

  // Store initial state for change tracking
  const initialStateRef = React.useRef({
    type: selectedType,
    data: questionData,
    settings: {
      ...questionSettings,
      topics: currentTopicsForSettings, // Include derived topics for initial state tracking
    },
  });

  // Update initial state when props change
  React.useEffect(() => {
    if (isEdit && initialQuestionData && initialQuestionSettings) {
      const newInitialState = {
        type: initialQuestionData.type,
        data: initialQuestionData,
        settings: {
          marks: initialQuestionSettings.marks,
          difficulty: initialQuestionSettings.difficulty,
          bloomsTaxonomy: initialQuestionSettings.bloomsTaxonomy,
          courseOutcome: initialQuestionSettings.courseOutcome,
          topics: initialQuestionSettings.topics,
        },
      };
      initialStateRef.current = newInitialState;
      setSelectedType(initialQuestionData.type);
      setQuestionData(initialQuestionData);
      setQuestionSettings({
        marks: initialQuestionSettings.marks,
        difficulty: initialQuestionSettings.difficulty,
        bloomsTaxonomy: initialQuestionSettings.bloomsTaxonomy,
        courseOutcome: initialQuestionSettings.courseOutcome,
      });
      setSelectedTopicIds(initialQuestionSettings.topics.map((t) => t.value));
    }
  }, [isEdit, initialQuestionData, initialQuestionSettings]);

  // Track if there are changes
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

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationError[]
  >([]);
  const [showValidationModal, setShowValidationModal] = React.useState(false); // Handle question type change
  const handleTypeSelect = (type: QuestionType) => {
    if (isEdit) {
      // In edit mode, don't allow type changes
      return;
    }
    setSelectedType(type);

    // Reset question data to default for the new type
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
          timeLimit: 30,
          memoryLimit: 256,
          functionName: "",
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

  // Handle preview
  const handlePreview = () => {
    console.log("Preview question:", {
      type: selectedType,
      data: questionData,
      settings: {
        ...questionSettings,
        topics: currentTopicsForSettings,
      },
    });
    // Show info toast instead of alert
    info("Preview functionality will be implemented soon!");
  };

  const resetForm = () => {
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
    setSelectedTopicIds([]); // Reset selected topic IDs
    setValidationErrors([]);
    setShowValidationModal(false);
  };
  // Handle save
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    // Comprehensive validation using the validation system
    const validationResult = validateQuestionData(
      questionData,
      questionSettings.marks,
    );

    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      setShowValidationModal(true);
      return;
    }

    if (!bankId) {
      error("Bank ID is required", {
        description: "Cannot save question without a valid bank ID",
      });
      return;
    }

    setIsLoading(true);

    try {
      let response;

      const questionToSave = {
        type: selectedType,
        data: questionData,
        settings: {
          ...questionSettings,
          topics: currentTopicsForSettings, // Ensure topics are included in saved data
        },
      };

      if (isEdit && questionId) {
        // Update existing question
        response = await questionsService.updateQuestion(
          questionId,
          questionToSave,
          bankId,
        );

        console.log("Question updated successfully:", response);

        // Show success toast
        success("Question updated successfully!", {
          description: `Question ID: ${response.id}`,
        });

        // Update initial state ref to reflect the new saved state
        initialStateRef.current = questionToSave;
      } else {
        // Create new question
        response = await questionsService.createQuestion(
          questionToSave,
          bankId,
        );

        console.log("Question saved successfully:", response);

        // Show success toast
        success("Question saved successfully!", {
          description: `Question ID: ${response.id}`,
        });

        // Reset the form after successful save (only for create mode)
        resetForm();
      }
    } catch (err) {
      console.error(`Error ${isEdit ? "updating" : "saving"} question:`, err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to ${isEdit ? "update" : "save"} question. Please try again.`;

      error(`Failed to ${isEdit ? "update" : "save"} question`, {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle validation modal close
  const handleValidationModalClose = () => {
    setShowValidationModal(false);
    setValidationErrors([]);
  };

  // Handle settings changes
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
    // This will update selectedTopicIds, which then causes currentTopicsForSettings to re-memoize.
    // QuestionSettings will then re-render with the new currentTopicsForSettings.
    setSelectedTopicIds(topicIds);
    updateTopicsInUrl(topicIds);
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <QuestionTypeSelector
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
        onPreview={handlePreview}
        onSave={handleSave}
        isLoading={isLoading}
        isEdit={isEdit}
        hasChanges={hasChanges}
      />

      {/* Main Content Area - Two Column Layout */}
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Question Editor - Left Column (Full width on mobile, 2/3 on desktop) */}
        <div className="flex-1 lg:w-2/3 order-1 lg:order-1">
          <div className="p-4 lg:p-6 bg-background h-full">
            <QuestionEditor
              questionType={selectedType}
              questionData={questionData}
              onQuestionDataChange={setQuestionData}
            />
          </div>
        </div>

        {/* Question Settings - Right Column (Full width on mobile, 1/3 on desktop) */}
        <div className="lg:w-1/3 order-2 lg:order-2 lg:border-l bg-background">
          <QuestionSettings
            marks={questionSettings.marks}
            difficulty={questionSettings.difficulty}
            bloomsTaxonomy={questionSettings.bloomsTaxonomy}
            courseOutcome={questionSettings.courseOutcome}
            topics={currentTopicsForSettings}
            availableTopics={allTopics.map((topic) => ({
              value: topic.id,
              label: topic.name,
            }))}
            onMarksChange={handleMarksChange}
            onDifficultyChange={handleDifficultyChange}
            onBloomsTaxonomyChange={handleBloomsTaxonomyChange}
            onCourseOutcomeChange={handleCourseOutcomeChange}
            onTopicsChange={handleTopicsChange}
          />
        </div>
      </div>

      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationModal}
        onClose={handleValidationModalClose}
        errors={validationErrors}
        questionType={selectedType}
      />
    </div>
  );
};

export default QuestionCreationPage;
