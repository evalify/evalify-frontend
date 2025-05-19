import React from 'react'
import { BaseQuestion } from '../types/types'
import { useEffect, useCallback, useState } from 'react'
import { useQuiz } from '../quiz-context'

type FillInTheBlanksProps = {
  question: BaseQuestion
}

function FillInTheBlanks({ question }: FillInTheBlanksProps) {
    const { setBlanksAnswers, blanksAnswers } = useQuiz();
    
    const blankCount = (question.question.match(/___/g) || []).length;
    const [localBlanks, setLocalBlanks] = useState<string[]>(Array(blankCount).fill(''));
    
    // Initialize from saved answers when component mounts or question changes
    useEffect(() => {
      if (blanksAnswers[question.id]) {
        setLocalBlanks(blanksAnswers[question.id].blanks);
      } else {
        const emptyBlanks = Array(blankCount).fill('');
        setLocalBlanks(emptyBlanks);
        setBlanksAnswers(question.id, { blanks: emptyBlanks });
      }
    }, [question.id, blankCount, blanksAnswers, setBlanksAnswers]);
    
    const handleInputChange = useCallback((index: number, value: string) => {
      const newBlanks = [...localBlanks];
      newBlanks[index] = value;
      setLocalBlanks(newBlanks);
      setBlanksAnswers(question.id, { blanks: newBlanks });
    }, [question.id, localBlanks, setBlanksAnswers]);

  return (
    <div className="mt-4 space-y-4">
      {question.question.split("___").map((part: string, index: number) => (
        <span key={index} className="inline-block">
          {part}
          {index < question.question.split("___").length - 1 && (
            <input
              type="text"
              className="border border-gray-700 bg-gray-900 rounded-lg p-2 ml-2"
              value={blanksAnswers[question.id]?.blanks[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          )}
        </span>
      ))}
    </div>
  )
}

export default FillInTheBlanks;