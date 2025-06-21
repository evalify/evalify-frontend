import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Question } from "@/lib/types";
import { banks } from "@/lib/question-banks";
import { BookOpen, Award, Brain, Hash, Database } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function QuestionCard({
  question,
  selectable = false,
  isSelected = false,
  onSelect,
}: QuestionCardProps) {
  return (
    <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border">
        <div className="flex items-center">
          {selectable && (
            <Checkbox
              id={`select-${question.id}`}
              checked={isSelected}
              onCheckedChange={onSelect}
              className="mr-3 h-5 w-5"
            />
          )}
          <div className="font-semibold flex items-center">
            <Hash className="w-4 h-4 mr-1 text-muted-foreground" />
            Question {question.number}
            <Badge variant="outline" className="ml-2">
              {question.marks} Marks
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge variant="secondary">{question.type}</Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Award className="w-3 h-3" /> CO{question.courseOutcome}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="w-3 h-3" /> {question.bloomsTaxonomy}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
              <BookOpen className="w-4 h-4 mr-1" /> Description
            </h3>
            <div className="text-sm bg-muted/50 p-3 rounded-md border border-border">
              {question.description}
            </div>
          </div>

          {question.options && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Options
              </h3>
              <div className="text-sm bg-muted/50 p-3 rounded-md border border-border">
                <ul className="space-y-2">
                  {question.options.map((option) => (
                    <li
                      key={option.id}
                      className={`flex items-start ${option.isCorrect ? "text-green-600 dark:text-green-400 font-medium" : ""}`}
                    >
                      <span className="mr-2">{option.id.toUpperCase()})</span>
                      <span>{option.text}</span>
                      {option.isCorrect && (
                        <span className="ml-2 text-xs italic">(correct)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Answer
            </h3>
            <div className="text-sm bg-muted/50 p-3 rounded-md border border-border">
              {question.answer}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {question.topic && (
              <Badge variant="outline" className="text-xs">
                Topic: {question.topic}
              </Badge>
            )}
            {question.difficulty && (
              <Badge variant="outline" className="text-xs">
                Difficulty: {question.difficulty}
              </Badge>
            )}
            {question.source && (
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                <Database className="w-3 h-3" />
                {banks[question.source]?.name || question.source}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
