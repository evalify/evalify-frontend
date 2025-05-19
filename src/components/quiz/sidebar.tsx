// import Timer from "./timer"
import SectionProgress from "./section-progress"
import QuestionGrid from "./question-grid"
import QuestionStats from "./question-stats"
import { QuizData } from "@/components/quiz/types/types"

interface SidebarProps {
  data: QuizData
}

export default function Sidebar({ data }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* <Timer timeLimit={data.timeLimit} /> */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        <SectionProgress sections={data.sections} questions={data.questions} />
        <QuestionGrid sections={data.sections} questions={data.questions} />
        <QuestionStats />
        <button className="mt-auto bg-gray-200 text-black hover:bg-gray-300 py-4 rounded-lg text-xl font-semibold">
          Submit
        </button>
      </div>
    </div>
  )
}
