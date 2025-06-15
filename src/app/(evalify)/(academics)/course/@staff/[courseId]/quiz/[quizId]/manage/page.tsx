import { QuizCreationTabs } from "@/components/quiz-creation/quiz-creation-tabs";
import { use } from "react";

export default function CreateQuizPage({
  params,
}: {
  params: Promise<{
    courseId: string;
    quizId: string;
  }>;
}) {
  const param = use(params);
  const { courseId, quizId } = param;

  if (quizId === "create") {
    return <QuizCreationTabs courseId={courseId} />;
  } else {
    return (
      <QuizCreationTabs courseId={courseId} quizId={quizId} isEdit={true} />
    );
  }
}
