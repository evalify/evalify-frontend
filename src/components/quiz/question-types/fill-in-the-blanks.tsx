import React from "react";
import { BaseQuestion } from "../types/types";
import { useEffect, useCallback, useState } from "react";
import { useQuiz } from "../quiz-context";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type FillInTheBlanksProps = {
  question: BaseQuestion;
};

function FillInTheBlanks({ question }: FillInTheBlanksProps) {
  const { setBlanksAnswers, blanksAnswers } = useQuiz();

  const blankCount = (question.question.match(/___/g) || []).length;
  const [localBlanks, setLocalBlanks] = useState<string[]>(
    Array(blankCount).fill(""),
  );

  // Initialize from saved answers when component mounts or question changes
  useEffect(() => {
    if (blanksAnswers[question.id]) {
      setLocalBlanks(blanksAnswers[question.id].blanks);
    } else {
      const emptyBlanks = Array(blankCount).fill("");
      setLocalBlanks(emptyBlanks);
      setBlanksAnswers(question.id, { blanks: emptyBlanks });
    }
  }, [question.id, blankCount, blanksAnswers, setBlanksAnswers]);

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const newBlanks = [...localBlanks];
      newBlanks[index] = value;
      setLocalBlanks(newBlanks);
      setBlanksAnswers(question.id, { blanks: newBlanks });
    },
    [question.id, localBlanks, setBlanksAnswers],
  );

  // Process the question text to create an array of text fragments and blank positions
  const fragments = question.question
    .split("___")
    .map((part, index, array) => ({
      text: part,
      isLast: index === array.length - 1,
    }));

  return (
    <div className="w-full">
      <Card className="p-6 shadow-md border dark:border-slate-700 bg-card">
        <CardContent className="p-0 ">
          <div className="prose dark:prose-invert max-w-none leading-relaxed text-base sm:text-lg">
            {fragments.map((fragment, index) => (
              <React.Fragment key={index}>
                <span className="text-foreground">{fragment.text}</span>
                {!fragment.isLast && (
                  <span className="relative inline-flex items-center mx-1">
                    <Input
                      type="text"
                      className="inline-block min-w-[100px] w-auto px-3 py-1 h-10 border-b-2 focus:border-primary 
                        border-0 border-b-primary/50 bg-primary/5 rounded-md text-center font-medium shadow-sm
                        focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={blanksAnswers[question.id]?.blanks[index] || ""}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder="_______"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FillInTheBlanks;
