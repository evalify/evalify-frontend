"use client";

import NavigationButtons from "./navigation-buttons";
import QuestionFactory from "./question-types/question-factory";
import { useQuiz } from "./quiz-context";
import { QuizData } from "@/components/quiz/types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TestContentProps {
  data: QuizData;
  quizId?: string;
  onQuestionChange?: (questionId: number | string) => void;
}
const questionTypes: Record<string, string> = {
  MCQ: "MCQ",
  TRUEFALSE: "True/False",
  CODING: "Coding",
  FILL_UP: "Fill in the Blank",
  MATCH_THE_FOLLOWING: "Match the following",
  DESCRIPTIVE: "Descriptive",
  MMCQ: "Multiple Select",
  FILE_UPLOAD: "File Upload",
};
export default function TestContent({
  data,
  onQuestionChange,
}: TestContentProps) {
  const {
    currentQuestionId,
    currentSectionId,
    setCurrentQuestionId,
    setCurrentSectionId,
  } = useQuiz();

  const currentQuestion =
    data.questions.find((q) => q.id === currentQuestionId) || data.questions[0];
  const currentSection =
    data.sections.find((s) => s.id === currentSectionId) || data.sections[0];

  // Get questions for the current section
  const currentSectionQuestions = data.questions.filter(
    (q) => q.sectionId === currentSection.id,
  );

  // Find the index within the current section's questions
  const currentQuestionIndexInSection = currentSectionQuestions.findIndex(
    (q) => q.id === currentQuestionId,
  );

  // Find the index in the overall questions array (for display purposes)
  const currentQuestionIndex = data.questions.findIndex(
    (q) => q.id === currentQuestionId,
  );

  // Handle navigation
  const handlePrevious = () => {
    // If not the first question in section, go to previous question in same section
    if (currentQuestionIndexInSection > 0) {
      const prevQuestion =
        currentSectionQuestions[currentQuestionIndexInSection - 1];
      setCurrentQuestionId(prevQuestion.id);

      // Update URL without full refresh if callback is provided
      if (onQuestionChange) {
        onQuestionChange(prevQuestion.id);
      }
    }
    // If first question in section and not in first section, go to last question of previous section
    else if (currentSection.id > 1) {
      const previousSectionId = currentSection.id - 1;
      const previousSectionQuestions = data.questions.filter(
        (q) => q.sectionId === previousSectionId,
      );

      if (previousSectionQuestions.length > 0) {
        const lastQuestionInPrevSection =
          previousSectionQuestions[previousSectionQuestions.length - 1];
        setCurrentSectionId(previousSectionId);
        setCurrentQuestionId(lastQuestionInPrevSection.id);

        // Update URL without full refresh if callback is provided
        if (onQuestionChange) {
          onQuestionChange(lastQuestionInPrevSection.id);
        }
      }
    }
  };

  const handleNext = () => {
    // If not the last question in section, go to next question in same section
    if (currentQuestionIndexInSection < currentSectionQuestions.length - 1) {
      const nextQuestion =
        currentSectionQuestions[currentQuestionIndexInSection + 1];
      setCurrentQuestionId(nextQuestion.id);

      // Update URL without full refresh if callback is provided
      if (onQuestionChange) {
        onQuestionChange(nextQuestion.id);
      }
    }
    // If last question in section and not in last section, go to first question of next section
    else if (currentSection.id < data.sections.length) {
      const nextSectionId = currentSection.id + 1;
      const nextSectionQuestions = data.questions.filter(
        (q) => q.sectionId === nextSectionId,
      );

      if (nextSectionQuestions.length > 0) {
        const firstQuestionInNextSection = nextSectionQuestions[0];
        setCurrentSectionId(nextSectionId);
        setCurrentQuestionId(firstQuestionInNextSection.id);

        // Update URL without full refresh if callback is provided
        if (onQuestionChange) {
          onQuestionChange(firstQuestionInNextSection.id);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <Card className="flex flex-col m-3 p-3">
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl font-bold">{data.title}</h1>
            </CardTitle>
            {/* <CardDescription>
      <h2 className="text-xl">Section {currentSection.id} of {data.sections.length}: {currentSection.name}</h2>
    </CardDescription> */}
            {/* <div className="flex justify-start items-center">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <h2 className="text-xl ml-4">Section {currentSection.id} of {data.sections.length}: {currentSection.name}</h2>
    </div> */}
            <div className="flex justify-between items-center">
              <CardDescription>
                <h2 className="text-xl">
                  Question {currentQuestionIndexInSection + 1} of
                  {currentSectionQuestions.length} (Section {currentSection.id})
                </h2>
              </CardDescription>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {currentQuestion.marks} Marks
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {questionTypes[currentQuestion.type] || currentQuestion.type}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
        <div className="rounded-lg justify-center items-center flex-1 m-4">
          <QuestionFactory question={currentQuestion} />
        </div>
      </div>
      <div className="mt-auto mb-4 m-2">
        <NavigationButtons
          currentIndex={currentQuestionIndex}
          totalQuestions={data.questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
