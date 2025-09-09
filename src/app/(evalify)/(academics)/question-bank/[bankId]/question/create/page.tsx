"use c"
import QuestionCreation from "@/components/question-creation/question-creation";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  if (!bankId) {
    throw new Error("Bank ID is required");
  }

  const handleSaveAndNew = () => {
    // Simply refresh the current page to create a new question
    // This will reset the form while keeping the same route and parameters
    router.refresh();
  };

  return (
    <QuestionCreation
      bankId={bankId}
      onSaveAndNew={handleSaveAndNew}
    />
  );
}
