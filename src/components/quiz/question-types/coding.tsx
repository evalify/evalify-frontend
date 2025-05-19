import React, { useEffect, useState } from 'react'
import { useQuiz } from '../quiz-context'
import { CodingQuestion, CodingAnswer } from '../types/types'
import EnhancedEditor from '@/components/ui/enhanced-editor'

type Props = {
  question: CodingQuestion
}

function Coding({ question }: Props) {
  const { codingAnswers, setCodingAnswers } = useQuiz()
  
  // Initialize answer from context or with default values
  const [answer, setAnswer] = useState<CodingAnswer>(() => {
    return (
      codingAnswers[question.id as string] || {
        code: question.boilerTemplate || '',
        language: 'python' // Default language
      }
    )
  })
  
  // Save answer to context when it changes
  useEffect(() => {
    setCodingAnswers(question.id, answer)
  }, [answer, setCodingAnswers, question.id])

  const handleCodeChange = (code: string | undefined) => {
    if (code !== undefined) {
      setAnswer(prev => ({ ...prev, code }))
    }
  }

  const handleLanguageChange = (language: string) => {
    setAnswer(prev => ({ ...prev, language }))
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Question:</h3>
        <div className="prose dark:prose-invert">
          {question.question}
        </div>
      </div>
      
      {/* {question.driverCode && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <h4 className="text-sm font-medium mb-2">Driver Code:</h4>
          <pre className="text-sm overflow-auto p-2 bg-gray-100 dark:bg-gray-900 rounded">
            {question.driverCode}
          </pre>
        </div>
      )} */}
      
      <div>
        <h4 className="text-sm font-medium mb-2">Your Solution:</h4>
        <EnhancedEditor
          value={answer.code}
          onChange={handleCodeChange}
          language={answer.language}
          height="300px"
          readonly={false}
          onChange={handleCodeChange}

        />
      </div>
    </div>
  )
}

export default Coding