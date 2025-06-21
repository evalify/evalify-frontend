"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Code, FileText, Settings, TestTube } from "lucide-react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import CodeEditor from "@/components/ui/code-editor";
import { nanoid } from "nanoid";
import {
  FunctionParameter,
  TestCase,
  FunctionMetadata,
  SUPPORTED_LANGUAGES,
} from "../types";

// Helper function to get default return values for different languages and types
const getDefaultValue = (type: string, language: string): string => {
  const defaults: Record<string, Record<string, string>> = {
    java: {
      int: "0",
      float: "0.0f",
      string: '""',
      boolean: "false",
      list: "new ArrayList<>()",
    },
    cpp: {
      int: "0",
      float: "0.0f",
      string: '""',
      boolean: "false",
      list: "{}",
    },
  };
  return defaults[language]?.[type] || (language === "java" ? "null" : "0");
};

interface CodingQuestionProps {
  question: string;
  language: string;
  starterCode?: string;
  testCases: TestCase[];
  explanation?: string;
  showExplanation: boolean;
  functionName?: string;
  functionMetadata?: FunctionMetadata;
  onQuestionChange: (question: string) => void;
  onLanguageChange: (language: string) => void;
  onStarterCodeChange: (starterCode: string) => void;
  onTestCasesChange: (testCases: TestCase[]) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (showExplanation: boolean) => void;
  onFunctionMetadataChange?: (metadata: FunctionMetadata) => void;
}

// Utility function to generate boilerplate code
const generateBoilerplateCode = (metadata: FunctionMetadata): string => {
  const { name, parameters, returnType, language } = metadata;

  switch (language) {
    case "python": {
      const pythonParams = parameters.map((p) => p.name).join(", ");
      return `def ${name}(${pythonParams}):\n    # TODO: Implement the function\n    pass`;
    }

    case "javascript": {
      const jsParams = parameters.map((p) => p.name).join(", ");
      return `function ${name}(${jsParams}) {\n    // TODO: Implement the function\n    \n}`;
    }

    case "java": {
      const javaParams = parameters
        .map((p) => `${p.type} ${p.name}`)
        .join(", ");
      const defaultReturn =
        returnType === "void"
          ? ""
          : `\n    return ${getDefaultValue(returnType, "java")};`;
      return `public ${returnType} ${name}(${javaParams}) {\n    // TODO: Implement the function${defaultReturn}\n}`;
    }

    case "cpp": {
      const cppParams = parameters.map((p) => `${p.type} ${p.name}`).join(", ");
      const defaultReturn =
        returnType === "void"
          ? ""
          : `\n    return ${getDefaultValue(returnType, "cpp")};`;
      return `${returnType} ${name}(${cppParams}) {\n    // TODO: Implement the function${defaultReturn}\n}`;
    }

    default:
      return `// Function: ${name}\n// TODO: Implement the function`;
  }
};

