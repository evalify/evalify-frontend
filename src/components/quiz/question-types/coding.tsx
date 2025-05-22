import React, { useEffect, useState, useRef } from "react";
import { useQuiz } from "../quiz-context";
import { CodingQuestion, CodingAnswer } from "../types/types";
import CodeEditor from "@/components/ui/code-editor";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";

type Props = {
  question: CodingQuestion;
};

function Coding({ question }: Props) {
  const { codingAnswers, setCodingAnswers } = useQuiz();
  const initialLoadRef = useRef(true);
  const defaultTemplateRef = useRef<string>(
    question.boilerTemplate || "# Write your solution here\n",
  );

  // Initialize answer from context or with default values
  const [answer, setAnswer] = useState<CodingAnswer>(() => {
    const defaultFileId = uuidv4();
    const existing = codingAnswers[question.id as string];

    if (existing) {
      return existing;
    }

    return {
      code: question.boilerTemplate || "",
      language: "python", // Default language
      activeFileId: defaultFileId,
      files: [
        {
          id: defaultFileId,
          name: "main.py",
          language: "python",
          content: question.boilerTemplate || "# Write your solution here\n",
        },
      ],
    };
  });

  // Save answer to context when it changes
  useEffect(() => {
    // Don't mark as changed during initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      setCodingAnswers(question.id, answer, false);
      return;
    }

    // Check if the content has been modified from the default template
    const activeFile =
      answer.files.find((f) => f.id === answer.activeFileId) || answer.files[0];
    const isChanged =
      activeFile.content.trim() !== defaultTemplateRef.current.trim();

    setCodingAnswers(question.id, answer, isChanged);
  }, [answer, setCodingAnswers, question.id]);

  const handleCodeChange = (
    files: Array<{
      id: string;
      name: string;
      language: string;
      content: string;
    }>,
  ) => {
    setAnswer((prev) => {
      const activeFile =
        files.find((f) => f.id === prev.activeFileId) || files[0];
      return {
        ...prev,
        files,
        code: activeFile.content,
        language: activeFile.language,
      };
    });
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6 space-y-4">
        <CardTitle>{question.question}</CardTitle>
        <CodeEditor
          files={answer.files}
          activeFileId={answer.activeFileId || answer.files[0].id}
          onFileChange={handleCodeChange}
          onActiveFileChange={(fileId) =>
            setAnswer((prev) => ({ ...prev, activeFileId: fileId }))
          }
          driverCode={question.driverCode || ""}
          showConsole={true}
        />
      </CardContent>
    </Card>
  );
}

export default Coding;
