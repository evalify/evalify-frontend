import CreateMCQQuestion from "./mcq";

export default function QuestionFactory(type: string) {
  switch (type) {
    case "MCQ":
      return CreateMCQQuestion;

    case "MMCQ":
      return;

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

    case "descriptive":
      return;

    default:
      return null;
  }
}
