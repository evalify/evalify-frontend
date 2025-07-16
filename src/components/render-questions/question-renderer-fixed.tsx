import React from "react";
import { QuestionRendererProps } from "./types";
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

import { MCQRenderer } from "./question-types/mcq-renderer";
import { MMCQRenderer } from "./question-types/mmcq-renderer";
import { TrueFalseRenderer } from "./question-types/true-false-renderer";
import { FillUpRenderer } from "./question-types/fill-up-renderer";
import { MatchTheFollowingRenderer } from "./question-types/match-the-following-renderer";
import { DescriptiveRenderer } from "./question-types/descriptive-renderer";
import { FileUploadRenderer } from "./question-types/file-upload-renderer";
import { CodingRenderer } from "./question-types/coding-renderer";

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
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
  const [showExplanation] = React.useState(
    config.showCorrectAnswers || config.mode === "student",
  );

  // Type for question with marks property
  type QuestionWithMarks = typeof question & { marks: number };

  // Type guard to check if question has marks property
  const hasMarks = (q: typeof question): q is QuestionWithMarks => {
    return "marks" in q && typeof q.marks === "number";
  };

  const getQuestionMarks = (q: typeof question): number => {
    return hasMarks(q) ? q.marks : 1;
  };

  const handleEdit = () => {
    if (actions?.onEdit && question.id) {
      actions.onEdit(question.id);
    }
  };

  const handleDelete = () => {
    if (actions?.onDelete && question.id) {
      actions.onDelete(question.id);
    }
  };

  const handleEditMarks = () => {
    if (actions?.onEditMarks && question.id) {
      const currentMarks = getQuestionMarks(question);
      const newMarks = prompt("Enter new marks:", currentMarks.toString());
      if (newMarks && !isNaN(Number(newMarks))) {
        actions.onEditMarks(question.id, Number(newMarks));
        showSuccess("Marks updated successfully");
      }
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case "MCQ":
        return (
          <MCQRenderer
            question={question}
            config={config}
            onAnswerChange={onAnswerChange}
          />
        );
      case "MMCQ":
        return (
          <MMCQRenderer
            question={question}
            config={config}
            onAnswerChange={onAnswerChange}
          />
        );
      case "TRUEFALSE":
        return (
          <TrueFalseRenderer
            question={question}
            config={config}
            onAnswerChange={onAnswerChange}
          />
        );
      case "FILL_UP":
        return (
          <FillUpRenderer
            question={question}
            config={config}
            onAnswerChange={onAnswerChange}
          />
        );
      case "MATCH_THE_FOLLOWING":
        return (
          <MatchTheFollowingRenderer
            question={question}
            config={config}
            onAnswerChange={onAnswerChange}
          />
        );
      case "DESCRIPTIVE":
        return (
          <DescriptiveRenderer
            question={question}
            config={config}
            onAnswerChange={onAnswerChange}
          />
        );
      case "FILE_UPLOAD":
        return (
          <FileUploadRenderer
            question={question}
            config={config}
            onAnswerChange={onAnswerChange}
          />
        );
      case "CODING":
        return (
          <CodingRenderer
            question={question}
            config={config}
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Question Number and Type */}
              <div className="flex items-center gap-2 mb-3">
                {questionNumber && (
                  <Badge variant="outline" className="font-mono">
                    <Hash className="w-3 h-3 mr-1" />
                    {questionNumber}
                  </Badge>
                )}
                <Badge variant="secondary" className="uppercase">
                  {question.type.replace("_", " ")}
                </Badge>
                {config.showMarks && (
                  <Badge variant="outline" className="font-medium">
                    <Award className="w-3 h-3 mr-1" />
                    {getQuestionMarks(question)}{" "}
                    {getQuestionMarks(question) === 1 ? "mark" : "marks"}
                  </Badge>
                )}
              </div>

              {/* Metadata Badges */}
              {!config.compact && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {config.showDifficulty && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          className={getDifficultyColor(question.difficulty)}
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
                          className={getTaxonomyColor(question.bloomsTaxonomy)}
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          {question.bloomsTaxonomy}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Bloom&apos;s Taxonomy Level</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {question.co && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline">CO-{question.co}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Course Outcome {question.co}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {config.showTopics &&
                    question.topics?.map((topic) => (
                      <Badge
                        key={topic.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {topic.name}
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {config.showActions && actions && (
              <div className="flex items-center gap-1 ml-4">
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
            )}
          </div>

          {/* Hint Toggle */}
          {config.showHint && question.hintText && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-amber-600 hover:text-amber-700 p-0 h-auto"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                {showHint ? "Hide Hint" : "Show Hint"}
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
          {config.showExplanation &&
            question.explanation &&
            showExplanation && (
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
