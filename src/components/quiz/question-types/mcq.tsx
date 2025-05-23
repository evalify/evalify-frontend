"use client";

import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MCQQuestion } from "@/components/quiz/types/types";
import { useQuiz } from "../quiz-context";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  question: MCQQuestion;
}

function MCQ({ question }: Props) {
  const { mcqAnswers, setMCQAnswers } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    mcqAnswers[question.id]?.selectedOption?.toString(),
  );

  // Initialize from context when component mounts or question changes
  useEffect(() => {
    if (mcqAnswers[question.id]) {
      setSelectedOption(mcqAnswers[question.id].selectedOption.toString());
    }
  }, [question.id, mcqAnswers]);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setMCQAnswers(question.id, { selectedOption: parseInt(value) });
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 break-words text-pretty">
          {question.question}
        </h2>
        <div className="max-h-[55vh] overflow-y-auto pr-2">
          <RadioGroup
            onValueChange={handleOptionChange}
            value={selectedOption}
            className="space-y-4"
          >
            {question.options.map((opt, index) => (
              <div
                key={index}
                className={`flex items-start p-4 rounded-lg border transition-colors duration-200 ease-in-out cursor-pointer
                                      ${
                                        selectedOption === index.toString()
                                          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                                          : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                                      }`}
                onClick={() => handleOptionChange(index.toString())}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`${question.id}-${index}`}
                  className="w-5 h-5 rounded-full border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center mr-4 mt-1 flex-shrink-0"
                />
                <label
                  htmlFor={`${question.id}-${index}`}
                  className="text-base sm:text-lg cursor-pointer flex-grow break-words text-pretty"
                >
                  {opt.text}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

export default MCQ;
