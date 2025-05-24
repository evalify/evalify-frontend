"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type PublishingSettingsProps = {
  data: {
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
  updateData: (data: PublishingSettingsProps["data"]) => void;
};

export function PublishingSettings({
  data,
  updateData,
}: PublishingSettingsProps) {
  const handleChange = (
    field: keyof PublishingSettingsProps["data"],
    value: unknown,
  ) => {
    updateData({
      ...data,
      [field]: value,
    });
  };

  const handleNestedChange = (
    parent: "publishDateTime" | "resultsPublishDateTime",
    field: "date" | "time",
    value: Date | undefined | string,
  ) => {
    updateData({
      ...data,
      [parent]: {
        ...data[parent],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {" "}
        <div className="space-y-2">
          <Label>Quiz Publish Date & Time</Label>
          <div className="flex gap-2">
            <div className="w-1/4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.publishDateTime.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.publishDateTime.date
                      ? format(data.publishDateTime.date, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={data.publishDateTime.date}
                    onSelect={(date) =>
                      handleNestedChange("publishDateTime", "date", date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-shrink-0 w-32">
              <TimePicker
                value={data.publishDateTime.time}
                onChange={(time) =>
                  handleNestedChange("publishDateTime", "time", time)
                }
                placeholder="Select time"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select
            value={data.visibility}
            onValueChange={(value) => handleChange("visibility", value)}
          >
            <SelectTrigger id="visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Students">All Students</SelectItem>
              <SelectItem value="Batch 1">Batch 1</SelectItem>
              <SelectItem value="Batch 2">Batch 2</SelectItem>
              <SelectItem value="Selected Students">
                Selected Students
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="show-results" className="cursor-pointer">
            Show results after submission?
          </Label>
          <Switch
            id="show-results"
            checked={data.showResultsAfterSubmission}
            onCheckedChange={(checked) =>
              handleChange("showResultsAfterSubmission", checked)
            }
          />
        </div>{" "}
        {!data.showResultsAfterSubmission && (
          <div className="space-y-2">
            <Label>Results Publish Date & Time</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !data.resultsPublishDateTime.date &&
                          "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data.resultsPublishDateTime.date
                        ? format(data.resultsPublishDateTime.date, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={data.resultsPublishDateTime.date}
                      onSelect={(date) =>
                        handleNestedChange(
                          "resultsPublishDateTime",
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
                  value={data.resultsPublishDateTime.time}
                  onChange={(time) =>
                    handleNestedChange("resultsPublishDateTime", "time", time)
                  }
                  placeholder="Select time"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="post-quiz-feedback" className="cursor-pointer">
            Post Quiz feedback
          </Label>
          <Switch
            id="post-quiz-feedback"
            checked={data.postQuizFeedback}
            onCheckedChange={(checked) =>
              handleChange("postQuizFeedback", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="allow-quiz-retake" className="cursor-pointer">
            Allow quiz retake
          </Label>
          <Switch
            id="allow-quiz-retake"
            checked={data.allowQuizRetake}
            onCheckedChange={(checked) =>
              handleChange("allowQuizRetake", checked)
            }
          />
        </div>
        {data.allowQuizRetake && (
          <div className="space-y-2 ml-6">
            <Label htmlFor="number-of-retakes">Number of retakes allowed</Label>
            <Input
              id="number-of-retakes"
              type="number"
              min={1}
              value={data.numberOfRetakes}
              onChange={(e) =>
                handleChange(
                  "numberOfRetakes",
                  Number.parseInt(e.target.value) || 1,
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
