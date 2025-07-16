import React from "react";
import {
  QuestionRendererProps,
  MCQQuestion,
  MMCQQuestion,
  TrueFalseQuestion,
  FillUpQuestion,
  MatchTheFollowingQuestion,
  DescriptiveQuestion,
  FileUploadQuestion,
  CodingQuestion,
} from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { cn } from "@/lib/utils";
import {
  Edit,
  Trash2,
  Hash,
  Eye,
  EyeOff,
  Lightbulb,
  BookOpen,
  Target,
  Award,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Import question type renderers
import { MCQRenderer } from "./question-types/mcq-renderer";
import { MMCQRenderer } from "./question-types/mmcq-renderer";
import { TrueFalseRenderer } from "./question-types/true-false-renderer";
import { FillUpRenderer } from "./question-types/fill-up-renderer";
import { MatchTheFollowingRenderer } from "./question-types/match-the-following-renderer";
import { DescriptiveRenderer } from "./question-types/descriptive-renderer";
import { FileUploadRenderer } from "./question-types/file-upload-renderer";
import { CodingRenderer } from "./question-types/coding-renderer";

const getDifficultyColor = (difficultyLevel: string) => {
  switch (difficultyLevel) {
    case "EASY":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "HARD":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

const getTaxonomyColor = (taxonomy: string) => {
  switch (taxonomy) {
    case "REMEMBER":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "UNDERSTAND":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
    case "APPLY":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "ANALYSE":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "EVALUATE":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "CREATE":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  config,
  actions,
  onAnswerChange,
  questionNumber,
  className,
}) => {
  const { success: showSuccess } = useToast();
  const [showHint, setShowHint] = React.useState(false);

  // Determine if we should show explanations and correct answers
  const shouldShowCorrectAnswers =
    config.mode === "display" ||
    config.mode === "review" ||
    config.showCorrectAnswers;
  const shouldShowExplanation =
    shouldShowCorrectAnswers || config.showExplanation;
  const shouldShowUserAnswers =
    config.mode === "student" ||
    config.mode === "review" ||
    config.showUserAnswers;
  const shouldHighlightCorrectness =
    config.mode === "review" || config.highlightCorrectness;
  const shouldShowScore = config.mode === "review" || config.showScore;

  const handleEdit = () => {
    if (actions?.onEdit) {
      const questionId = (question as unknown as Record<string, unknown>)
        .questionId as string;
      actions.onEdit(questionId || `question-${questionNumber || 1}`);
    }
  };

  const handleDelete = () => {
    if (actions?.onDelete) {
      const questionId = (question as unknown as Record<string, unknown>)
        .questionId as string;
      actions.onDelete(questionId || `question-${questionNumber || 1}`);
    }
  };

  const handleEditMarks = () => {
    if (actions?.onEditMarks) {
      const currentMarks = (question as unknown as Record<string, unknown>)
        .marks;
      const questionId = (question as unknown as Record<string, unknown>)
        .questionId as string;
      const newMarks = prompt("Enter new marks:", currentMarks?.toString());
      if (newMarks && !isNaN(Number(newMarks))) {
        actions.onEditMarks(
          questionId || `question-${questionNumber || 1}`,
          Number(newMarks),
        );
        showSuccess("Marks updated successfully");
      }
    }
  };

  const renderQuestionContent = () => {
    const enhancedConfig = {
      ...config,
      showCorrectAnswers: shouldShowCorrectAnswers,
      showUserAnswers: shouldShowUserAnswers,
      highlightCorrectness: shouldHighlightCorrectness,
      showScore: shouldShowScore,
    };

    switch (question.type) {
      case "MCQ":
        return (
          <MCQRenderer
            question={question as MCQQuestion}
            config={enhancedConfig}
            onAnswerChange={onAnswerChange}
          />
        );
      case "MMCQ":
        return (
          <MMCQRenderer
            question={question as MMCQQuestion}
            config={enhancedConfig}
            onAnswerChange={onAnswerChange}
          />
        );
      case "TRUEFALSE":
        return (
          <TrueFalseRenderer
            question={question as TrueFalseQuestion}
            config={enhancedConfig}
            onAnswerChange={onAnswerChange}
          />
        );
      case "FILL_UP":
        return (
          <FillUpRenderer
            question={question as FillUpQuestion}
            config={enhancedConfig}
            onAnswerChange={onAnswerChange}
          />
        );
      case "MATCH_THE_FOLLOWING":
        return (
          <MatchTheFollowingRenderer
            question={question as MatchTheFollowingQuestion}
            config={enhancedConfig}
            onAnswerChange={onAnswerChange}
          />
        );
      case "DESCRIPTIVE":
        return (
          <DescriptiveRenderer
            question={question as DescriptiveQuestion}
            config={enhancedConfig}
            onAnswerChange={onAnswerChange}
          />
        );
      case "FILE_UPLOAD":
        return (
          <FileUploadRenderer
            question={question as FileUploadQuestion}
            config={enhancedConfig}
            onAnswerChange={onAnswerChange}
          />
        );
      case "CODING":
        return (
          <CodingRenderer
            question={question as CodingQuestion}
            config={enhancedConfig}
            onAnswerChange={onAnswerChange}
          />
        );
      default:
        return (
          <div className="text-red-500">
            Unknown question type: {question.type}
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <Card className={cn("w-full", config.compact && "shadow-sm", className)}>
        <CardHeader className={cn("pb-4", config.compact && "pb-2")}>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* min-w-0 prevents flex item from overflowing */}
              {/* Question Number and Type */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {questionNumber && (
                  <Badge variant="outline" className="font-mono text-xs">
                    <Hash className="w-3 h-3 mr-1" />
                    {questionNumber}
                  </Badge>
                )}
                <Badge variant="secondary" className="uppercase text-xs">
                  {question.type.replace("_", " ")}
                </Badge>
                {config.showMarks && (
                  <Badge variant="outline" className="font-medium text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    {String(
                      (question as unknown as Record<string, unknown>).marks,
                    )}
                    {(question as unknown as Record<string, unknown>).marks ===
                    1
                      ? " mark"
                      : " marks"}
                  </Badge>
                )}
              </div>
              {/* Metadata Badges */}
              {!config.compact && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {config.showDifficulty && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          className={cn(
                            getDifficultyColor(question.difficulty),
                            "text-xs",
                          )}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          {question.difficulty}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Difficulty Level</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {config.showBloomsTaxonomy && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          className={cn(
                            getTaxonomyColor(
                              String(
                                (question as unknown as Record<string, unknown>)
                                  .bloomsTaxonomy || "",
                              ),
                            ),
                            "text-xs",
                          )}
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          {String(
                            (question as unknown as Record<string, unknown>)
                              .bloomsTaxonomy || "",
                          )}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Bloom&apos;s Taxonomy Level</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {(question as unknown as Record<string, unknown>).co !==
                    undefined &&
                  (question as unknown as Record<string, unknown>).co !==
                    null ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">
                          CO-
                          {String(
                            (question as unknown as Record<string, unknown>).co,
                          )}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Course Outcome {question.co}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : null}

                  {config.showTopics &&
                    question.topics &&
                    question.topics.length > 0 &&
                    question.topics.map((topic) => (
                      <Tooltip key={topic.id}>
                        <TooltipTrigger>
                          <Badge
                            variant="default"
                            className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            {topic.name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Topic: {topic.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                </div>
              )}
            </div>
            {/* Score Display for Student Mode or Review Mode */}
            {shouldShowScore && config.userAnswers ? (
              <div className="flex items-center gap-2 lg:ml-4">
                <Badge
                  className={cn(
                    "text-xs",
                    config.userAnswers.score !== undefined &&
                      config.userAnswers.score > 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                  )}
                >
                  <Award className="w-3 h-3 mr-1" />
                  Score: {config.userAnswers.score ?? 0}/{question.marks}
                </Badge>
              </div>
            ) : (
              config.showActions &&
              actions && (
                <div className="flex items-center gap-1 lg:ml-4 flex-shrink-0">
                  {actions.onEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEdit}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Question</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {actions.onEditMarks && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditMarks}
                          className="h-8 w-8 p-0"
                        >
                          <Award className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Marks</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {actions.onDelete && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDelete}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Question</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )
            )}
          </div>
          {/* Hint Toggle */}
          {config.showHint && question.hintText && (
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-amber-600 hover:text-amber-700 p-0 h-auto text-sm"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">
                  {showHint ? "Hide Hint" : "Show Hint"}
                </span>
                <span className="sm:hidden">{showHint ? "Hide" : "Hint"}</span>
                {showHint ? (
                  <EyeOff className="w-3 h-3 ml-1" />
                ) : (
                  <Eye className="w-3 h-3 ml-1" />
                )}
              </Button>
            </div>
          )}
          {/* Question Text */}
          <div className="question-content">
            <ContentPreview
              content={question.question}
              className="border-none p-0 bg-transparent"
            />
          </div>
          {/* Hint Display */}
          {showHint && question.hintText && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <ContentPreview
                    content={question.hintText}
                    className="border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className={cn("pt-0", config.compact && "px-4 pb-4")}>
          {/* Question Type Specific Content */}
          {renderQuestionContent()}
          {/* Explanation */}
          {shouldShowExplanation && question.explanation && (
            <>
              <Separator className="my-4" />
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Explanation
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <ContentPreview
                    content={question.explanation}
                    className="border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
