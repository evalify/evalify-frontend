"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Award,
  BrainCircuit,
  Target,
  Hash,
  Settings,
  Tags,
} from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useQuery } from "@tanstack/react-query";
import Bank, { BankTopic } from "@/repo/bank/bank";

interface QuestionSettingsProps {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  co: number;
  negativeMark: number;
  topicIds: string[];
  bankId?: string;
  showTopics?: boolean;
  onMarksChange: (marks: number) => void;
  onDifficultyChange: (difficulty: string) => void;
  onBloomsTaxonomyChange: (bloomsTaxonomy: string) => void;
  onCourseOutcomeChange: (courseOutcome: number) => void;
  onNegativeMarksChange: (negativeMark: number) => void;
  onTopicsChange: (topicIds: string[]) => void;
}

const difficultyOptions = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const bloomOptions = [
  { value: "REMEMBER", label: "Remember" },
  { value: "UNDERSTAND", label: "Understand" },
  { value: "APPLY", label: "Apply" },
  { value: "ANALYZE", label: "Analyze" },
  { value: "EVALUATE", label: "Evaluate" },
  { value: "CREATE", label: "Create" },
];

const courseOutcomeOptions = [
  { value: 1, label: "CO 1" },
  { value: 2, label: "CO 2" },
  { value: 3, label: "CO 3" },
  { value: 4, label: "CO 4" },
  { value: 5, label: "CO 5" },
  { value: 6, label: "CO 6" },
];

export default function QuestionSettings({
  marks,
  difficulty,
  bloomsTaxonomy,
  co,
  negativeMark,
  topicIds,
  bankId,
  showTopics = true,
  onMarksChange,
  onDifficultyChange,
  onBloomsTaxonomyChange,
  onCourseOutcomeChange,
  onNegativeMarksChange,
  onTopicsChange,
}: QuestionSettingsProps) {
  const { data: bankTopics = [] } = useQuery({
    queryKey: ["bank-topics", bankId],
    queryFn: () => (bankId ? Bank.getBankTopics(bankId) : Promise.resolve([])),
    enabled: !!bankId && showTopics,
  });
  const topicOptions = bankTopics.map((topic: BankTopic) => ({
    label: topic.name,
    value: topic.id,
  }));
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Question Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marks */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            Marks
          </Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={marks}
            onChange={(e) => onMarksChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Negative Marks */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Hash className="h-4 w-4 text-destructive" />
            Negative Marks
          </Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={negativeMark}
            onChange={(e) => onNegativeMarksChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Difficulty Level
          </Label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bloom's Taxonomy */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-primary" />
            Bloom&apos;s Taxonomy
          </Label>
          <Select value={bloomsTaxonomy} onValueChange={onBloomsTaxonomyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select taxonomy" />
            </SelectTrigger>
            <SelectContent>
              {bloomOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Outcome */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Course Outcome
          </Label>
          <Select
            value={co.toString()}
            onValueChange={(value) => onCourseOutcomeChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select outcome" />
            </SelectTrigger>
            <SelectContent>
              {courseOutcomeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {bankId && showTopics && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tags className="h-4 w-4 text-primary" />
              Topics
            </Label>
            <MultiSelect
              options={topicOptions}
              selected={topicIds}
              onChange={(newTopics) => {
                if (typeof newTopics === "function") {
                  onTopicsChange(newTopics(topicIds));
                } else {
                  onTopicsChange(newTopics);
                }
              }}
              placeholder="Select topics..."
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
