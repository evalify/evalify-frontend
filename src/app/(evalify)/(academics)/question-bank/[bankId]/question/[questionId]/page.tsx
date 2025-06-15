import { QuestionCreationPage } from "@/components/question_creation";
import { use } from "react";

export default function CreateQuestionPage({
  params,
}: {
  params: Promise<{
    bankId: string;
    questionId: string;
  }>;
}) {
  const param = use(params);
  const { bankId, questionId } = param;

  if (!bankId) {
    throw new Error("Bank ID is required");
  }
  if (questionId === "create") {
    return <QuestionCreationPage />;
  } else {
    return <QuestionCreationPage questionId={questionId} isEdit={true} />;
  }
}
