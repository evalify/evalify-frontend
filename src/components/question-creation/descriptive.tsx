import { DescriptiveQuestion } from "@/components/question-creation/question-types/descriptive-question";
import { useEffect, useState, useCallback } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Edit3 } from "lucide-react";
import { QuestionSettings } from "@/components/question-creation/settings-types/settings-types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CreateDescriptiveQuestionProps {
  type: "DESCRIPTIVE";
  isEditing: boolean;
  questionId?: string;
  questionData?: DescriptiveQuestion;
  settings?: QuestionSettings;
  onSave?: (question: DescriptiveQuestion) => void;
}

export default function CreateDescriptiveQuestion({
  isEditing,
  questionData,
  settings,
  onSave,
}: CreateDescriptiveQuestionProps) {
  const [question, setQuestion] = useState<DescriptiveQuestion | null>(null);

  const createNewQuestion = useCallback(
    (questionText: string = ""): DescriptiveQuestion => {
      return {
        type: "DESCRIPTIVE",
        question: questionText,
        topicIds: settings?.topicIds || [],
        marks: settings?.marks || 1,
        difficulty: settings?.difficulty || "MEDIUM",
        bloomsTaxonomy: settings?.bloomsTaxonomy || "REMEMBER",
        co: settings?.co || 1,
        negativeMark: settings?.negativeMark || 0,
        expectedAnswer: "",
        strictness: 50,
        guidelines: "",
      };
    },
    [settings],
  );

  useEffect(() => {
    if (question && onSave) {
      onSave(question);
    }
  }, [question, onSave]);

  useEffect(() => {
    if (questionData && isEditing) {
      setQuestion(questionData);
    }
  }, [questionData, isEditing]);

  useEffect(() => {
    if (settings) {
      setQuestion((prev) => {
        if (!prev) {
          return createNewQuestion();
        }
        return {
          ...prev,
          type: "DESCRIPTIVE",
          marks: settings.marks,
          difficulty: settings.difficulty,
          bloomsTaxonomy: settings.bloomsTaxonomy,
          co: settings.co,
          negativeMark: settings.negativeMark,
          topicIds: settings.topicIds,
        };
      });
    }
  }, [settings, createNewQuestion]);

  const handleQuestionChange = (content: string) => {
    if (question) {
      setQuestion({
        ...question,
        question: content,
      });
    } else {
      setQuestion(createNewQuestion(content));
    }
  };

  const handleExpectedAnswerChange = (content: string) => {
    if (question) {
      setQuestion({
        ...question,
        expectedAnswer: content,
      });
    }
  };

  const handleGuidelinesChange = (content: string) => {
    if (question) {
      setQuestion({
        ...question,
        guidelines: content,
      });
    }
  };

  const handleStrictnessChange = (value: number[]) => {
    if (question) {
      setQuestion({
        ...question,
        strictness: value[0],
      });
    }
  };

  const handleStrictnessLabelClick = (
    level: "lenient" | "medium" | "strict",
  ) => {
    if (question) {
      let newStrictness: number;
      switch (level) {
        case "lenient":
          newStrictness = -1;
          break;
        case "medium":
          newStrictness = 50;
          break;
        case "strict":
          newStrictness = 100;
          break;
        default:
          newStrictness = 50;
      }
      setQuestion({
        ...question,
        strictness: newStrictness,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question?.question || ""}
            onUpdate={handleQuestionChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Expected Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={question?.expectedAnswer || ""}
            onUpdate={handleExpectedAnswerChange}
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="guidelines">Guidelines (Optional)</Label>
            <TiptapEditor
              initialContent={question?.guidelines || ""}
              onUpdate={handleGuidelinesChange}
              className="min-h-[100px] mt-2"
            />
          </div>

          <div>
            <Label htmlFor="strictness" className="text-base font-medium">
              Evaluation Strictness
            </Label>
            <div className="mt-6 space-y-6">
              {/* Strictness Level Display */}
              <div className="flex justify-center">
                <div
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm ${
                    (question?.strictness || 50) <= 25
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                      : (question?.strictness || 50) <= 75
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {(question?.strictness || 50) <= 25
                    ? "Lenient Evaluation"
                    : (question?.strictness || 50) <= 75
                      ? "Medium Evaluation"
                      : "Strict Evaluation"}
                </div>
              </div>

              {/* Custom Slider Container */}
              <div className="relative px-2 sm:px-4">
                <div className="relative">
                  {/* Background gradient track */}
                  <div className="absolute top-1/2 left-0 right-0 h-3 sm:h-4 -translate-y-1/2 -z-10 rounded-full bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 dark:from-green-800/60 dark:via-yellow-800/60 dark:to-red-800/60 shadow-inner" />

                  {/* Slider */}
                  <Slider
                    id="strictness"
                    min={-1}
                    max={100}
                    step={50}
                    value={[question?.strictness || 50]}
                    onValueChange={handleStrictnessChange}
                    className="relative z-10"
                  />
                </div>

                {/* Tick marks */}
                <div className="absolute top-1/2 left-0 right-0 flex justify-between px-1 sm:px-2 -translate-y-1/2 pointer-events-none">
                  <div className="w-0.5 h-4 sm:h-5 bg-green-600/60 dark:bg-green-400/60 rounded-full" />
                  <div className="w-0.5 h-4 sm:h-5 bg-yellow-600/60 dark:bg-yellow-400/60 rounded-full" />
                  <div className="w-0.5 h-4 sm:h-5 bg-red-600/60 dark:bg-red-400/60 rounded-full" />
                </div>
              </div>

              {/* Labels with descriptions - Responsive layout */}
              <div className="space-y-4 sm:space-y-0">
                {/* Mobile: Stacked layout */}
                <div className="block sm:hidden space-y-3">
                  <div
                    onClick={() => handleStrictnessLabelClick("lenient")}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95 ${
                      (question?.strictness || 50) <= 25
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 ring-2 ring-green-300 dark:ring-green-600"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 hover:bg-green-50/50 dark:hover:bg-green-900/10"
                    }`}
                  >
                    <div className="font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Lenient
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Flexible evaluation, accepts varied answers
                    </div>
                  </div>

                  <div
                    onClick={() => handleStrictnessLabelClick("medium")}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95 ${
                      (question?.strictness || 50) > 25 &&
                      (question?.strictness || 50) <= 75
                        ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 ring-2 ring-yellow-300 dark:ring-yellow-600"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10"
                    }`}
                  >
                    <div className="font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Medium
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Balanced evaluation, moderate requirements
                    </div>
                  </div>

                  <div
                    onClick={() => handleStrictnessLabelClick("strict")}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95 ${
                      (question?.strictness || 50) > 75
                        ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 ring-2 ring-red-300 dark:ring-red-600"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 hover:bg-red-50/50 dark:hover:bg-red-900/10"
                    }`}
                  >
                    <div className="font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Strict
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Precise evaluation, exact answers required
                    </div>
                  </div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden sm:grid grid-cols-3 gap-3 text-sm">
                  <div
                    onClick={() => handleStrictnessLabelClick("lenient")}
                    className={`text-center p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95 ${
                      (question?.strictness || 50) <= 25
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 scale-105 ring-2 ring-green-300 dark:ring-green-600"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 hover:bg-green-50/50 dark:hover:bg-green-900/10 hover:scale-105"
                    }`}
                  >
                    <div className="font-medium text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Lenient
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Flexible evaluation, accepts varied answers
                    </div>
                  </div>

                  <div
                    onClick={() => handleStrictnessLabelClick("medium")}
                    className={`text-center p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95 ${
                      (question?.strictness || 50) > 25 &&
                      (question?.strictness || 50) <= 75
                        ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 scale-105 ring-2 ring-yellow-300 dark:ring-yellow-600"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10 hover:scale-105"
                    }`}
                  >
                    <div className="font-medium text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Medium
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Balanced evaluation, moderate requirements
                    </div>
                  </div>

                  <div
                    onClick={() => handleStrictnessLabelClick("strict")}
                    className={`text-center p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95 ${
                      (question?.strictness || 50) > 75
                        ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 scale-105 ring-2 ring-red-300 dark:ring-red-600"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 hover:bg-red-50/50 dark:hover:bg-red-900/10 hover:scale-105"
                    }`}
                  >
                    <div className="font-medium text-red-700 dark:text-red-400 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Strict
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Precise evaluation, exact answers required
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
