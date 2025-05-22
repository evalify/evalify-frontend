"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { MultipleSelectQuestion } from "@/components/quiz/types/types";
import { useQuiz } from "../quiz-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  question: MultipleSelectQuestion;
}

export interface MultipleSelectAnswer {
  selectedOptions: number[];
}

function MultipleSelect({ question }: Props) {
  const { multipleSelectAnswers, setMultipleSelectAnswers } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    multipleSelectAnswers[question.id]?.selectedOptions || [],
  );

  // Initialize from context when component mounts or question changes
  useEffect(() => {
    if (multipleSelectAnswers[question.id]) {
      setSelectedOptions(multipleSelectAnswers[question.id].selectedOptions);

      // Console log when loading from context
      console.log("MultipleSelectAnswers loaded from context:", {
        questionId: question.id,
        selectedOptions: multipleSelectAnswers[question.id].selectedOptions,
        question: question.question,
      });
    }
  }, [question.id, multipleSelectAnswers, question.question]);

  const handleOptionChange = (index: number, checked: boolean) => {
    let newSelectedOptions: number[];

    if (checked) {
      newSelectedOptions = [...selectedOptions, index];
    } else {
      newSelectedOptions = selectedOptions.filter((i) => i !== index);
    }

    setSelectedOptions(newSelectedOptions);
    setMultipleSelectAnswers(question.id, {
      selectedOptions: newSelectedOptions,
    });

    // Console log the updated answers
    console.log("MultipleSelectAnswers changed:", {
      questionId: question.id,
      selectedOptions: newSelectedOptions,
      question: question.question,
    });
  };

  const handleClearSelections = () => {
    setSelectedOptions([]);
    setMultipleSelectAnswers(question.id, { selectedOptions: [] });

    // Console log when selections are cleared
    console.log("MultipleSelectAnswers cleared:", {
      questionId: question.id,
      question: question.question,
    });
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 break-words text-pretty">
          {question.question}
        </h2>

        <div className="flex justify-end mb-4">
          {selectedOptions.length > 0 && (
            <Button
              onClick={handleClearSelections}
              variant="destructive"
              size="sm"
            >
              Clear All Selections
            </Button>
          )}
        </div>

        <div className="max-h-[55vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            {question.options.map((opt, index) => (
              <div
                key={index}
                className={`flex items-start p-4 rounded-lg border transition-colors duration-200 ease-in-out
                  ${
                    selectedOptions.includes(index)
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
              >
                <div className="flex items-center h-5 mt-1 mr-4">
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={selectedOptions.includes(index)}
                    onCheckedChange={(checked) =>
                      handleOptionChange(index, checked === true)
                    }
                    className="h-5 w-5"
                  />
                </div>
                <label
                  htmlFor={`${question.id}-${index}`}
                  className="text-base sm:text-lg cursor-pointer flex-grow break-words text-pretty"
                >
                  {opt.text}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MultipleSelect;
