"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Counter from "@/components/ui/counter";
import SelectBox from "@/components/ui/select-box";
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
  onMarksChange: (marks: number) => void;
  onDifficultyChange: (difficulty: string) => void;
  onBloomsTaxonomyChange: (bloomsTaxonomy: string) => void;
  onCourseOutcomeChange: (courseOutcome: string) => void;
  onTopicsChange: (topics: { value: string; label: string }[]) => void;
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
  { value: "co1", label: "CO 1" },
  { value: "co2", label: "CO 2" },
  { value: "co3", label: "CO 3" },
  { value: "co4", label: "CO 4" },
];

const initialTopics: { value: string; label: string }[] = [
  // Empty array - Topics will only show if populated from API/props
];

const QuestionSettings = ({
  marks,
  difficulty,
  bloomsTaxonomy,
  courseOutcome,
  topics,
  onMarksChange,
  onDifficultyChange,
  onBloomsTaxonomyChange,
  onCourseOutcomeChange,
  onTopicsChange,
}: QuestionSettingsProps) => {
  const [availableTopics] = useState(initialTopics);
  const [selectedTopics, setSelectedTopics] =
    useState<{ value: string; label: string }[]>(topics);

  useEffect(() => {
    setSelectedTopics(topics);
  }, [topics]);

  // Topic selection is now handled directly in the SelectBox component
  return (
    <div className="w-96 p-4 space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="space-y-5">
            <div className="flex justify-between gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Hash className="h-4 w-4 text-primary" />
                  <label>Marks</label>
                </div>
                <Counter initialValue={marks} onChange={onMarksChange} />
              </div>
              <div className="w-full">
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <AwardIcon className="h-4 w-4 text-primary" />
                  <label>Difficulty Level</label>
                </div>
                <SelectBox
                  id="difficulty"
                  label=""
                  placeholder="Select"
                  options={difficultyOptions}
                  value={difficulty}
                  onValueChange={onDifficultyChange}
                  allowMultiple={false}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <label>Bloom&apos;s Taxonomy</label>
                </div>
                <SelectBox
                  id="blooms"
                  label=""
                  placeholder="Select"
                  options={bloomOptions}
                  value={bloomsTaxonomy}
                  onValueChange={onBloomsTaxonomyChange}
                  allowMultiple={false}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <label>Course Outcome</label>
                </div>
                <SelectBox
                  id="co"
                  label=""
                  placeholder="Select"
                  options={courseOutcomeOptions}
                  value={courseOutcome}
                  onValueChange={onCourseOutcomeChange}
                  allowMultiple={false}
                />
              </div>
              {availableTopics.length > 0 && (
                <div>                  <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Tags className="h-4 w-4 text-primary" />
                    <label>Related Topics</label>
                  </div>
                  <SelectBox
                    id="topics"
                    label=""
                    placeholder="Select topics..."
                    options={availableTopics}
                    value={selectedTopics.map((t) => t.value)}
                    onValueChange={(values: string[]) => {
                      const selectedOptions = values.map(
                        (v) =>
                          availableTopics.find((t) => t.value === v) || {
                            value: v,
                            label: v,
                          },
                      );
                      onTopicsChange(selectedOptions);
                    }}
                    allowMultiple={true}
                  />
                </div>
              )}            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionSettings;
