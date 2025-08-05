import { CodingQuestion } from "@/components/question-creation/question-types/coding-questions";
import { useEffect, useState, useCallback } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trash2,
  Plus,
  Save,
  X,
  FileText,
  Code,
  TestTube,
  Edit,
} from "lucide-react";
import { QuestionSettings } from "@/components/question-creation/settings-types/settings-types";
import CodeEditor from "@/components/ui/code-editor";

interface CreateCodingQuestionProps {
  isEditing: boolean;
  questionId?: string;
  questionData?: CodingQuestion;
  settings?: QuestionSettings;
  onSave?: (question: CodingQuestion) => void;
}

const SUPPORTED_LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
];

function TestCaseEditor({
  testCase,
  language,
  onSave,
  onCancel,
}: {
  testCase: {
    code: string;
    tags: string;
    isMinimal: boolean;
    language?: string;
  };
  language: string;
  onSave: (code: string) => void;
  onCancel: () => void;
}) {
  const [editedCode, setEditedCode] = useState(testCase.code);

  return (
    <div className="space-y-3">
      <CodeEditor
        files={[
          {
            id: "edit-testcase",
            name: "Edit Test Case",
            language: testCase.language || language,
            content: editedCode,
          },
        ]}
        activeFileId="edit-testcase"
        onFileChange={(files) => {
          setEditedCode(files[0]?.content || "");
        }}
        onActiveFileChange={() => {}}
        showConsole={false}
      />
      <div className="flex gap-2">
        <Button
          onClick={() => onSave(editedCode)}
          size="sm"
          disabled={!editedCode.trim()}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button onClick={onCancel} size="sm" variant="outline">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function CreateCodingQuestion({
  isEditing,
  questionData,
  settings,
  onSave,
}: CreateCodingQuestionProps) {
  const [question, setQuestion] = useState<CodingQuestion | null>(null);
  const [newTestCase, setNewTestCase] = useState({
    code: "",
    tags: "SAMPLE" as "HIDDEN" | "SAMPLE",
    isMinimal: false,
  });
  const [isAddingTestCase, setIsAddingTestCase] = useState(false);
  const [activeTab, setActiveTab] = useState("boiler");
  const [editingTestCaseIndex, setEditingTestCaseIndex] = useState<
    number | null
  >(null);

  const codeFiles = [
    {
      id: "boiler",
      name: "Boiler Template",
      language: question?.language[0] || "python",
      content: question?.boilerCode || "",
    },
    {
      id: "driver",
      name: "Driver Code",
      language: question?.language[0] || "python",
      content: question?.driverCode || "",
    },
    {
      id: "answer",
      name: "Answer",
      language: question?.language[0] || "python",
      content: question?.answer || "",
    },
  ];

  const createNewQuestion = useCallback(
    (questionText: string = ""): CodingQuestion => {
      return {
        type: "CODING",
        question: questionText,
        topicIds: settings?.topicIds || [],
        marks: settings?.marks || 1,
        difficulty: settings?.difficulty || "MEDIUM",
        bloomsTaxonomy: settings?.bloomsTaxonomy || "REMEMBER",
        co: settings?.co || 1,
        negativeMarks: settings?.negativeMarks || 0,
        language: ["python"],
        boilerCode: "",
        driverCode: "",
        answer: "",
        testcases: [],
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
          marks: settings.marks,
          difficulty: settings.difficulty,
          bloomsTaxonomy: settings.bloomsTaxonomy,
          co: settings.co,
          negativeMarks: settings.negativeMarks,
          topicIds: settings.topicIds,
        };
      });
    }
  }, [createNewQuestion, settings]);

  const handleQuestionChange = (content: string) => {
    setQuestion((prev) => {
      if (!prev) {
        return createNewQuestion(content);
      }
      return {
        ...prev,
        question: content,
      };
    });
  };

  const handleLanguageChange = (language: string) => {
    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        language: [language],
        testcases: prev.testcases.map((tc) => ({ ...tc, language })),
      };
    });
  };

  const handleCodeFilesChange = (files: typeof codeFiles) => {
    const boilerFile = files.find((f) => f.id === "boiler");
    const driverFile = files.find((f) => f.id === "driver");
    const answerFile = files.find((f) => f.id === "answer");

    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        boilerCode: boilerFile?.content || "",
        driverCode: driverFile?.content || "",
        answer: answerFile?.content || "",
      };
    });
  };

  const handleAddTestCase = () => {
    if (!newTestCase.code.trim() || !question) return;

    const testCase = {
      ...newTestCase,
      language: question.language[0],
    };

    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        testcases: [...prev.testcases, testCase],
      };
    });

    // Reset form and close the adding interface
    setNewTestCase({
      code: "",
      tags: "SAMPLE",
      isMinimal: false,
    });
    setIsAddingTestCase(false);
  };

  const handleDeleteTestCase = (index: number) => {
    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        testcases: prev.testcases.filter((_, i) => i !== index),
      };
    });
  };

  const handleEditTestCase = (index: number) => {
    setEditingTestCaseIndex(index);
  };

  const handleSaveTestCaseEdit = (index: number, updatedCode: string) => {
    setQuestion((prev) => {
      if (!prev) return prev;
      const updatedTestcases = [...prev.testcases];
      updatedTestcases[index] = {
        ...updatedTestcases[index],
        code: updatedCode,
      };
      return {
        ...prev,
        testcases: updatedTestcases,
      };
    });
    setEditingTestCaseIndex(null);
  };

  const handleCancelTestCaseEdit = () => {
    setEditingTestCaseIndex(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
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
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Programming Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={question?.language[0] || "python"}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a programming language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Code Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="boiler">Boiler Template</TabsTrigger>
              <TabsTrigger value="driver">Driver Code</TabsTrigger>
              <TabsTrigger value="answer">Answer</TabsTrigger>
            </TabsList>

            <TabsContent value="boiler" className="mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Template code shown to students (contains function signature
                  and basic structure)
                </Label>
                <CodeEditor
                  files={[codeFiles.find((f) => f.id === "boiler")!]}
                  activeFileId="boiler"
                  onFileChange={(files) => {
                    const updatedFiles = codeFiles.map((f) =>
                      f.id === "boiler" ? files[0] : f,
                    );
                    handleCodeFilesChange(updatedFiles);
                  }}
                  onActiveFileChange={() => {}}
                  showConsole={false}
                />
              </div>
            </TabsContent>

            <TabsContent value="driver" className="mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Driver code to execute and test the solution (optional)
                </Label>
                <CodeEditor
                  files={[codeFiles.find((f) => f.id === "driver")!]}
                  activeFileId="driver"
                  onFileChange={(files) => {
                    const updatedFiles = codeFiles.map((f) =>
                      f.id === "driver" ? files[0] : f,
                    );
                    handleCodeFilesChange(updatedFiles);
                  }}
                  onActiveFileChange={() => {}}
                  showConsole={false}
                />
              </div>
            </TabsContent>

            <TabsContent value="answer" className="mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Complete correct solution for reference and auto-grading
                </Label>
                <CodeEditor
                  files={[codeFiles.find((f) => f.id === "answer")!]}
                  activeFileId="answer"
                  onFileChange={(files) => {
                    const updatedFiles = codeFiles.map((f) =>
                      f.id === "answer" ? files[0] : f,
                    );
                    handleCodeFilesChange(updatedFiles);
                  }}
                  onActiveFileChange={() => {}}
                  showConsole={false}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Test Cases
            </CardTitle>
            <Button
              onClick={() => setIsAddingTestCase(true)}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Test Case
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {question?.testcases?.map((testCase, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      testCase.tags === "HIDDEN" ? "destructive" : "default"
                    }
                  >
                    {testCase.tags}
                  </Badge>
                  {testCase.isMinimal && (
                    <Badge variant="secondary">Minimal</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingTestCaseIndex !== index && (
                    <Button
                      onClick={() => handleEditTestCase(index)}
                      size="sm"
                      variant="ghost"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteTestCase(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {editingTestCaseIndex === index ? (
                <div className="space-y-2">
                  <TestCaseEditor
                    testCase={testCase}
                    language={question?.language[0] || "python"}
                    onSave={(updatedCode) =>
                      handleSaveTestCaseEdit(index, updatedCode)
                    }
                    onCancel={handleCancelTestCaseEdit}
                  />
                </div>
              ) : (
                <Textarea
                  value={testCase.code}
                  readOnly
                  className="font-mono text-sm bg-muted/50 cursor-default"
                  rows={Math.min(testCase.code.split("\n").length + 1, 6)}
                />
              )}
            </div>
          ))}

          {isAddingTestCase && (
            <div className="border-2 border-dashed border-muted rounded-lg p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={newTestCase.tags}
                      onValueChange={(value: "HIDDEN" | "SAMPLE") =>
                        setNewTestCase((prev) => ({ ...prev, tags: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAMPLE">Sample</SelectItem>
                        <SelectItem value="HIDDEN">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="minimal"
                        checked={newTestCase.isMinimal}
                        onCheckedChange={(checked) =>
                          setNewTestCase((prev) => ({
                            ...prev,
                            isMinimal: !!checked,
                          }))
                        }
                      />
                      <Label htmlFor="minimal">Minimal</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Test Code</Label>
                  <div className="mt-2">
                    <CodeEditor
                      files={[
                        {
                          id: "new-testcase",
                          name: "New Test Case",
                          language: question?.language[0] || "python",
                          content: newTestCase.code,
                        },
                      ]}
                      activeFileId="new-testcase"
                      onFileChange={(files) => {
                        setNewTestCase((prev) => ({
                          ...prev,
                          code: files[0]?.content || "",
                        }));
                      }}
                      onActiveFileChange={() => {}}
                      showConsole={false}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddTestCase}
                    size="sm"
                    disabled={!newTestCase.code.trim()}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Test Case
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingTestCase(false);
                      setNewTestCase({
                        code: "",
                        tags: "SAMPLE",
                        isMinimal: false,
                      });
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
