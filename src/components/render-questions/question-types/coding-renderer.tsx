import React, { useState, useEffect } from "react";
import {
  CodingQuestion,
  QuestionConfig,
  CodingAnswer,
  TestResult,
} from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { Code, Play, TestTube, Eye, EyeOff } from "lucide-react";

interface CodingRendererProps {
  question: CodingQuestion;
  config: QuestionConfig;
  onAnswerChange?: (answer: CodingAnswer) => void;
}

export const CodingRenderer: React.FC<CodingRendererProps> = ({
  question,
  config,
  onAnswerChange,
}) => {
  const [code, setCode] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [showSampleTests, setShowSampleTests] = useState<boolean>(true);
  const [testResults, setTestResults] = useState<{
    passed: number;
    total: number;
    details?: TestResult[];
  } | null>(null);

  // Initialize from existing answer or boilerplate
  useEffect(() => {
    if (config.userAnswers && "code" in config.userAnswers) {
      setCode(config.userAnswers.code);
      setSelectedLanguage(config.userAnswers.language || "");
    } else if (question.boilerCode) {
      setCode(question.boilerCode);
    }

    // Set default language
    if (question.language && question.language.length > 0) {
      setSelectedLanguage(question.language[0]);
    }
  }, [config.userAnswers, question.boilerCode, question.language]);

  const handleCodeChange = (newCode: string) => {
    if (config.readOnly) return;

    setCode(newCode);
    if (onAnswerChange) {
      onAnswerChange({
        code: newCode,
        language: selectedLanguage,
        testResults: testResults || undefined,
      });
    }
  };

  const handleLanguageChange = (language: string) => {
    if (config.readOnly) return;

    setSelectedLanguage(language);
    if (onAnswerChange) {
      onAnswerChange({
        code,
        language,
        testResults: testResults || undefined,
      });
    }
  };

  const runTests = () => {
    // This would typically call an API to run the code
    console.log("Running tests for:", { code, language: selectedLanguage });
    // Mock test results - simplified for demo
    const mockResults = {
      passed: 2,
      total: 4,
    };
    setTestResults(mockResults);
  };

  const getSampleTestCases = () => {
    return question.testcases?.filter((test) => test.tags === "SAMPLE") || [];
  };

  const getLanguageDisplayName = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      python: "Python",
      javascript: "JavaScript",
      java: "Java",
      cpp: "C++",
      c: "C",
      julia: "Julia",
      rust: "Rust",
      go: "Go",
    };
    return languageMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="space-y-2">
        <ContentPreview content={question.question} />

        {question.hintText && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-400 rounded-r">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Hint:</strong> {question.hintText}
            </p>
          </div>
        )}
      </div>

      {/* Language Selection */}
      {question.language && question.language.length > 1 && (
        <div className="space-y-2">
          <Label>Programming Language</Label>
          <Select
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            disabled={config.readOnly}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {question.language.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {getLanguageDisplayName(lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Your Solution</Label>
          <div className="flex items-center gap-2">
            {selectedLanguage && (
              <Badge variant="secondary">
                <Code className="w-3 h-3 mr-1" />
                {getLanguageDisplayName(selectedLanguage)}
              </Badge>
            )}
            {!config.readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={runTests}
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                Run Tests
              </Button>
            )}
          </div>
        </div>

        <Textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="Write your code here..."
          className="font-mono text-sm min-h-[300px]"
          readOnly={config.readOnly}
        />
      </div>

      {/* Driver Code (if available) */}
      {question.driverCode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Driver Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-3 rounded text-sm font-mono overflow-x-auto">
              <code>{question.driverCode}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Sample Test Cases */}
      {getSampleTestCases().length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Sample Test Cases
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSampleTests(!showSampleTests)}
              >
                {showSampleTests ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {showSampleTests && (
            <CardContent className="space-y-3">
              {getSampleTestCases().map((testCase, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Test {index + 1}</Badge>
                    <Badge variant="secondary">
                      {getLanguageDisplayName(testCase.language)}
                    </Badge>
                    {testCase.isMinimal && (
                      <Badge variant="outline" className="text-xs">
                        Minimal
                      </Badge>
                    )}
                  </div>
                  <pre className="bg-muted p-3 rounded text-sm font-mono overflow-x-auto">
                    <code>{testCase.code}</code>
                  </pre>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Test Results
              <Badge
                variant={
                  testResults.passed === testResults.total
                    ? "default"
                    : "destructive"
                }
                className="ml-2"
              >
                {testResults.passed}/{testResults.total} Passed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Test execution completed. {testResults.passed} out of{" "}
              {testResults.total} tests passed.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explanation (if available and showing explanations) */}
      {config.showExplanation && question.explanation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentPreview content={question.explanation} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodingRenderer;
