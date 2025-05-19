import React from 'react'
import { MCQQuestion, MCQAnswer } from '../types/types'
import { useEffect, useRef, useState } from 'react'
import { useQuiz } from '../quiz-context'

type MCQProps = {
  question: MCQQuestion
}

function MCQ({ question }: MCQProps) {
    const { markQuestionAttempted, mcqAnswers, setMCQAnswers } = useQuiz();
    const [selectedOption, setSelectedOption] = useState<number | null>(
      // Initialize from stored answers if available
      mcqAnswers[String(question.id)]?.selectedOption ?? null
    );
    const lastAttemptedRef = useRef<string | null>(null);
    
    // Remove this effect that was resetting the answer when switching questions
    // useEffect(() => {
    //   setSelectedOption(null);
    // }, [question.id]);

    useEffect(() => {
        // Only mark as attempted if an option is actually selected
        if (selectedOption !== null) {
          const currentSelectionKey = `${question.id}-${selectedOption}`;
          
          if (currentSelectionKey !== lastAttemptedRef.current) {
            // Store the answer in context
            setMCQAnswers(question.id, { selectedOption });
            markQuestionAttempted(question.id);
            lastAttemptedRef.current = currentSelectionKey;
          }
        }
    }, [selectedOption, question.id, markQuestionAttempted, setMCQAnswers]);
  return (
    <div className="mt-4 space-y-4">
      {question.options.map((option, index) => (
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
  )
}

export default MCQ