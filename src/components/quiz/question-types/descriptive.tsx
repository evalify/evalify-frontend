"use client";

import React, { useState, useEffect } from "react";
import { DescriptiveQuestion } from "@/components/quiz/types/types";
import { Textarea } from "@/components/ui/textarea";
import { useQuiz } from "../quiz-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DescriptiveQuestionProps {
  question: DescriptiveQuestion;
}

function DescriptiveQuestionComponent({ question }: DescriptiveQuestionProps) {
  const { descriptiveAnswers, setDescriptiveAnswers } = useQuiz();
  const [answer, setAnswer] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);

  // Initialize from saved answers if available
  useEffect(() => {
    if (descriptiveAnswers[question.id]) {
      setAnswer(descriptiveAnswers[question.id].text);
      setWordCount(countWords(descriptiveAnswers[question.id].text));
    }
  }, [descriptiveAnswers, question.id]);

  // Count words in text
  const countWords = (text: string): number => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setAnswer(newText);
    setWordCount(countWords(newText));

    // Save to context
    setDescriptiveAnswers(question.id, { text: newText });
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-4 space-y-4">
        <div className="text-lg font-medium">{question.question}</div>

        <Textarea
          placeholder="Type your answer here..."
          className="min-h-[200px] w-full"
          value={answer}
          onChange={handleTextChange}
        />

        <div className="flex justify-between text-sm text-muted-foreground">
          <Badge variant="outline">Word count: {wordCount}</Badge>
          {question.maxWordLimit && (
            <Badge
              variant={
                wordCount > question.maxWordLimit ? "destructive" : "outline"
              }
            >
              {wordCount > question.maxWordLimit ? "Exceeded " : ""}
              Max words: {question.maxWordLimit}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DescriptiveQuestionComponent;
