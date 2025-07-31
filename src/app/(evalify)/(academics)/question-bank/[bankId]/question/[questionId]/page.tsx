import QuestionCreation from "@/components/question-creation-new/question-creation";
import { use } from "react";

export default function EditQuestionPage({
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

  return (
    <QuestionCreation
      questionId={questionId}
      bankId={bankId}
      isEditing={true}
    />
  );
}
