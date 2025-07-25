"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { QuizParticipant } from "./quiz-participant";
import { QuizParticipantData } from "./types";
import Quiz, { CreateQuizDTO, PatchQuizDTO, QuizData } from "@/repo/quiz/quiz";

// Query keys for quiz operations
const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (filters: string) => [...quizKeys.lists(), { filters }] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  byCourse: (courseId: string) =>
    [...quizKeys.all, "course", courseId] as const,
};

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

export function QuizCreationTabs({
  courseId,
  quizId,
  isEdit,
}: {
  courseId?: string;
  quizId?: string;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabId) || "metadata";
  const { error } = useToast();

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
    courses: [],
    labs: [],
    batches: [],
  });

  const { success: showSuccess, error: showError } = useToast();
  const queryClient = useQueryClient();

  // Custom hooks for quiz CRUD operations
  const useQuiz = (quizId: string, enabled = true) => {
    return useQuery({
      queryKey: quizKeys.detail(quizId),
      queryFn: () => Quiz.getQuizById(quizId),
      enabled: enabled && !!quizId,
    });
  };

  const useCreateQuiz = () => {
    return useMutation({
      mutationFn: (quizData: CreateQuizDTO) => Quiz.createQuiz(quizData),
      onSuccess: (data) => {
        // Invalidate and refetch quiz list
        queryClient.invalidateQueries({ queryKey: quizKeys.lists() });

        showSuccess("Quiz created successfully!", {
          description: `Quiz has been created with ID: ${data.quizId}`,
          duration: 4000,
        });
      },
      onError: (err: Error) => {
        let errorMessage = "There was an error creating your quiz.";
        if (err && typeof err === "object" && "message" in err) {
          errorMessage = err.message;
        }
        showError("Failed to create quiz. Please try again.", {
          description: errorMessage,
          duration: 5000,
        });
      },
    });
  };

  const useUpdateQuiz = () => {
    return useMutation({
      mutationFn: ({
        quizId,
        quizData,
      }: {
        quizId: string;
        quizData: PatchQuizDTO;
      }) => Quiz.updateQuiz(quizId, quizData),
      onSuccess: (data, variables) => {
        // Invalidate and refetch quiz list
        queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
        // Invalidate and refetch specific quiz
        queryClient.invalidateQueries({
          queryKey: quizKeys.detail(variables.quizId),
        });

        showSuccess("Quiz updated successfully!", {
          description: "Your quiz changes have been saved.",
          duration: 4000,
        });
      },
      onError: (err: Error) => {
        let errorMessage = "There was an error updating your quiz.";
        if (err && typeof err === "object" && "message" in err) {
          errorMessage = err.message;
        }
        showError("Failed to update quiz. Please try again.", {
          description: errorMessage,
          duration: 5000,
        });
      },
    });
  };

  // Use React Query hooks for CRUD operations
  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();

  // Fetch existing quiz data when in edit mode
  const { data: existingQuiz, isLoading: isLoadingQuiz } = useQuiz(
    quizId || "",
    !!isEdit && !!quizId,
  );

  // Load existing quiz data into form when available
  useEffect(() => {
    if (isEdit && existingQuiz && !isLoadingQuiz) {
      // Parse dates and times from ISO strings
      const parseDateTime = (isoString: string) => {
        if (!isoString) return { date: undefined, time: "" };
        const dateObj = new Date(isoString);
        return {
          date: dateObj,
          time: format(dateObj, "HH:mm"),
        };
      };

      // Parse duration from minutes to appropriate unit
      const parseDuration = (minutes: number) => {
        if (minutes >= 60 && minutes % 60 === 0) {
          return { value: minutes / 60, unit: "Hours" as const };
        }
        return { value: minutes, unit: "Minutes" as const };
      };

      setQuizData({
        metadata: {
          title: existingQuiz.name || "",
          description: existingQuiz.description || "",
          instructions: existingQuiz.instructions || "",
          duration: parseDuration(existingQuiz.durationInMinutes || 60),
          startDateTime: parseDateTime(existingQuiz.startTime),
          endDateTime: parseDateTime(existingQuiz.endTime),
          tags: existingQuiz.quizTags || [],
          questionBreakdown: {
            easy: 0,
            medium: 0,
            hard: 0,
            totalMarks: 0,
          },
          settings: {
            passwordProtected: !!existingQuiz.password,
            password: existingQuiz.password || "",
            autoSubmit: existingQuiz.autoSubmit || false,
            calculatorAccess: existingQuiz.calculator || false,
            allowTabSwitching: true, // Not provided by backend
            fullScreen: existingQuiz.fullScreen || false,
            shuffleQuestions: existingQuiz.shuffleQuestions || false,
            shuffleOptions: existingQuiz.shuffleOptions || false,
            randomizeQuestions: false, // Not provided by backend
            linearQuiz: existingQuiz.linearQuiz || false,
            publishResult: existingQuiz.publishResult || false,
            publishQuiz: existingQuiz.publishQuiz || false,
          },
        },
        scoring: {
          method: "Standard",
          pointsPerQuestion: 1,
          penalizeWrongAnswers: false,
          penaltyAmount: 0,
        },
      });

      setParticipantData({
        students: existingQuiz.studentIds || [],
        courses: existingQuiz.courseIds || [],
        labs: existingQuiz.labIds || [],
        batches: existingQuiz.batchIds || [],
      });
    }
  }, [isEdit, existingQuiz, isLoadingQuiz]);

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

  // Helper function to create update payload with only changed fields
  const createUpdatePayload = (
    currentData: QuizCreationData,
    participantData: QuizParticipantData,
    originalQuiz: QuizData,
  ): PatchQuizDTO => {
    const payload: PatchQuizDTO = {};
    const meta = currentData.metadata;

    // Helper function to compare values and add to payload if different
    const addIfChanged = (
      key: keyof PatchQuizDTO,
      currentValue: unknown,
      originalValue: unknown,
    ) => {
      if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload as any)[key] = currentValue;
      }
    };

    // Transform current data to match backend format for comparison
    const currentStartTime =
      meta.startDateTime.date && meta.startDateTime.time
        ? new Date(
            `${format(meta.startDateTime.date, "yyyy-MM-dd")}T${meta.startDateTime.time}`,
          ).toISOString()
        : null;

    const currentEndTime =
      meta.endDateTime.date && meta.endDateTime.time
        ? new Date(
            `${format(meta.endDateTime.date, "yyyy-MM-dd")}T${meta.endDateTime.time}`,
          ).toISOString()
        : null;

    const currentDurationInMinutes =
      meta.duration.unit === "Hours"
        ? meta.duration.value * 60
        : meta.duration.value;

    // Compare and add only changed fields
    addIfChanged("name", meta.title, originalQuiz.name);
    addIfChanged("description", meta.description, originalQuiz.description);
    addIfChanged("instructions", meta.instructions, originalQuiz.instructions);
    addIfChanged("startTime", currentStartTime, originalQuiz.startTime);
    addIfChanged("endTime", currentEndTime, originalQuiz.endTime);
    addIfChanged(
      "durationInMinutes",
      currentDurationInMinutes,
      originalQuiz.durationInMinutes,
    );
    addIfChanged(
      "fullScreen",
      meta.settings.fullScreen,
      originalQuiz.fullScreen,
    );
    addIfChanged(
      "shuffleQuestions",
      meta.settings.shuffleQuestions,
      originalQuiz.shuffleQuestions,
    );
    addIfChanged(
      "shuffleOptions",
      meta.settings.shuffleOptions,
      originalQuiz.shuffleOptions,
    );
    addIfChanged(
      "linearQuiz",
      meta.settings.linearQuiz,
      originalQuiz.linearQuiz,
    );
    addIfChanged(
      "calculator",
      meta.settings.calculatorAccess,
      originalQuiz.calculator,
    );
    addIfChanged(
      "autoSubmit",
      meta.settings.autoSubmit,
      originalQuiz.autoSubmit,
    );
    addIfChanged(
      "publishResult",
      meta.settings.publishResult,
      originalQuiz.publishResult,
    );
    addIfChanged(
      "publishQuiz",
      meta.settings.publishQuiz,
      originalQuiz.publishQuiz,
    );
    addIfChanged(
      "courseIds",
      participantData.courses,
      originalQuiz.courseIds || [],
    );
    addIfChanged(
      "studentIds",
      participantData.students,
      originalQuiz.studentIds || [],
    );
    addIfChanged("labIds", participantData.labs, originalQuiz.labIds || []);
    addIfChanged(
      "batchIds",
      participantData.batches,
      originalQuiz.batchIds || [],
    );
    addIfChanged("quizTags", meta.tags, originalQuiz.quizTags || []);

    // Handle password separately as it needs special logic
    const currentPassword = meta.settings.passwordProtected
      ? meta.settings.password
      : null;
    const originalPassword = originalQuiz.password || null;
    if (currentPassword !== originalPassword) {
      payload.password = currentPassword || undefined;
    }

    return payload;
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

    // Transform data to match backend DTO structure
    const meta = quizData.metadata;

    if (isEdit && quizId && existingQuiz) {
      // Update existing quiz - only send changed fields
      const updatePayload = createUpdatePayload(
        quizData,
        participantData,
        existingQuiz,
      );

      // Only proceed if there are actual changes
      if (Object.keys(updatePayload).length === 0) {
        showSuccess("No changes detected", {
          description: "All fields are already up to date.",
          duration: 3000,
        });
        return;
      }

      updateQuizMutation.mutate(
        { quizId, quizData: updatePayload },
        {
          onSuccess: () => {
            // Navigate back to quiz view page after successful update
            if (courseId) {
              router.push(`/course/${courseId}/quiz/${quizId}/view`);
            }
          },
        },
      );
    } else {
      // Create new quiz - need all fields
      const startTime =
        meta.startDateTime.date && meta.startDateTime.time
          ? new Date(
              `${format(meta.startDateTime.date, "yyyy-MM-dd")}T${meta.startDateTime.time}`,
            ).toISOString()
          : new Date().toISOString();
      const endTime =
        meta.endDateTime.date && meta.endDateTime.time
          ? new Date(
              `${format(meta.endDateTime.date, "yyyy-MM-dd")}T${meta.endDateTime.time}`,
            ).toISOString()
          : new Date().toISOString();
      const durationInMinutes =
        meta.duration.unit === "Hours"
          ? meta.duration.value * 60
          : meta.duration.value;
      // Create new quiz
      const createPayload: CreateQuizDTO = {
        name: meta.title,
        description: meta.description,
        instructions: meta.instructions,
        startTime,
        endTime,
        durationInMinutes,
        password: meta.settings.passwordProtected
          ? meta.settings.password
          : undefined,
        fullScreen: meta.settings.fullScreen,
        shuffleQuestions: meta.settings.shuffleQuestions,
        shuffleOptions: meta.settings.shuffleOptions,
        linearQuiz: meta.settings.linearQuiz,
        calculator: meta.settings.calculatorAccess,
        autoSubmit: meta.settings.autoSubmit,
        quizTags: meta.tags,
        courseIds: participantData.courses,
        studentIds: participantData.students,
        labIds: participantData.labs,
        batchIds: participantData.batches,
      };

      createQuizMutation.mutate(createPayload, {
        onSuccess: (response) => {
          // Navigate to the created quiz's view page
          if (courseId && response?.quizId) {
            router.push(`/course/${courseId}/quiz/${response.quizId}/view`);
          }
        },
      });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Show loading state when fetching quiz data for edit */}
        {isEdit && isLoadingQuiz ? (
          <div className="space-y-6">
            <div className="mb-8">
              <div className="h-8 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
            </div>
            <div className="h-96 bg-muted animate-pulse rounded"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {isEdit ? "Edit Quiz" : "Create Quiz"}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {isEdit
                    ? "Update your quiz configuration, scoring method, and publishing settings."
                    : "Set up your quiz by configuring the details, scoring method, and publishing settings."}
                </p>
              </div>
              <div className="flex justify-end pt-6 border-t">
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2"
                  size="sm"
                  disabled={
                    createQuizMutation.isPending || updateQuizMutation.isPending
                  }
                >
                  <Save className="h-4 w-4" />
                  {createQuizMutation.isPending || updateQuizMutation.isPending
                    ? isEdit
                      ? "Updating..."
                      : "Saving..."
                    : isEdit
                      ? "Update Quiz"
                      : "Save Quiz"}
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
          </>
        )}
      </div>
    </div>
  );
}
