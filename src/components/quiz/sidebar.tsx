import Timer from "./timer";
import SectionProgress from "./section-progress";
import QuestionGrid from "./question-grid";
import QuestionStats from "./question-stats";
import { QuizData } from "@/components/quiz/types/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface SidebarProps {
  data: QuizData;
  quizId?: string;
  onQuestionChange?: (questionId: number | string) => void;
  onSubmit?: () => void;
}

export default function Sidebar({
  data,
  quizId = "1",
  onQuestionChange,
  onSubmit,
}: SidebarProps) {
  return (
    <Card className="flex flex-col h-full border-0 shadow-none bg-transparent">
      <Timer timeLimit={data.timeLimit} />
      <CardContent className="p-2 flex flex-col gap-2 flex-1">
        <SectionProgress sections={data.sections} questions={data.questions} />
        <div className="flex flex-col flex-1 justify-between h-full">
          <QuestionGrid
            sections={data.sections}
            questions={data.questions}
            quizId={quizId}
            onQuestionChange={onQuestionChange}
          />
          <QuestionStats />
        </div>
      </CardContent>
      <CardFooter className="px-2 pb-2 pt-0">
        <Button
          variant="secondary"
          size="sm"
          className="w-full h-10 text-base font-medium"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
