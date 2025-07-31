import CreateMCQQuestion from "./mcq";
import CreateDescriptiveQuestion from "./descriptive";
import MatchTheFollowingComponent from "./match-the-following";

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

    case "MATCH_THE_FOLLOWING":
      return MatchTheFollowingComponent;

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
