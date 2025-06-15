import React, { use } from "react";

export default function ManageQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  const param = use(params);
  const { courseId, quizId } = param;
  return (
    <div>
      Manage Quiz Page {courseId} {quizId}
    </div>
  );
}
