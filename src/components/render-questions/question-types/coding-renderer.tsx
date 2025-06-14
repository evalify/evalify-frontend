import React from "react";
import { CodingQuestion, QuestionConfig, CodingAnswer } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Code,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  FileCode,
  Terminal,
  Eye,
  EyeOff,
} from "lucide-react";

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
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(
    question.language?.[0] || "javascript",
  );
  const [code, setCode] = React.useState<string>(question.boilerCode || "");
  const [isRunning, setIsRunning] = React.useState(false);
  const [showSolution, setShowSolution] = React.useState(false);
  const [testResults, setTestResults] = React.useState<
    Array<{
      id?: string;
      input: unknown[];
      expected: unknown;
      isHidden?: boolean;
      points?: number;
      passed: boolean;
      actualOutput: string;
      executionTime: number;
    }>
  >([]);

  const handleCodeChange = (value: string) => {
    if (config.readOnly) return;

    setCode(value);
    if (onAnswerChange) {
      onAnswerChange({ code: value, language: selectedLanguage });
    }
  };

  const handleLanguageChange = (language: string) => {
    if (config.readOnly) return;

    setSelectedLanguage(language);
    if (onAnswerChange) {
      onAnswerChange({ code, language });
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      const mockResults =
        question.testcases?.map((tc) => ({
          ...tc,
          passed: Math.random() > 0.3, // Random pass/fail for demo
          actualOutput: String(tc.expected || ""), // Mock output using backend format
          executionTime: Math.round(Math.random() * 100),
        })) || [];
      setTestResults(mockResults);
      setIsRunning(false);
    }, 2000);
  };

  // Load user answers if available
  React.useEffect(() => {
    if (config.userAnswers && "code" in config.userAnswers) {
      setCode(config.userAnswers.code);
      if ("language" in config.userAnswers && config.userAnswers.language) {
        setSelectedLanguage(config.userAnswers.language);
      }
    }
  }, [config.userAnswers]);

  const visibleTestCases =
    question.testcases?.filter((tc) => !tc.isHidden) || [];
  const passedTests = testResults.filter((tr) => tr.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-4">
      {/* Function signature */}
      {question.functionName && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">Function Requirements</span>
          </div>
          <div className="font-mono text-sm">
            <span className="text-blue-600">function </span>
            <span className="text-purple-600">{question.functionName}</span>
            <span>(</span>
            {question.params?.map((param, index) => (
              <span key={`param-${index}`}>
                {index > 0 && ", "}
                <span className="text-orange-600">{param.param}</span>
                <span className="text-gray-500">: {param.type}</span>
              </span>
            ))}
            <span>)</span>
            {question.returnType && (
              <>
                <span className="text-gray-500"> → </span>
                <span className="text-green-600">{question.returnType}</span>
              </>
            )}
          </div>
          {question.params && question.params.length > 0 && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {question.params.map((param, index) => (
                <div key={`param-desc-${index}`}>
                  <strong>{param.param}</strong>: {param.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="testcases" className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Test Cases
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-4">
          {/* Language selection */}
          {question.language && question.language.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Language:</label>
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {question.language.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Code editor placeholder */}
          <div className="relative">
            <div className="border rounded-md bg-gray-900 text-green-400 font-mono text-sm">
              <div className="flex items-center justify-between p-2 border-b bg-gray-800">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  <span>
                    main.
                    {selectedLanguage === "javascript"
                      ? "js"
                      : selectedLanguage}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {selectedLanguage}
                </Badge>
              </div>
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Write your code here..."
                disabled={config.readOnly}
                className="w-full h-64 p-4 bg-transparent border-none outline-none resize-none text-green-400 font-mono"
                style={{ backgroundColor: "transparent" }}
              />
            </div>
          </div>

          {/* Run button */}
          {!config.readOnly && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunCode}
                disabled={isRunning || !code.trim()}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Code
                  </>
                )}
              </Button>

              {testResults.length > 0 && (
                <Badge
                  variant={
                    passedTests === totalTests ? "default" : "destructive"
                  }
                  className="ml-2"
                >
                  {passedTests}/{totalTests} tests passed
                </Badge>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="testcases" className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Visible test cases ({visibleTestCases.length} shown):
          </div>

          <div className="space-y-3">
            {visibleTestCases.map((testCase, index) => (
              <Card key={testCase.id || `test-${index}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="outline">Test {index + 1}</Badge>
                    <Badge variant="outline">
                      {testCase.points || 1} points
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Input:
                    </p>
                    <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                      {JSON.stringify(testCase.input)}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Expected Output:
                    </p>
                    <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                      {String(testCase.expected || "")}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Run your code to see test results
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <Card
                  key={result.id || `result-${index}`}
                  className={cn(
                    "border-l-4",
                    result.passed
                      ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-l-red-500 bg-red-50 dark:bg-red-900/20",
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      Test {index + 1}
                      <Badge variant="outline">{result.executionTime}ms</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Expected:
                        </p>
                        <code className="block p-2 bg-white dark:bg-gray-800 rounded">
                          {String(result.expected || "")}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Actual:
                        </p>
                        <code className="block p-2 bg-white dark:bg-gray-800 rounded">
                          {result.actualOutput}
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {/* Driver code */}
      {question.driverCode && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Driver Code:
            </h4>
            <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-x-auto">
              <code>{question.driverCode}</code>
            </pre>
          </div>
        </>
      )}{" "}
      {/* Solution in display/student mode */}
      {(config.showCorrectAnswers || config.mode === "student") &&
        question.answer && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Sample Solution
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSolution(!showSolution)}
                className="text-green-700 hover:text-green-900"
              >
                {showSolution ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
            {showSolution && (
              <pre className="p-3 bg-green-100 dark:bg-green-800 rounded text-sm overflow-x-auto">
                <code>{question.answer}</code>
              </pre>
            )}
          </div>
        )}
    </div>
  );
};
