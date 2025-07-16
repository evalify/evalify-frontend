import { QuestionCreationPage } from "@/components/question_creation";
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

  return <QuestionCreationPage bankId={bankId} />;
}
