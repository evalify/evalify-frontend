import CreateMCQQuestion from "./mcq";
import CreateDescriptiveQuestion from "./descriptive";

export default function QuestionFactory(type: string) {
  switch (type) {
    case "MCQ":
      return CreateMCQQuestion;

    case "MMCQ":
      return CreateMCQQuestion;

    case "true-false":
      return;

    case "fillup":
      return;

    case "match-following":
      return;

    case "coding":
      return;

    case "file-upload":
      return;

    case "DESCRIPTIVE":
      return CreateDescriptiveQuestion;

    default:
      return null;
  }
}
