"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Code,
  FileText,
  Settings,
  TestTube,
  Eye,
  EyeOff,
} from "lucide-react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Textarea } from "@/components/ui/textarea";
import { CodingTestCase, SUPPORTED_LANGUAGES } from "../types";
import { useToast } from "@/hooks/use-toast";

interface CodingQuestionProps {
  question: string;
  language: string;
  starterCode?: string;
  driverCode?: string;
  testCases: CodingTestCase[];
  explanation?: string;
  showExplanation: boolean;
  strictMatch?: boolean;
  llmEval?: boolean;
  languages?: string[];
  onQuestionChange: (question: string) => void;
  onLanguageChange: (language: string) => void;
  onStarterCodeChange: (starterCode: string) => void;
  onDriverCodeChange?: (driverCode: string | null) => void;
  onTestCasesChange: (testCases: CodingTestCase[]) => void;
  onExplanationChange: (explanation: string) => void;
  onShowExplanationChange: (showExplanation: boolean) => void;
  onStrictMatchChange?: (strictMatch: boolean) => void;
  onLlmEvalChange?: (llmEval: boolean) => void;
  onLanguagesChange?: (languages: string[]) => void;
}

const CodingQuestion: React.FC<CodingQuestionProps> = ({
  question,
  language,
  starterCode = "",
  driverCode = "",
  testCases,
  explanation = "",
  showExplanation,
  strictMatch = true,
  llmEval = false,
  languages = [],
  onQuestionChange,
  onLanguageChange,
  onStarterCodeChange,
  onDriverCodeChange,
  onTestCasesChange,
  onExplanationChange,
  onShowExplanationChange,
  onStrictMatchChange,
  onLlmEvalChange,
  onLanguagesChange,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("question");

  // Initialize selected languages with useMemo
  const selectedLanguages = useMemo(() => {
    return languages.length > 0 ? languages : [language];
  }, [languages, language]);

  // Test case management functions
  const addTestCase = useCallback(() => {
    const newTestCase: CodingTestCase = {
      id: crypto.randomUUID(),
      code: "",
      tags: "SAMPLE",
      isMinimal: false,
      language: language || "python",
    };

    const updatedTestCases = [...testCases, newTestCase];
    onTestCasesChange(updatedTestCases);
  }, [testCases, language, onTestCasesChange]);

  const removeTestCase = useCallback(
    (id: string) => {
      if (testCases.length <= 1) {
        toast("At least one test case is required.");
        return;
      }

      const updatedTestCases = testCases.filter((tc) => tc.id !== id);
      onTestCasesChange(updatedTestCases);
    },
    [testCases, onTestCasesChange, toast],
  );

  const updateTestCase = useCallback(
    (id: string, updates: Partial<CodingTestCase>) => {
      const updatedTestCases = testCases.map((tc) =>
        tc.id === id ? { ...tc, ...updates } : tc,
      );
      onTestCasesChange(updatedTestCases);
    },
    [testCases, onTestCasesChange],
  );

  const handleLanguageToggle = useCallback(
    (lang: string, checked: boolean) => {
      let newLanguages: string[];

      if (checked) {
        newLanguages = [...selectedLanguages, lang];
      } else {
        if (selectedLanguages.length === 1) {
          toast("At least one programming language must be selected.");
          return;
        }
        newLanguages = selectedLanguages.filter((l: string) => l !== lang);
      }

      onLanguagesChange?.(newLanguages);

      // If current language is removed, switch to first available
      if (!checked && lang === language && newLanguages.length > 0) {
        onLanguageChange(newLanguages[0]);
      }
    },
    [selectedLanguages, language, onLanguagesChange, onLanguageChange, toast],
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="question" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Question
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code Setup
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test Cases
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Question Tab */}
        <TabsContent value="question" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Problem Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TiptapEditor
                initialContent={question}
                onUpdate={onQuestionChange}
                className="min-h-[300px]"
              />
            </CardContent>
          </Card>

          {/* Explanation Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Explanation (Optional)</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="show-explanation" className="text-sm">
                  Include explanation
                </Label>
                <Switch
                  id="show-explanation"
                  checked={showExplanation}
                  onCheckedChange={onShowExplanationChange}
                />
              </div>
            </CardHeader>
            {showExplanation && (
              <CardContent>
                <TiptapEditor
                  initialContent={explanation}
                  onUpdate={onExplanationChange}
                  className="min-h-[150px]"
                />
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Code Setup Tab */}
        <TabsContent value="code" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Starter Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Starter Code</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Initial code template that students will see
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={onLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
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
                <div className="mt-4">
                  <Textarea
                    value={starterCode}
                    onChange={(e) => onStarterCodeChange(e.target.value)}
                    placeholder={`# Write your ${language} function here...\ndef solution():\n    pass`}
                    className="min-h-[200px] font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Driver Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Driver Code</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Code to test the student&apos;s solution
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={driverCode}
                  onChange={(e) => onDriverCodeChange?.(e.target.value)}
                  placeholder={`# Example driver code\nprint(solution())`}
                  className="min-h-[200px] font-mono"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Test Cases Tab */}
        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  Test Cases
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Define test cases to evaluate student submissions
                </p>
              </div>
              <Button
                onClick={addTestCase}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Test Case
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {testCases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No test cases created yet. Add test cases to validate student
                  solutions.
                </div>
              ) : (
                testCases.map((testCase, index) => (
                  <Card key={testCase.id} className="border border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Test Case {index + 1}</Badge>
                          <Badge
                            variant={
                              testCase.tags === "HIDDEN"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {testCase.tags === "HIDDEN" ? (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" /> Hidden
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" /> Sample
                              </>
                            )}
                          </Badge>
                          {testCase.isMinimal && (
                            <Badge variant="outline">Minimal</Badge>
                          )}
                        </div>
                        {testCases.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTestCase(testCase.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Test Case Language */}
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select
                            value={testCase.language}
                            onValueChange={(value) =>
                              updateTestCase(testCase.id, { language: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
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

                        {/* Test Case Visibility */}
                        <div className="space-y-2">
                          <Label>Visibility</Label>
                          <Select
                            value={testCase.tags}
                            onValueChange={(value: "SAMPLE" | "HIDDEN") =>
                              updateTestCase(testCase.id, { tags: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SAMPLE">
                                Sample (Visible)
                              </SelectItem>
                              <SelectItem value="HIDDEN">Hidden</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Minimal Test Case */}
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`minimal-${testCase.id}`}
                              checked={testCase.isMinimal}
                              onCheckedChange={(checked) =>
                                updateTestCase(testCase.id, {
                                  isMinimal: checked,
                                })
                              }
                            />
                            <Label
                              htmlFor={`minimal-${testCase.id}`}
                              className="text-sm"
                            >
                              Minimal test case
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Test Code */}
                      <div className="space-y-2">
                        <Label>Test Code</Label>
                        <Textarea
                          value={testCase.code}
                          onChange={(e) =>
                            updateTestCase(testCase.id, {
                              code: e.target.value,
                            })
                          }
                          placeholder="# Enter test code that will be executed"
                          className="min-h-[100px] font-mono"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          {/* Language Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Languages</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select which programming languages students can use
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Switch
                      id={`lang-${lang}`}
                      checked={selectedLanguages.includes(lang)}
                      onCheckedChange={(checked) =>
                        handleLanguageToggle(lang, checked)
                      }
                    />
                    <Label
                      htmlFor={`lang-${lang}`}
                      className="text-sm font-normal"
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evaluation Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure how student submissions will be evaluated
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Strict Matching</Label>
                  <p className="text-sm text-muted-foreground">
                    Require exact output matching for test cases
                  </p>
                </div>
                <Switch
                  checked={strictMatch}
                  onCheckedChange={onStrictMatchChange}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">LLM Evaluation</Label>
                  <p className="text-sm text-muted-foreground">
                    Use AI-powered evaluation for more flexible checking
                  </p>
                </div>
                <Switch checked={llmEval} onCheckedChange={onLlmEvalChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodingQuestion;
