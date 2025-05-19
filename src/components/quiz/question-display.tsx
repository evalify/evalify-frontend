"use client"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useQuiz } from "./quiz-context"
import { Question } from "@/components/quiz/types/types"
type QuestionDisplayProps = {
  question: Question
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const { markQuestionAttempted } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const lastAttemptedRef = useRef<string | null>(null);
  const isMultipleChoice = question.type === "multiple-choice";
  
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
  }, [selectedOption, textAnswer, isMultipleChoice, question.id, markQuestionAttempted]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="border border-gray-700 rounded-lg p-6 mb-4 flex-1">
        <p className="text-xl italic mb-8">{question.question}</p>

        {isMultipleChoice ? (
          <div className="mt-4 space-y-4">
            {question.options.map((option: { text: string; correct: boolean }, index: number) => (
              <label 
                key={index}
                className={`p-4 rounded-lg cursor-pointer flex items-center ${
                  selectedOption === index ? "bg-blue-900 border border-blue-500" : "bg-gray-900 border border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="mr-3 h-4 w-4"
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white p-4 rounded-lg w-full h-20"
              placeholder="Type your answer here..."
            />
          </div>
        )}
      </div>
    </div>
  )
}
