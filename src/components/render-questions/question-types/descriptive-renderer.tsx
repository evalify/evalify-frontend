import React from "react";
import {
  DescriptiveQuestion,
  QuestionConfig,
  DescriptiveAnswer,
} from "../types";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { BookOpen, FileText } from "lucide-react";

interface DescriptiveRendererProps {
  question: DescriptiveQuestion;
  config: QuestionConfig;
  onAnswerChange?: (answer: DescriptiveAnswer) => void;
}

export const DescriptiveRenderer: React.FC<DescriptiveRendererProps> = ({
  question,
  config,
  onAnswerChange,
}) => {
  const [answer, setAnswer] = React.useState<string>("");
  const [wordCount, setWordCount] = React.useState<number>(0);

  const handleAnswerChange = (value: string) => {
    if (config.readOnly) return;

    setAnswer(value);
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);

    if (onAnswerChange) {
      onAnswerChange({ text: value });
    }
  };

  // Load user answers if available
  React.useEffect(() => {
    if (config.userAnswers && "text" in config.userAnswers) {
      setAnswer(config.userAnswers.text);
      const words = config.userAnswers.text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    }
  }, [config.userAnswers]);

  return (
    <div className="space-y-4">
      {/* Guidelines */}
      {question.guidelines && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Guidelines:
              </p>
              <ContentPreview
                content={question.guidelines}
                className="border-none p-0 bg-transparent text-blue-800 dark:text-blue-200"
              />
            </div>
          </div>
        </div>
      )}
      {/* Answer input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Your Answer:</label>
          <Badge variant="outline" className="text-xs">
            {wordCount} words
          </Badge>
        </div>
        <Textarea
          value={answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Write your detailed answer here..."
          disabled={config.readOnly}
          className="min-h-[200px] resize-vertical"
        />
      </div>
      {/* Expected answer in display/student mode */}
      {(config.showCorrectAnswers || config.mode === "student") &&
        question.expectedAnswer && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Expected Answer:
                </h4>
                <div className="text-sm text-green-800 dark:text-green-200">
                  <ContentPreview
                    content={question.expectedAnswer}
                    className="border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      {/* Evaluation settings */}
      {!config.compact && question.strictness !== undefined && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Evaluation Strictness: {Math.round(question.strictness * 100)}%
        </div>
      )}
    </div>
  );
};
