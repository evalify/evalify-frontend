"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, Calculator } from "lucide-react";
import { QuizMetadata } from "./quiz-metadata";
import { ScoringMethod } from "./scoring-method";
import { format, differenceInMinutes } from "date-fns";

// Define the data structure for each component
type QuizCreationData = {
  metadata: {
    title: string;
    description: string;
    instructions: string;
    duration: {
      value: number;
      unit: "Minutes" | "Hours";
    };
    startDateTime: {
      date: Date | undefined;
      time: string;
    };
    endDateTime: {
      date: Date | undefined;
      time: string;
    };
    tags: string[];
    questionBreakdown: {
      easy: number;
      medium: number;
      hard: number;
      totalMarks: number;
    };
    settings: {
      passwordProtected: boolean;
      password: string;
      autoSubmit: boolean;
      calculatorAccess: boolean;
      allowTabSwitching: boolean;
      fullScreen: boolean;
      shuffleQuestions: boolean;
      shuffleOptions: boolean;
      randomizeQuestions: boolean;
      linearQuiz: boolean;
      publishResult: boolean;
      publishQuiz: boolean;
    };
  };
  scoring: {
    method?: "Standard" | "Weighted";
    pointsPerQuestion?: number;
    penalizeWrongAnswers?: boolean;
    penaltyAmount?: number;
  };
};

