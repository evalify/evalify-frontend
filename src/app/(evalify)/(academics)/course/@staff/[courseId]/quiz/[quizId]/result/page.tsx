import UnderDev from "@/components/common/under-development";
import React, { use } from "react";

type Props = {
  params: Promise<{
    courseId: string;
    quizId: string;
  }>;
};

const Page = ({ params }: Props) => {
  const param = use(params);
  const { courseId, quizId } = param;

  return (
    <div>
      <UnderDev
        featureName="Quiz Result Page"
        message={`This page will display the results for quiz ${quizId} in course ${courseId}.`}
      />
    </div>
  );
};

export default Page;
