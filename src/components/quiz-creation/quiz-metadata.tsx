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
  CalendarIcon,
  Tag,
  Plus,
  X,
  Lock,
  Clock,
  Calculator,
  ExternalLink,
  FileText,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type QuizMetadataProps = {
  data: {
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
            {" "}
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Quiz Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter quiz title"
                  value={data.title}
                  onChange={(e) => handleChange("title", e.target.value)}
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="duration-value"
                    className="text-sm font-medium"
                  >
                    Duration
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
                      className="flex-1"
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
              </div>{" "}
              {/* Schedule Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Schedule
                </h4>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Start Date & Time
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
                                  "text-muted-foreground",
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
                              mode="single"
                              selected={data.startDateTime.date}
                              onSelect={(date) =>
                                handleNestedChange(
                                  "startDateTime",
                                  "date",
                                  date,
                                )
                              }
                              initialFocus
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
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      End Date & Time
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
                                  "text-muted-foreground",
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
                              mode="single"
                              selected={data.endDateTime.date}
                              onSelect={(date) =>
                                handleNestedChange("endDateTime", "date", date)
                              }
                              initialFocus
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Tags Section */}
              <div className="space-y-4">
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
                    />
                    <Button
                      variant="outline"
                      onClick={addTag}
                      type="button"
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag}</span>
                        </button>
                      </Badge>
                    ))}
                    {data.tags.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        No tags added yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>{" "}
      {/* Sidebar - Quiz Settings */}
      <div className="w-full lg:w-1/4 min-w-[280px] pt-4 lg:pt-0">
        <Card className="h-fit lg:h-full sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Quiz Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Password Protection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Label
                      htmlFor="password-protected"
                      className="cursor-pointer text-sm"
                    >
                      Password Protected
                    </Label>
                  </div>
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

              {/* Auto Submit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label
                    htmlFor="auto-submit"
                    className="cursor-pointer text-sm"
                  >
                    Auto-submit
                  </Label>
                </div>
                <Switch
                  id="auto-submit"
                  checked={data.settings.autoSubmit}
                  onCheckedChange={(checked) =>
                    handleSettingsChange("autoSubmit", checked)
                  }
                />
              </div>

              {/* Calculator Access */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  <Label
                    htmlFor="calculator-access"
                    className="cursor-pointer text-sm"
                  >
                    Calculator Access
                  </Label>
                </div>
                <Switch
                  id="calculator-access"
                  checked={data.settings.calculatorAccess}
                  onCheckedChange={(checked) =>
                    handleSettingsChange("calculatorAccess", checked)
                  }
                />
              </div>

              {/* Allow Tab Switching */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <Label
                    htmlFor="allow-tab-switching"
                    className="cursor-pointer text-sm"
                  >
                    Tab Switching
                  </Label>
                </div>
                <Switch
                  id="allow-tab-switching"
                  checked={data.settings.allowTabSwitching}
                  onCheckedChange={(checked) =>
                    handleSettingsChange("allowTabSwitching", checked)
                  }
                />
              </div>
            </div>

            {/* Settings Summary */}
            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-2">Quick Summary:</p>
                <ul className="space-y-1">
                  <li>
                    Duration: {data.duration.value}{" "}
                    {data.duration.unit.toLowerCase()}
                  </li>
                  <li>Tags: {data.tags.length} added</li>
                  <li>
                    Security:{" "}
                    {data.settings.passwordProtected ? "Protected" : "Open"}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
