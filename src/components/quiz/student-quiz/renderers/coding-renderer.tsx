/**
 * Coding Question Renderer Component
 */

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code } from "lucide-react";
import { CodingQuestion } from "../types/quiz-types";

interface CodingRendererProps {
  questionData: CodingQuestion;
  currentAnswer: string | null;
  onAnswerChange: (answer: string) => void;
  isReadOnly?: boolean;
  className?: string;
}

export const CodingRenderer: React.FC<CodingRendererProps> = ({
  questionData,
  currentAnswer,
  onAnswerChange,
  isReadOnly = false,
  className = "",
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    questionData.language[0] || "python",
  );
  const [code, setCode] = useState(currentAnswer || "");

  // Debounce the answer change to avoid too frequent updates
  const debouncedOnAnswerChange = useCallback(
    (value: string) => {
      onAnswerChange(value);
    },
    [onAnswerChange],
  );

  const handleCodeChange = (value: string) => {
    if (isReadOnly) return;

    setCode(value);
    debouncedOnAnswerChange(value);
  };

  const getLanguageTemplate = (language: string) => {
    switch (language.toLowerCase()) {
      case "python":
        return `def solution():\n    # Write your code here\n    pass\n`;
      case "javascript":
        return `function solution() {\n    // Write your code here\n}\n`;
      case "java":
        return `public class Solution {\n    public void solution() {\n        // Write your code here\n    }\n}\n`;
      case "cpp":
        return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n`;
      default:
        return `// Write your code here\n`;
    }
  };

  const insertTemplate = () => {
    if (isReadOnly) return;

    const template = getLanguageTemplate(selectedLanguage);
    setCode(template);
    onAnswerChange(template);
  };

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <div
              className="text-lg font-medium prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: questionData.question }}
            />
            {questionData.hint && (
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                <strong>Hint:</strong> {questionData.hint}
              </div>
            )}
          </div>

          {/* Language Selection and Tools */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="text-sm font-medium">Language:</span>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                disabled={isReadOnly}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionData.language.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isReadOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={insertTemplate}
                className="text-xs"
              >
                Insert Template
              </Button>
            )}
          </div>

          {/* Code Editor and Test Cases */}
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code">Code Editor</TabsTrigger>
              <TabsTrigger value="driver">Driver Code</TabsTrigger>
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your Solution:</span>
                  <div className="text-xs text-muted-foreground">
                    {lineCount} lines, {charCount} characters
                  </div>
                </div>
                <Textarea
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder={`Write your ${selectedLanguage} code here...`}
                  disabled={isReadOnly}
                  className="min-h-64 font-mono text-sm resize-y"
                  style={{
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    tabSize: 4,
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="driver" className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Driver Code:</span>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {questionData.driverCode}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="testcases" className="space-y-4">
              <div className="space-y-4">
                <span className="text-sm font-medium">Test Cases:</span>
                {questionData.testcases.map((testcase, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            testcase.tags === "SAMPLE" ? "default" : "secondary"
                          }
                        >
                          {testcase.tags} Test Case {index + 1}
                        </Badge>
                        <Badge variant="outline">{testcase.language}</Badge>
                      </div>
                      <pre className="text-sm font-mono bg-muted p-3 rounded whitespace-pre-wrap">
                        {testcase.code}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
