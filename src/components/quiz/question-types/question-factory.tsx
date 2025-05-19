import React from 'react'
import MCQ from './mcq'
import { BaseQuestion, MCQQuestion, MatchtheFollowingQuestion, DescriptiveQuestion, CodingQuestion } from '@/components/quiz/types/types'
import MatchTheFollowingQuestion from './match-the-following'
import FillInTheBlanks from './fill-in-the-blanks'
import DescriptiveQuestionComponent from './descriptive'
import Coding from './coding'

type QuestionFactoryProps = {
  question: BaseQuestion
}

function QuestionFactory({ question }: QuestionFactoryProps) {
  switch (question.type) {
    case "MCQ":
      return <MCQ question={question as MCQQuestion} />
    case "CODING":
      return <Coding question={question as CodingQuestion} />
    case "MATCH_THE_FOLLOWING":
      return <MatchTheFollowingQuestion
          question={question as MatchtheFollowingQuestion}
        />
    case "DESCRIPTIVE":
      return <DescriptiveQuestionComponent question={question as DescriptiveQuestion} />
    case "TRUE_FALSE":
      return <div>True or False</div>
    case "FILL_IN_THE_BLANKS":
      return <FillInTheBlanks question={question} />
    case "FILE_UPLOAD":
      return <div>File Upload</div>
    default:
      return <div>Unknown Question Type</div>
  }
}

export default QuestionFactory