const CodingQuestion: React.FC<CodingQuestionProps> = ({
  question,
  language,
  starterCode = "",
  testCases,
  explanation,
  showExplanation,
  functionName,
  functionMetadata: initialFunctionMetadata,
  onQuestionChange,
  onLanguageChange,
  onStarterCodeChange,
  onTestCasesChange,
  onExplanationChange,
  onShowExplanationChange,
  onFunctionMetadataChange,
}) => {
  // Internal state for function metadata and coding-specific data
  const [functionMetadata, setFunctionMetadata] = useState<FunctionMetadata>(
    initialFunctionMetadata || {
      name: functionName || "",
      parameters: [],
      returnType: "int",
      language: language || "python",
    },
  );

  const [codingTestCases, setCodingTestCases] = useState<TestCase[]>(() => {
    // Initialize from props if provided, otherwise start with empty array
    return testCases && testCases.length > 0 ? [...testCases] : [];
  });
  const [activeTab, setActiveTab] = useState("question");

  // Initialize or update function metadata when language changes
  useEffect(() => {
    setFunctionMetadata((prev) => ({
      ...prev,
      language: language || "python",
    }));
  }, [language]);

  // Update internal test cases when prop changes
  useEffect(() => {
    if (testCases && testCases.length > 0) {
      setCodingTestCases([...testCases]);
    }
  }, [testCases]);

  // Update function metadata callback when metadata changes
  const stableFunctionMetadataChangeRef = React.useRef(
    onFunctionMetadataChange,
  );
  stableFunctionMetadataChangeRef.current = onFunctionMetadataChange;

  useEffect(() => {
    if (stableFunctionMetadataChangeRef.current) {
      stableFunctionMetadataChangeRef.current(functionMetadata);
    }
  }, [functionMetadata]); // Update boilerplate code when function metadata changes
  const stableStarterCodeChangeRef = React.useRef(onStarterCodeChange);
  stableStarterCodeChangeRef.current = onStarterCodeChange;

  useEffect(() => {
    if (functionMetadata.name && functionMetadata.parameters.length > 0) {
      const newBoilerplate = generateBoilerplateCode(functionMetadata);
      if (newBoilerplate !== starterCode) {
        stableStarterCodeChangeRef.current(newBoilerplate);
      }
    }
  }, [functionMetadata, starterCode]);

  // Use useEffect with a ref to prevent infinite loops
  const stableTestCasesChangeRef = React.useRef(onTestCasesChange);
  stableTestCasesChangeRef.current = onTestCasesChange;
  const lastTestCasesRef = React.useRef<string>("");

  useEffect(() => {
    const serialized = JSON.stringify(codingTestCases);
    if (serialized !== lastTestCasesRef.current) {
      lastTestCasesRef.current = serialized;
      stableTestCasesChangeRef.current(codingTestCases);
    }
  }, [codingTestCases]);
  const addParameter = useCallback(() => {
    const newParam: FunctionParameter = {
      id: nanoid(),
      name: "",
      type: "int",
    };
    setFunctionMetadata((prev) => ({
      ...prev,
      parameters: [...prev.parameters, newParam],
    }));
  }, []);

  const updateParameter = useCallback(
    (id: string, field: keyof FunctionParameter, value: string) => {
      setFunctionMetadata((prev) => ({
        ...prev,
        parameters: prev.parameters.map((param) =>
          param.id === id ? { ...param, [field]: value } : param,
        ),
      }));
    },
    [],
  );

  const removeParameter = useCallback((id: string) => {
    setFunctionMetadata((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }));
  }, []);
  const addTestCase = useCallback(() => {
    const newTestCase: TestCase = {
      id: nanoid(),
      inputs: {},
      expectedOutput: "",
      isHidden: false,
    };

    // Initialize inputs based on current parameters
    functionMetadata.parameters.forEach((param) => {
      newTestCase.inputs[param.name] = "";
    });

    setCodingTestCases((prev) => [...prev, newTestCase]);
  }, [functionMetadata.parameters]);

  const updateTestCase = useCallback(
    (id: string, field: keyof TestCase, value: string | boolean) => {
      setCodingTestCases((prev) =>
        prev.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)),
      );
    },
    [],
  );

  const updateTestCaseInput = useCallback(
    (testCaseId: string, paramName: string, value: string) => {
      setCodingTestCases((prev) =>
        prev.map((tc) =>
          tc.id === testCaseId
            ? { ...tc, inputs: { ...tc.inputs, [paramName]: value } }
            : tc,
        ),
      );
    },
    [],
  );

  const removeTestCase = useCallback((id: string) => {
    setCodingTestCases((prev) => prev.filter((tc) => tc.id !== id));
  }, []);

  const codeFiles = [
    {
      id: "main",
      name: `main.${language === "python" ? "py" : language === "javascript" ? "js" : language === "java" ? "java" : "cpp"}`,
      language: language || "python",
      content: starterCode || "",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="setup">Function Setup</TabsTrigger>
          <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          <TabsTrigger value="code">Code Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="question">
          {/* Question Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Question Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question-editor">Question Description</Label>
                <TiptapEditor
                  initialContent={question}
                  onUpdate={onQuestionChange}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Explanation Card */}
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Explanation
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showExplanation"
                    checked={showExplanation}
                    onChange={(e) => onShowExplanationChange(e.target.checked)}
                  />
                  <Label htmlFor="showExplanation">Include explanation</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showExplanation ? (
                <div>
                  <TiptapEditor
                    initialContent={explanation || ""}
                    onUpdate={onExplanationChange}
                    className="mt-2"
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Enable explanation to provide additional context for the
                  question.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Function Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="functionName">Function Name</Label>
                  <Input
                    id="functionName"
                    value={functionMetadata.name}
                    onChange={(e) =>
                      setFunctionMetadata((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., add2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnType">Return Type</Label>
                  <Select
                    value={functionMetadata.returnType}
                    onValueChange={(value) =>
                      setFunctionMetadata((prev) => ({
                        ...prev,
                        returnType: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select return type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="int">int</SelectItem>
                      <SelectItem value="float">float</SelectItem>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="boolean">boolean</SelectItem>
                      <SelectItem value="void">void</SelectItem>
                      <SelectItem value="list">list</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Programming Language</Label>
                <Select
                  value={functionMetadata.language}
                  onValueChange={(value) => {
                    setFunctionMetadata((prev) => ({
                      ...prev,
                      language: value,
                    }));
                    onLanguageChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select programming language" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Function Parameters</Label>
                  <Button onClick={addParameter} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Parameter
                  </Button>
                </div>

                <div className="space-y-2">
                  {functionMetadata.parameters.map((param, index) => (
                    <div
                      key={param.id}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <span className="text-sm text-muted-foreground w-8">
                        {index + 1}.
                      </span>
                      <Input
                        placeholder="Parameter name"
                        value={param.name}
                        onChange={(e) =>
                          updateParameter(param.id, "name", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Select
                        value={param.type}
                        onValueChange={(value) =>
                          updateParameter(param.id, "type", value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="int">int</SelectItem>
                          <SelectItem value="float">float</SelectItem>
                          <SelectItem value="string">string</SelectItem>
                          <SelectItem value="boolean">boolean</SelectItem>
                          <SelectItem value="list">list</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => removeParameter(param.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {functionMetadata.parameters.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No parameters added yet. Click &quot;Add Parameter&quot;
                      to get started.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testcases">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  Test Cases
                </div>
                <Button onClick={addTestCase} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Test Case
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {functionMetadata.parameters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Please add function parameters first before creating test
                  cases.
                </div>
              ) : (
                <div className="space-y-4">
                  {codingTestCases.map((testCase, index) => (
                    <div key={testCase.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">Test Case {index + 1}</Badge>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={testCase.isHidden}
                              onChange={(e) =>
                                updateTestCase(
                                  testCase.id,
                                  "isHidden",
                                  e.target.checked,
                                )
                              }
                            />
                            Hidden
                          </label>
                          <Button
                            onClick={() => removeTestCase(testCase.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            Input Parameters
                          </Label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {functionMetadata.parameters.map((param) => (
                              <div key={param.id}>
                                <Label className="text-xs text-muted-foreground">
                                  {param.name} ({param.type})
                                </Label>
                                <Input
                                  value={testCase.inputs[param.name] || ""}
                                  onChange={(e) =>
                                    updateTestCaseInput(
                                      testCase.id,
                                      param.name,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`Value for ${param.name}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor={`output-${testCase.id}`}
                            className="text-sm font-medium"
                          >
                            Expected Output
                          </Label>
                          <Input
                            id={`output-${testCase.id}`}
                            value={testCase.expectedOutput}
                            onChange={(e) =>
                              updateTestCase(
                                testCase.id,
                                "expectedOutput",
                                e.target.value,
                              )
                            }
                            placeholder="Expected return value"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {codingTestCases.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No test cases added yet. Click &quot;Add Test Case&quot;
                      to create one.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Code Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Content Preview */}
              <div>
                <Label className="text-lg font-semibold">Question</Label>
                <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                  {question ? (
                    <div className="prose prose-sm max-w-none">
                      <TiptapEditor
                        initialContent={question}
                        onUpdate={() => {}}
                        readOnly={true}
                        className="border-0 p-0"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">
                      No question content added yet.
                    </span>
                  )}
                </div>
              </div>

              {/* Boilerplate Code */}
              <div>
                <Label className="text-lg font-semibold">
                  Generated Boilerplate Code
                </Label>
                <div className="mt-2">
                  {functionMetadata.name &&
                  functionMetadata.parameters.length > 0 ? (
                    <CodeEditor
                      files={codeFiles}
                      activeFileId="main"
                      onFileChange={(files) => {
                        const mainFile = files.find((f) => f.id === "main");
                        if (mainFile) {
                          onStarterCodeChange(mainFile.content);
                        }
                      }}
                      onActiveFileChange={() => {}}
                      showConsole={false}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                      Configure function name and parameters to see the
                      generated boilerplate code.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodingQuestion;
