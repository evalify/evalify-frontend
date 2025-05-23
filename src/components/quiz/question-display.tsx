"use client";

import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useQuiz } from "./quiz-context";
import { Question, MCQQuestion } from "@/components/quiz/types/types";

type QuestionDisplayProps = {
  question: Question;
};

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const { markQuestionAttempted } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const lastAttemptedRef = useRef<string | null>(null);
  const isMultipleChoice = question.type === "MCQ";

  useEffect(() => {
    setSelectedOption(null);
  }, [question.id]);

  useEffect(() => {
    const hasAnswer = isMultipleChoice
      ? selectedOption !== null
      : textAnswer.trim().length > 0;

    if (hasAnswer) {
      const currentSelectionKey = `${question.id}-${selectedOption}`;

      if (currentSelectionKey !== lastAttemptedRef.current) {
        markQuestionAttempted(question.id);
        lastAttemptedRef.current = currentSelectionKey;
      }
    }
  }, [
    selectedOption,
    textAnswer,
    isMultipleChoice,
    question.id,
    markQuestionAttempted,
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="border border-muted/40 rounded-lg p-5 mb-3 flex-1 bg-card">
        <p className="text-lg font-medium mb-5 text-foreground">
          {question.question}
        </p>

        {isMultipleChoice && "options" in question ? (
          <div className="mt-4 space-y-3">
            {(() => {
              // Properly narrow the type with type guard
              const mcqQuestion = question as MCQQuestion;
              return mcqQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`p-3 rounded-md cursor-pointer flex items-center hover:bg-muted/20 transition-colors ${
                    selectedOption === index
                      ? "bg-primary/15 border border-primary/70"
                      : "bg-background border border-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={selectedOption === index}
                    onChange={() => setSelectedOption(index)}
                    className="mr-3 h-5 w-5"
                  />
                  <span className="text-base font-medium">{option.text}</span>
                </label>
              ));
            })()}
          </div>
        ) : (
          <div className="mt-4">
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              className="bg-background border-input text-foreground p-4 rounded-md w-full h-24 text-base"
              placeholder="Type your answer here..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
