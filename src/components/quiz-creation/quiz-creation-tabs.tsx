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
import { Save, Settings, FileText, Calculator } from "lucide-react";
import { QuizMetadata } from "./quiz-metadata";
import { ScoringMethod } from "./scoring-method";
import { PublishingSettings } from "./publishing-settings";

// Define the data structure for each component
type QuizCreationData = {
  metadata: {
    title: string;
    description: string;
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
    settings: {
      passwordProtected: boolean;
      password: string;
      autoSubmit: boolean;
      calculatorAccess: boolean;
      allowTabSwitching: boolean;
    };
  };
  scoring: {
    method: "Standard" | "Weighted";
    pointsPerQuestion: number;
    penalizeWrongAnswers: boolean;
    penaltyAmount: number;
  };
  publishing: {
    publishDateTime: {
      date: Date | undefined;
      time: string;
    };
    visibility: string;
    showResultsAfterSubmission: boolean;
    resultsPublishDateTime: {
      date: Date | undefined;
      time: string;
    };
    postQuizFeedback: boolean;
    allowQuizRetake: boolean;
    numberOfRetakes: number;
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
  {
    id: "publishing",
    label: "Publishing Settings",
    icon: Settings,
    description: "Set publication and visibility options",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function QuizCreationTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabId) || "metadata";

  // Initialize quiz data with default values
  const [quizData, setQuizData] = useState<QuizCreationData>({
    metadata: {
      title: "",
      description: "",
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
      settings: {
        passwordProtected: false,
        password: "",
        autoSubmit: false,
        calculatorAccess: false,
        allowTabSwitching: true,
      },
    },
    scoring: {
      method: "Standard",
      pointsPerQuestion: 1,
      penalizeWrongAnswers: false,
      penaltyAmount: 0,
    },
    publishing: {
      publishDateTime: {
        date: undefined,
        time: "",
      },
      visibility: "All Students",
      showResultsAfterSubmission: true,
      resultsPublishDateTime: {
        date: undefined,
        time: "",
      },
      postQuizFeedback: false,
      allowQuizRetake: false,
      numberOfRetakes: 1,
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

  const updatePublishing = (data: QuizCreationData["publishing"]) => {
    setQuizData((prev) => ({ ...prev, publishing: data }));
  };
  // Save quiz data
  const handleSave = () => {
    // Here you would typically save to an API
    console.log("Saving quiz data:", quizData);
    // TODO: Implement API call to save quiz data
  };
  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Create Quiz
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Set up your quiz by configuring the details, scoring method, and
            publishing settings.
          </p>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="space-y-6 h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto p-1 gap-1 sm:gap-0 flex-shrink-0">
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
          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="metadata"
              className="space-y-6 h-full overflow-y-auto"
            >
              <QuizMetadata
                data={quizData.metadata}
                updateData={updateMetadata}
              />
            </TabsContent>
            <TabsContent
              value="scoring"
              className="space-y-6 h-full overflow-y-auto"
            >
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
            <TabsContent
              value="publishing"
              className="space-y-6 h-full overflow-y-auto"
            >
              <Card className="w-full">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    Publishing Settings
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Set when and how your quiz will be published, including
                    visibility and result settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <PublishingSettings
                    data={quizData.publishing}
                    updateData={updatePublishing}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
          {/* Action buttons */}
          <div className="flex justify-end pt-6 border-t flex-shrink-0">
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
              size="sm"
            >
              <Save className="h-4 w-4" />
              Save Quiz
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
