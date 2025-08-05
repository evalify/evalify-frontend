import CreateMCQQuestion from "./mcq";
import CreateDescriptiveQuestion from "./descriptive";
import CreateTrueFalseQuestion from "./true-false";
import MatchTheFollowingComponent from "./match-the-following";
import CreateCodingQuestion from "./coding-question";
import CreateFillUpQuestion from "./fill-up";

export default function QuestionFactory(type: string) {
  switch (type) {
    case "MCQ":
      return CreateMCQQuestion;

    case "MMCQ":
      return CreateMCQQuestion;

    case "TRUEFALSE":
      return CreateTrueFalseQuestion;

    case "FILL_UP":
      return CreateFillUpQuestion;

    case "MATCH_THE_FOLLOWING":
      return MatchTheFollowingComponent;

    case "CODING":
      return CreateCodingQuestion;

    case "file-upload":
      return;

    case "DESCRIPTIVE":
      return CreateDescriptiveQuestion;

    default:
      return null;
  }
}
