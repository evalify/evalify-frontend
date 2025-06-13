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
import { Save, FileText, Calculator, Users } from "lucide-react";
import { QuizMetadata } from "./quiz-metadata";
import { ScoringMethod } from "./scoring-method";
import { format, differenceInMinutes } from "date-fns";
import { QuizParticipant, QuizParticipantData } from "./quiz-participant";
import type { Student, Batch, Course, Lab } from "@/lib/types";
import Quiz from "@/repo/quiz/quiz";

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
    id: "participants",
    label: "Participants",
    icon: Users,
    description: "Add participants to the quiz",
  },
  {
    id: "scoring",
    label: "Scoring Method",
    icon: Calculator,
    description: "Configure how the quiz will be scored",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function QuizCreationTabs(
  {
    // courseId,
    // quizId,
    // isEdit,
  }: {
    courseId?: string;
    quizId?: string;
    isEdit?: boolean;
  },
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabId) || "metadata";
  const { error, success } = useToast();

  // Mock data for participants
  const students: Student[] = [
    {
      id: "student-1",
      name: "John Doe",
      email: "john@example.com",
      rollNumber: "2021001",
    },
    {
      id: "student-2",
      name: "Jane Smith",
      email: "jane@example.com",
      rollNumber: "2021002",
    },
    {
      id: "student-3",
      name: "Bob Johnson",
      email: "bob@example.com",
      rollNumber: "2021003",
    },
  ];
  const batches: Batch[] = [
    { id: "batch-1", name: "CS Batch A", year: 2021 },
    { id: "batch-2", name: "CS Batch B", year: 2021 },
    { id: "batch-3", name: "CS Batch C", year: 2022 },
  ];
  const courses: Course[] = [
    { id: "course-1", name: "Data Structures", code: "CS201" },
    { id: "course-2", name: "Algorithms", code: "CS301" },
    { id: "course-3", name: "Database Systems", code: "CS202" },
  ];
  const labs: Lab[] = [
    { id: "lab-1", name: "Computer Lab A", location: "Block A, Room 101" },
    { id: "lab-2", name: "Computer Lab B", location: "Block B, Room 201" },
  ];

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

  const [participantData, setParticipantData] = useState<QuizParticipantData>({
    students: [],
    batches: [],
    courses: [],
    labs: [],
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

  // Save quiz data with validation and API call
  const handleSave = async () => {
    const validationErrors = validateQuizData();

    if (validationErrors.length > 0) {
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

    // Transform data to QuizSchema
    try {
      const meta = quizData.metadata;
      const now = new Date().toISOString();
      const startTime =
        meta.startDateTime.date && meta.startDateTime.time
          ? new Date(
              `${format(meta.startDateTime.date, "yyyy-MM-dd")}T${meta.startDateTime.time}`,
            ).toISOString()
          : now;
      const endTime =
        meta.endDateTime.date && meta.endDateTime.time
          ? new Date(
              `${format(meta.endDateTime.date, "yyyy-MM-dd")}T${meta.endDateTime.time}`,
            ).toISOString()
          : now;
      const duration =
        meta.duration.unit === "Hours"
          ? meta.duration.value * 60
          : meta.duration.value;

      const quizPayload = {
        id: "",
        name: meta.title,
        description: meta.description,
        instructions: meta.instructions,
        startTime,
        endTime,
        duration,
        password: meta.settings.passwordProtected ? meta.settings.password : "",
        fullScreen: meta.settings.fullScreen,
        shuffleQuestions: meta.settings.shuffleQuestions,
        shuffleOptions: meta.settings.shuffleOptions,
        linearQuiz: meta.settings.linearQuiz,
        calculator: meta.settings.calculatorAccess,
        autoSubmit: meta.settings.autoSubmit,
        publishResult: meta.settings.publishResult,
        publishQuiz: meta.settings.publishQuiz,
        section: [],
        course: participantData.courses,
        student: participantData.students,
        lab: participantData.labs,
        batch: participantData.batches,
        createdAt: now,
        createdBy: "",
      };

      await Quiz.createQuiz(quizPayload);
      success("Quiz created successfully!", {
        description: `"${meta.title}" has been created and saved.`,
        duration: 4000,
      });
      // Optionally redirect or reset form here
    } catch (e: unknown) {
      let errorMessage = "There was an error saving your quiz data.";
      if (
        e &&
        typeof e === "object" &&
        "message" in e &&
        typeof (e as { message?: string }).message === "string"
      ) {
        errorMessage = (e as { message: string }).message;
      }
      error("Failed to create quiz. Please try again.", {
        description: errorMessage,
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
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto p-1 gap-1 sm:gap-0">
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
          </TabsList>
          <TabsContent value="metadata" className="space-y-6">
            <QuizMetadata
              data={quizData.metadata}
              updateData={updateMetadata}
            />
          </TabsContent>
          <TabsContent value="participants" className="space-y-6">
            <QuizParticipant
              data={participantData}
              updateData={setParticipantData}
              students={students}
              batches={batches}
              courses={courses}
              labs={labs}
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