const tabs = [
  {
    id: "metadata",
    label: "Quiz Details",
    icon: FileText,
    description: "Basic quiz information and settings",
  },
  {
    id: "scoring",
    label: "Scoring Method",
    icon: Calculator,
    description: "Configure how the quiz will be scored",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function QuizCreationTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabId) || "metadata";
  const { error, success } = useToast();

  // Initialize quiz data with default values
  const [quizData, setQuizData] = useState<QuizCreationData>({
    metadata: {
      title: "",
      description: "",
      instructions: "",
      duration: {
        value: 60,
        unit: "Minutes",
      },
      startDateTime: {
        date: undefined,
        time: "",
      },
      endDateTime: {
        date: undefined,
        time: "",
      },
      tags: [],
      questionBreakdown: {
        easy: 0,
        medium: 0,
        hard: 0,
        totalMarks: 0,
      },
      settings: {
        passwordProtected: false,
        password: "",
        autoSubmit: false,
        calculatorAccess: false,
        allowTabSwitching: true,
        fullScreen: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        randomizeQuestions: false,
        linearQuiz: false,
        publishResult: false,
        publishQuiz: false,
      },
    },
    scoring: {
      method: "Standard",
      pointsPerQuestion: 1,
      penalizeWrongAnswers: false,
      penaltyAmount: 0,
    },
  });

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Update specific section data
  const updateMetadata = (data: QuizCreationData["metadata"]) => {
    setQuizData((prev) => ({ ...prev, metadata: data }));
  };

  const updateScoring = (data: QuizCreationData["scoring"]) => {
    setQuizData((prev) => ({ ...prev, scoring: data }));
  };

  // Validation helper functions
  const validateQuizData = () => {
    const validationErrors: string[] = [];
    const { metadata } = quizData;

    // Check required fields
    if (!metadata.title.trim()) {
      validationErrors.push("Quiz title is required");
    }

    if (!metadata.startDateTime.date) {
      validationErrors.push("Start date is required");
    }

    if (!metadata.startDateTime.time) {
      validationErrors.push("Start time is required");
    }

    if (!metadata.endDateTime.date) {
      validationErrors.push("End date is required");
    }

    if (!metadata.endDateTime.time) {
      validationErrors.push("End time is required");
    }

    if (!metadata.duration.value || metadata.duration.value <= 0) {
      validationErrors.push("Duration must be greater than 0");
    }

    // If we have all date/time fields, validate them
    if (
      metadata.startDateTime.date &&
      metadata.startDateTime.time &&
      metadata.endDateTime.date &&
      metadata.endDateTime.time &&
      metadata.duration.value > 0
    ) {
      try {
        // Create full datetime objects
        const startDateTime = new Date(
          `${format(metadata.startDateTime.date, "yyyy-MM-dd")}T${metadata.startDateTime.time}`,
        );
        const endDateTime = new Date(
          `${format(metadata.endDateTime.date, "yyyy-MM-dd")}T${metadata.endDateTime.time}`,
        );

        // Check if end time is after start time
        if (endDateTime <= startDateTime) {
          validationErrors.push("End time must be after start time");
        }

        // Calculate actual duration between start and end
        const actualDurationMinutes = differenceInMinutes(
          endDateTime,
          startDateTime,
        );

        // Convert specified duration to minutes
        const specifiedDurationMinutes =
          metadata.duration.unit === "Hours"
            ? metadata.duration.value * 60
            : metadata.duration.value;

        // Check if the time window is sufficient for the quiz duration
        if (actualDurationMinutes < specifiedDurationMinutes) {
          validationErrors.push(
            `Time window (${actualDurationMinutes} minutes) is shorter than quiz duration (${specifiedDurationMinutes} minutes)`,
          );
        }

        // Optional: Check if start time is in the past (uncomment if needed)
        const now = new Date();
        if (startDateTime < now) {
          validationErrors.push("Start time cannot be in the past");
        }
      } catch (error) {
        validationErrors.push("Invalid date or time format");
        console.error("Date validation error:", error);
      }
    }

    return validationErrors;
  };

  // Save quiz data with validation
  const handleSave = () => {
    const validationErrors = validateQuizData();

    if (validationErrors.length > 0) {
      // Show validation errors using sonner toast
      const errorMessage =
        validationErrors.length === 1
          ? validationErrors[0]
          : `Please fix ${validationErrors.length} validation errors:`;

      error(errorMessage, {
        description:
          validationErrors.length > 1
            ? validationErrors.join(" • ")
            : undefined,
        duration: 6000,
      });
      return;
    }

    // Additional validation for randomize questions
    if (quizData.metadata.settings.randomizeQuestions) {
      const { easy, medium, hard, totalMarks } =
        quizData.metadata.questionBreakdown;
      const totalQuestions = easy + medium + hard;

      if (totalQuestions === 0) {
        error(
          "When randomize questions is enabled, you must specify at least one question in the breakdown.",
          {
            duration: 5000,
          },
        );
        return;
      }

      if (totalMarks <= 0) {
        error(
          "Total marks must be greater than 0 when randomize questions is enabled.",
          {
            duration: 5000,
          },
        );
        return;
      }
    }

    // If validation passes, save the data
    try {
      // Here you would typically save to an API
      console.log("Saving quiz data:", quizData);

      success("Quiz saved successfully!", {
        description: `"${quizData.metadata.title}" has been saved with all your settings.`,
        duration: 4000,
      });
    } catch {
      error("Failed to save quiz. Please try again.", {
        description: "There was an error saving your quiz data.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Quiz
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Set up your quiz by configuring the details, scoring method, and
              publishing settings.
            </p>
          </div>
          <div className="flex justify-end pt-6 border-t">
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
              size="sm"
            >
              <Save className="h-4 w-4" />
              Save Quiz
            </Button>
          </div>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="space-y-6 h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-auto p-1 gap-1 sm:gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col sm:flex-col items-center gap-2 py-3 px-2 sm:px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-[60px] sm:min-h-[80px]"
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <div className="text-center">
                    <div className="font-medium text-xs sm:text-sm">
                      {tab.label}
                    </div>
                    <div className="text-xs text-muted-foreground hidden lg:block">
                      {tab.description}
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>{" "}
          <TabsContent value="metadata" className="space-y-6">
            <QuizMetadata
              data={quizData.metadata}
              updateData={updateMetadata}
            />
          </TabsContent>
          <TabsContent value="scoring" className="space-y-6">
            <Card className="w-full">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                  Scoring Method
                </CardTitle>
                <CardDescription className="text-sm">
                  Define how questions will be scored and whether to apply
                  penalties for wrong answers.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <ScoringMethod
                  data={quizData.scoring}
                  updateData={updateScoring}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
