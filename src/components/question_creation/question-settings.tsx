"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Counter from "@/components/ui/counter";
import SelectBox from "@/components/ui/select-box";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Award as AwardIcon,
  BrainCircuit,
  Target,
  Hash,
  Tags,
} from "lucide-react";

interface QuestionSettingsProps {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  courseOutcome: string;
  topics: { value: string; label: string }[];
  availableTopics?: { value: string; label: string }[];
  onMarksChange: (marks: number) => void;
  onDifficultyChange: (difficulty: string) => void;
  onBloomsTaxonomyChange: (bloomsTaxonomy: string) => void;
  onCourseOutcomeChange: (courseOutcome: string) => void;
  onTopicsChange: (topicIds: string[]) => void;
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
  { value: "analyse", label: "Analyse" },
  { value: "evaluate", label: "Evaluate" },
  { value: "create", label: "Create" },
];

const courseOutcomeOptions = [
  { value: "co1", label: "CO 1" },
  { value: "co2", label: "CO 2" },
  { value: "co3", label: "CO 3" },
  { value: "co4", label: "CO 4" },
];

const QuestionSettings = ({
  marks,
  difficulty,
  bloomsTaxonomy,
  courseOutcome,
  topics,
  availableTopics = [],
  onMarksChange,
  onDifficultyChange,
  onBloomsTaxonomyChange,
  onCourseOutcomeChange,
  onTopicsChange,
}: QuestionSettingsProps) => {
  const [selectedTopics, setSelectedTopics] =
    useState<{ value: string; label: string }[]>(topics);

  useEffect(() => {
    setSelectedTopics(topics);
  }, [topics]);

  return (
    <div className="w-full p-4 lg:p-6 bg-background">
      <Card className="w-full">
        <CardContent className="p-4 lg:p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Question Settings
          </h3>

          {/* Main Settings - Stacked vertically for sidebar */}
          <div className="space-y-6">
            {/* Marks */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium text-foreground">
                  Marks
                </label>
              </div>
              <div className="w-full">
                <Counter initialValue={marks} onChange={onMarksChange} />
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AwardIcon className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium text-foreground">
                  Difficulty Level
                </label>
              </div>
              <SelectBox
                id="difficulty"
                label=""
                placeholder="Select difficulty"
                options={difficultyOptions}
                value={difficulty}
                onValueChange={onDifficultyChange}
                allowMultiple={false}
              />
            </div>

            {/* Bloom's Taxonomy */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium text-foreground">
                  Bloom&apos;s Taxonomy
                </label>
              </div>
              <SelectBox
                id="blooms"
                label=""
                placeholder="Select taxonomy"
                options={bloomOptions}
                value={bloomsTaxonomy}
                onValueChange={onBloomsTaxonomyChange}
                allowMultiple={false}
              />
            </div>

            {/* Course Outcome */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium text-foreground">
                  Course Outcome
                </label>
              </div>
              <SelectBox
                id="co"
                label=""
                placeholder="Select outcome"
                options={courseOutcomeOptions}
                value={courseOutcome}
                onValueChange={onCourseOutcomeChange}
                allowMultiple={false}
              />
            </div>

            {/* Topics Section */}
            {availableTopics.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-primary" />
                  <label className="text-sm font-medium text-foreground">
                    Related Topics
                  </label>
                </div>
                <MultiSelect
                  options={availableTopics}
                  selected={selectedTopics.map((t) => t.value)}
                  onChange={(values) => {
                    if (typeof values === "function") {
                      const newValues = values(
                        selectedTopics.map((t) => t.value),
                      );
                      onTopicsChange(newValues);
                    } else {
                      onTopicsChange(values);
                    }
                  }}
                  placeholder="Select topics..."
                  className="w-full"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionSettings;
