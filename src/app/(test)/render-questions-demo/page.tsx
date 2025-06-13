"use client";

import React from "react";
import { QuestionRenderer } from "@/components/render-questions";
import { QuestionConfig } from "@/components/render-questions/types";
import { sampleQuestions } from "@/components/render-questions/sample-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Eye,
  Edit3,
  Shuffle,
  Award,
  Target,
  Hash,
  Lightbulb,
} from "lucide-react";

export default function QuestionRendererDemo() {
  const { success: showSuccess } = useToast();
  const [config, setConfig] = React.useState<QuestionConfig>({
    mode: "display",
    showActions: true,
    showExplanation: true,
    showHint: true,
    showMarks: true,
    showTopics: true,
    showDifficulty: true,
    showBloomsTaxonomy: true,
    shuffleOptions: false,
    readOnly: false,
    compact: false,
    showCorrectAnswers: false,
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const selectedQuestion = sampleQuestions[selectedQuestionIndex];

  const handleConfigChange = (
    key: keyof QuestionConfig,
    value: boolean | string,
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const questionActions = {
    onEdit: (questionId: string) => {
      showSuccess(`Edit action triggered for question: ${questionId}`);
    },
    onDelete: (questionId: string) => {
      showSuccess(`Delete action triggered for question: ${questionId}`);
    },
    onEditMarks: (questionId: string, newMarks: number) => {
      showSuccess(`Marks updated to ${newMarks} for question: ${questionId}`);
    },
    onDuplicate: (questionId: string) => {
      showSuccess(`Duplicate action triggered for question: ${questionId}`);
    },
  };

  const handleAnswerChange = (answer: unknown) => {
    console.log("Answer changed:", answer);
  };

  // Sample user answers for demonstration
  const sampleUserAnswers = {
    [sampleQuestions[0].id]: { selectedOption: "opt-2" }, // MCQ
    [sampleQuestions[1].id]: { selectedOptions: ["opt-1", "opt-2", "opt-4"] }, // MMCQ
    [sampleQuestions[2].id]: { answer: false }, // True/False
    [sampleQuestions[3].id]: {
      blanks: { "blank-1": ">", "blank-2": "active" },
    }, // Fill Up
    [sampleQuestions[4].id]: {
      matches: {
        "pair-1": "pair-1",
        "pair-2": "pair-2",
        "pair-3": "pair-4",
        "pair-4": "pair-3",
      },
    }, // Match
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Question Renderer Component Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A robust and reusable component for rendering all question types
            with user answers and correct answers
          </p>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{sampleQuestions.length}</div>
              <p className="text-xs text-muted-foreground">Question Types</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Display Modes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Supported Formats</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">Mobile Responsive</p>
            </CardContent>
          </Card>
        </div>{" "}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Configuration Panel */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="w-4 h-4" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Question Type</Label>
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-1">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={question.id}
                      variant={
                        selectedQuestionIndex === index ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedQuestionIndex(index)}
                      className="justify-start text-xs truncate"
                    >
                      {question.type.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              {/* Mode Selection */}{" "}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Display Mode</Label>
                <div className="grid grid-cols-1 gap-1">
                  <Button
                    variant={config.mode === "display" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConfigChange("mode", "display")}
                    className="justify-start text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Display (Answer Review)
                  </Button>
                  <Button
                    variant={config.mode === "student" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConfigChange("mode", "student")}
                    className="justify-start text-xs"
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Student (Compare Answers)
                  </Button>
                  <Button
                    variant={config.mode === "edit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConfigChange("mode", "edit")}
                    className="justify-start text-xs"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit Mode
                  </Button>
                </div>
              </div>
              <Separator />
              {/* Display Mode Options */}
              {config.mode === "display" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Display Options
                    </Label>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-correct" className="text-xs">
                        Show Correct Answers
                      </Label>
                      <Switch
                        id="show-correct"
                        checked={config.showCorrectAnswers || false}
                        onCheckedChange={(checked) =>
                          handleConfigChange("showCorrectAnswers", checked)
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                </>
              )}
              {/* Configuration Switches */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">General Options</Label>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showActions"
                    className="text-xs flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    Show Actions
                  </Label>
                  <Switch
                    id="showActions"
                    checked={config.showActions}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showActions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showMarks"
                    className="text-xs flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" />
                    Show Marks
                  </Label>
                  <Switch
                    id="showMarks"
                    checked={config.showMarks}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showMarks", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showHint"
                    className="text-xs flex items-center gap-1"
                  >
                    <Lightbulb className="w-3 h-3" />
                    Show Hints
                  </Label>
                  <Switch
                    id="showHint"
                    checked={config.showHint}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showHint", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showDifficulty"
                    className="text-xs flex items-center gap-1"
                  >
                    <Target className="w-3 h-3" />
                    Show Difficulty
                  </Label>
                  <Switch
                    id="showDifficulty"
                    checked={config.showDifficulty}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showDifficulty", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="shuffleOptions"
                    className="text-xs flex items-center gap-1"
                  >
                    <Shuffle className="w-3 h-3" />
                    Shuffle Options
                  </Label>
                  <Switch
                    id="shuffleOptions"
                    checked={config.shuffleOptions}
                    onCheckedChange={(checked) =>
                      handleConfigChange("shuffleOptions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="compact"
                    className="text-xs flex items-center gap-1"
                  >
                    <Hash className="w-3 h-3" />
                    Compact Mode
                  </Label>
                  <Switch
                    id="compact"
                    checked={config.compact}
                    onCheckedChange={(checked) =>
                      handleConfigChange("compact", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="readOnly" className="text-xs">
                    Read Only
                  </Label>
                  <Switch
                    id="readOnly"
                    checked={config.readOnly}
                    onCheckedChange={(checked) =>
                      handleConfigChange("readOnly", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Question Display */}
          <div className="xl:col-span-3">
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="text-xs sm:text-sm">
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="all-questions"
                  className="text-xs sm:text-sm"
                >
                  All Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-base sm:text-lg">
                        Question Preview
                      </span>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {selectedQuestion.type.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {config.mode}
                        </Badge>
                        {config.showCorrectAnswers && (
                          <Badge variant="secondary" className="text-xs">
                            With Answers
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {" "}
                    <QuestionRenderer
                      question={selectedQuestion}
                      config={{
                        ...config,
                        userAnswers:
                          config.mode === "student" || config.showCorrectAnswers
                            ? sampleUserAnswers[selectedQuestion.id]
                            : undefined,
                      }}
                      actions={config.showActions ? questionActions : undefined}
                      onAnswerChange={handleAnswerChange}
                      questionNumber={selectedQuestionIndex + 1}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all-questions" className="space-y-4">
                <div className="space-y-4">
                  {sampleQuestions.map((question, index) => (
                    <QuestionRenderer
                      key={question.id}
                      question={question}
                      config={{
                        ...config,
                        userAnswers:
                          config.mode === "student" || config.showCorrectAnswers
                            ? sampleUserAnswers[question.id]
                            : undefined,
                      }}
                      actions={config.showActions ? questionActions : undefined}
                      onAnswerChange={handleAnswerChange}
                      questionNumber={index + 1}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Component Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Question Types Supported</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Multiple Choice (MCQ)</li>
                  <li>• Multiple Multiple Choice (MMCQ)</li>
                  <li>• True/False</li>
                  <li>• Fill in the Blanks</li>
                  <li>• Match the Following</li>
                  <li>• Descriptive/Essay</li>
                  <li>• File Upload</li>
                  <li>• Coding/Programming</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Display Modes</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    • <strong>Display:</strong> Answer review with user
                    responses
                  </li>
                  <li>
                    • <strong>Edit:</strong> Question creation/modification
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Key Features</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• User answer comparison</li>
                  <li>• Correct answer highlighting</li>
                  <li>• Configurable action buttons</li>
                  <li>• LaTeX math rendering</li>
                  <li>• Rich content support</li>
                  <li>• Mobile responsive design</li>
                  <li>• Flexible configuration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
