import QuestionCreation from "@/components/question-creation/question-creation";
import { use } from "react";

export default function CreateQuestionPage({
  params,
}: {
  params: Promise<{
    bankId: string;
  }>;
}) {
  const param = use(params);
  const { bankId } = param;

  if (!bankId) {
    throw new Error("Bank ID is required");
  }

  return <QuestionCreation bankId={bankId} />;
}
