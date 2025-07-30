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
import { Award, BrainCircuit, Target, Hash, Settings } from "lucide-react";

interface QuestionSettingsProps {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  co: string;
  negativeMarks: number;
  onMarksChange: (marks: number) => void;
  onDifficultyChange: (difficulty: string) => void;
  onBloomsTaxonomyChange: (bloomsTaxonomy: string) => void;
  onCourseOutcomeChange: (courseOutcome: string) => void;
  onNegativeMarksChange: (negativeMarks: number) => void;
}

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const bloomOptions = [
  { value: "remember", label: "Remember" },
  { value: "understand", label: "Understand" },
  { value: "apply", label: "Apply" },
  { value: "analyze", label: "Analyze" },
  { value: "evaluate", label: "Evaluate" },
  { value: "create", label: "Create" },
];

const courseOutcomeOptions = [
  { value: "CO1", label: "CO 1" },
  { value: "CO2", label: "CO 2" },
  { value: "CO3", label: "CO 3" },
  { value: "CO4", label: "CO 4" },
  { value: "CO5", label: "CO 5" },
  { value: "CO6", label: "CO 6" },
];

export default function QuestionSettings({
  marks,
  difficulty,
  bloomsTaxonomy,
  co,
  negativeMarks,
  onMarksChange,
  onDifficultyChange,
  onBloomsTaxonomyChange,
  onCourseOutcomeChange,
  onNegativeMarksChange,
}: QuestionSettingsProps) {
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
            value={negativeMarks}
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
          <Select value={co} onValueChange={onCourseOutcomeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select outcome" />
            </SelectTrigger>
            <SelectContent>
              {courseOutcomeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
