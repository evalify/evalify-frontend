"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Counter from "@/components/ui/counter";
import SelectBox from "@/components/ui/select-box";

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

const QuestionSettings: React.FC<QuestionSettingsProps> = ({
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
}) => {
  const [availableTopics] = useState(initialTopics);
  const [selectedTopics, setSelectedTopics] =
    useState<{ value: string; label: string }[]>(topics);

  useEffect(() => {
    setSelectedTopics(topics);
  }, [topics]);

  const handleTopicSelect = (value: string[]) => {
    // For multiple selection, update selected topics directly
    const selectedOptions = value.map(
      (v) =>
        availableTopics.find((t) => t.value === v) || { value: v, label: v },
    );
    setSelectedTopics(selectedOptions);
    onTopicsChange(selectedOptions);
  };
  return (
    <div className="w-96 p-4 space-y-4">
      {/* Marks and Difficulty Level */}{" "}
      <Card>
        <CardContent className="p-5">
          <div className="space-y-5">
            <div className="flex justify-between gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2">Marks</label>
                <Counter initialValue={marks} onChange={onMarksChange} />
              </div>
              <div className="w-full">
                <SelectBox
                  id="difficulty"
                  label="Difficulty Level"
                  placeholder="Select"
                  options={difficultyOptions}
                  value={difficulty}
                  onValueChange={onDifficultyChange}
                />
              </div>
            </div>
            <div className="space-y-4">
              <SelectBox
                id="bloom"
                label="Bloom's Taxonomy Level"
                placeholder="Select a level"
                options={bloomOptions}
                value={bloomsTaxonomy}
                onValueChange={onBloomsTaxonomyChange}
              />
              <SelectBox
                id="course-outcome"
                label="Course Outcome"
                placeholder="Select Course Outcome"
                options={courseOutcomeOptions}
                value={courseOutcome}
                onValueChange={onCourseOutcomeChange}
              />
            </div>
          </div>{" "}
        </CardContent>
      </Card>
      {/* Topics - Only show if topics are available */}
      {availableTopics.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Topics</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <SelectBox
              id="topics"
              label=""
              placeholder="Select related topics"
              options={availableTopics}
              value={selectedTopics.map((t) => t.value)}
              onValueChange={handleTopicSelect}
              allowMultiple={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionSettings;
