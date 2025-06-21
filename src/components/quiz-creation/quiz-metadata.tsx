"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  Tag,
  Plus,
  X,
  Lock,
  Clock,
  Calculator,
  FileText,
  Settings,
  Shuffle,
  ArrowRight,
  Eye,
  Globe,
  Maximize,
  Info,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type QuizMetadataProps = {
  data: {
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
  updateData: (data: QuizMetadataProps["data"]) => void;
};

export function QuizMetadata({ data, updateData }: QuizMetadataProps) {
  const [newTag, setNewTag] = useState("");
  const handleChange = (
    field: keyof QuizMetadataProps["data"],
    value: unknown,
  ) => {
    updateData({
      ...data,
      [field]: value,
    });
  };

  const handleNestedChange = (
    parent: "duration" | "startDateTime" | "endDateTime",
    field: string,
    value: unknown,
  ) => {
    updateData({
      ...data,
      [parent]: {
        ...data[parent],
        [field]: value,
      },
    });
  };

  const handleSettingsChange = (
    field: keyof QuizMetadataProps["data"]["settings"],
    value: unknown,
  ) => {
    updateData({
      ...data,
      settings: {
        ...data.settings,
        [field]: value,
      },
    });
  };

  const handleQuestionBreakdownChange = (
    field: keyof QuizMetadataProps["data"]["questionBreakdown"],
    value: number,
  ) => {
    updateData({
      ...data,
      questionBreakdown: {
        ...data.questionBreakdown,
        [field]: value,
      },
    });
  };

  const addTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      updateData({
        ...data,
        tags: [...data.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateData({
      ...data,
      tags: data.tags.filter((tag) => tag !== tagToRemove),
    });
  };
  return (
    <div className="flex gap-[2%] flex-wrap content-start">
      {/* Main Content Area - Quiz Details */}
      <div className="grow min-w-0">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quiz Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Quiz Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter quiz title"
                  value={data.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={cn(
                    !data.title.trim() && "border-red-200 focus:border-red-400",
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter quiz description"
                  value={data.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-sm font-medium">
                  Instructions
                </Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter quiz instructions for participants"
                  value={data.instructions}
                  onChange={(e) => handleChange("instructions", e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="duration-value"
                    className="text-sm font-medium"
                  >
                    Duration <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="duration-value"
                      type="number"
                      min={1}
                      value={data.duration.value}
                      onChange={(e) =>
                        handleNestedChange(
                          "duration",
                          "value",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                      className={cn(
                        "flex-1",
                        (!data.duration.value || data.duration.value <= 0) &&
                          "border-red-200 focus:border-red-400",
                      )}
                    />
                    <Select
                      value={data.duration.unit}
                      onValueChange={(value: "Minutes" | "Hours") =>
                        handleNestedChange("duration", "unit", value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Minutes">Minutes</SelectItem>
                        <SelectItem value="Hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Schedule Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Schedule <span className="text-red-500">*</span>
                </h4>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Start Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !data.startDateTime.date &&
                                  "text-muted-foreground border-red-200",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {data.startDateTime.date
                                ? format(data.startDateTime.date, "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 z-50"
                            align="start"
                          >
                            <Calendar
                              selected={data.startDateTime.date}
                              onSelect={(date) =>
                                handleNestedChange(
                                  "startDateTime",
                                  "date",
                                  date,
                                )
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex-shrink-0 w-32">
                        <TimePicker
                          value={data.startDateTime.time}
                          onChange={(time) =>
                            handleNestedChange("startDateTime", "time", time)
                          }
                          placeholder="Select time"
                          className={cn(
                            !data.startDateTime.time && "border-red-200",
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      End Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !data.endDateTime.date &&
                                  "text-muted-foreground border-red-200",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {data.endDateTime.date
                                ? format(data.endDateTime.date, "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 z-50"
                            align="start"
                          >
                            <Calendar
                              selected={data.endDateTime.date}
                              onSelect={(date) =>
                                handleNestedChange("endDateTime", "date", date)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex-shrink-0 w-32">
                        <TimePicker
                          value={data.endDateTime.time}
                          onChange={(time) =>
                            handleNestedChange("endDateTime", "time", time)
                          }
                          placeholder="Select time"
                          className={cn(
                            !data.endDateTime.time && "border-red-200",
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Breakdown Section - Only show when randomize questions is enabled */}
              {data.settings.randomizeQuestions && (
                <div className="space-y-4 border rounded-2xl p-6 bg-muted/50">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Question Selection Criteria
                  </h4>
                  <div className=" border rounded-lg p-3 mb-4">
                    <p className="text-xs text-amber-200">
                      When randomize questions is enabled, the system will
                      randomly select questions from your question pool based on
                      the criteria below.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="easy-questions"
                        className="text-sm font-medium text-green-600"
                      >
                        Easy Questions
                      </Label>
                      <Input
                        id="easy-questions"
                        type="number"
                        min={0}
                        value={data.questionBreakdown.easy}
                        onChange={(e) =>
                          handleQuestionBreakdownChange(
                            "easy",
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                        className="border-green-200 focus:border-green-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="medium-questions"
                        className="text-sm font-medium text-yellow-600"
                      >
                        Medium Questions
                      </Label>
                      <Input
                        id="medium-questions"
                        type="number"
                        min={0}
                        value={data.questionBreakdown.medium}
                        onChange={(e) =>
                          handleQuestionBreakdownChange(
                            "medium",
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                        className="border-yellow-200 focus:border-yellow-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="hard-questions"
                        className="text-sm font-medium text-red-600"
                      >
                        Hard Questions
                      </Label>
                      <Input
                        id="hard-questions"
                        type="number"
                        min={0}
                        value={data.questionBreakdown.hard}
                        onChange={(e) =>
                          handleQuestionBreakdownChange(
                            "hard",
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                        className="border-red-200 focus:border-red-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="total-marks"
                        className="text-sm font-medium text-primary"
                      >
                        Total Marks
                      </Label>
                      <Input
                        id="total-marks"
                        type="number"
                        min={0}
                        value={data.questionBreakdown.totalMarks}
                        onChange={(e) =>
                          handleQuestionBreakdownChange(
                            "totalMarks",
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Question Summary */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Question Summary
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg text-green-600">
                          {data.questionBreakdown.easy}
                        </div>
                        <div className="text-muted-foreground">Easy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-yellow-600">
                          {data.questionBreakdown.medium}
                        </div>
                        <div className="text-muted-foreground">Medium</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-red-600">
                          {data.questionBreakdown.hard}
                        </div>
                        <div className="text-muted-foreground">Hard</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-primary">
                          {data.questionBreakdown.easy +
                            data.questionBreakdown.medium +
                            data.questionBreakdown.hard}
                        </div>
                        <div className="text-muted-foreground">
                          Total Questions
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50 text-center">
                      <span className="text-sm text-muted-foreground">
                        Total Marks:
                      </span>
                      <span className="font-semibold text-primary">
                        {data.questionBreakdown.totalMarks}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Sidebar - Quiz Settings */}
      <div className="w-full lg:w-1/4 min-w-[280px] pt-4 lg:pt-0">
        <Card className="h-fit lg:h-full sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Quiz Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TooltipProvider>
              {/* Tags Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Tags
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={addTag}
                      type="button"
                      size="sm"
                      className="shrink-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {data.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Tag className="h-2 w-2" />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="h-2 w-2" />
                          <span className="sr-only">Remove {tag}</span>
                        </button>
                      </Badge>
                    ))}
                    {data.tags.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        No tags added yet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Security & Access
                </h4>

                {/* Password Protection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 cursor-help">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <Label
                            htmlFor="password-protected"
                            className="cursor-help text-sm"
                          >
                            Password Protected
                          </Label>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Require participants to enter a password before
                          accessing the quiz
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Switch
                      id="password-protected"
                      checked={data.settings.passwordProtected}
                      onCheckedChange={(checked) =>
                        handleSettingsChange("passwordProtected", checked)
                      }
                    />
                  </div>
                  {data.settings.passwordProtected && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="password" className="text-sm">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={data.settings.password}
                        onChange={(e) =>
                          handleSettingsChange("password", e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Full Screen Mode */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <Maximize className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="full-screen"
                          className="cursor-help text-sm"
                        >
                          Full Screen Mode
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Force the quiz to open in full screen mode to minimize
                        distractions
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="full-screen"
                    checked={data.settings.fullScreen}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("fullScreen", checked)
                    }
                  />
                </div>
              </div>

              {/* Quiz Behavior */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Quiz Behavior
                </h4>

                {/* Auto Submit */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="auto-submit"
                          className="cursor-help text-sm"
                        >
                          Auto-submit
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Automatically submit the quiz when time expires
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="auto-submit"
                    checked={data.settings.autoSubmit}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("autoSubmit", checked)
                    }
                  />
                </div>

                {/* Linear Quiz */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="linear-quiz"
                          className="cursor-help text-sm"
                        >
                          Linear Quiz
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Prevent participants from going back to previous
                        questions
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="linear-quiz"
                    checked={data.settings.linearQuiz}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("linearQuiz", checked)
                    }
                  />
                </div>

                {/* Randomize Questions */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="randomize-questions"
                          className="cursor-help text-sm"
                        >
                          Randomize Questions
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Randomly select questions from your question pool based
                        on difficulty criteria
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="randomize-questions"
                    checked={data.settings.randomizeQuestions}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("randomizeQuestions", checked)
                    }
                  />
                </div>

                {/* Shuffle Questions */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <Shuffle className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="shuffle-questions"
                          className="cursor-help text-sm"
                        >
                          Shuffle Questions
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Randomize the order of questions for each participant
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="shuffle-questions"
                    checked={data.settings.shuffleQuestions}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("shuffleQuestions", checked)
                    }
                  />
                </div>

                {/* Shuffle Options */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <Shuffle className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="shuffle-options"
                          className="cursor-help text-sm"
                        >
                          Shuffle Options
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Randomize the order of answer choices for each question
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="shuffle-options"
                    checked={data.settings.shuffleOptions}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("shuffleOptions", checked)
                    }
                  />
                </div>
              </div>

              {/* Tools & Features */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Tools & Features
                </h4>

                {/* Calculator Access */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="calculator-access"
                          className="cursor-help text-sm"
                        >
                          Calculator Access
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Allow participants to use a built-in calculator during
                        the quiz
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="calculator-access"
                    checked={data.settings.calculatorAccess}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("calculatorAccess", checked)
                    }
                  />
                </div>
              </div>

              {/* Publishing Options */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Publishing
                </h4>

                {/* Publish Quiz */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="publish-quiz"
                          className="cursor-help text-sm"
                        >
                          Publish Quiz
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Make the quiz available to participants
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="publish-quiz"
                    checked={data.settings.publishQuiz}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("publishQuiz", checked)
                    }
                  />
                </div>

                {/* Publish Results */}
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-help">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor="publish-result"
                          className="cursor-help text-sm"
                        >
                          Publish Results
                        </Label>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Show results to participants immediately after
                        completion
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="publish-result"
                    checked={data.settings.publishResult}
                    onCheckedChange={(checked) =>
                      handleSettingsChange("publishResult", checked)
                    }
                  />
                </div>
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
