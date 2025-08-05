import { DescriptiveQuestion } from "@/components/question-creation/question-types/descriptive-question";
import { useEffect, useState, useCallback } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, FileText, Edit3 } from "lucide-react";
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
        negativeMarks: settings?.negativeMarks || 0,
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
          negativeMarks: settings.negativeMarks,
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

  const handleSaveQuestion = () => {
    if (question && onSave) {
      onSave(question);
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
            <Label htmlFor="strictness">
              Evaluation Strictness: {question?.strictness || 50}%
            </Label>
            <Slider
              id="strictness"
              min={0}
              max={100}
              step={5}
              value={[question?.strictness || 50]}
              onValueChange={handleStrictnessChange}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>Lenient</span>
              <span>Strict</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveQuestion}
          disabled={!question?.question?.trim()}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Question
        </Button>
      </div>
    </div>
  );
}
