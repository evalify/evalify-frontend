"use client";

import React from "react";
import { QuestionRenderer } from "@/components/render-questions";
import {
  QuestionConfig,
  Question,
  QuestionAnswer,
} from "@/components/render-questions/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Eye,
  Edit3,
  Shuffle,
  Award,
  Target,
  Hash,
  Lightbulb,
} from "lucide-react";

// Sample backend data format (as provided by the user)
const backendSampleData = [
  {
    question: "What is the capital of Amrita?",
    options: [
      {
        id: null,
        text: "jail",
        isCorrect: true,
      },
      {
        id: null,
        text: "Rome",
        isCorrect: false,
      },
      {
        id: null,
        text: "Berlin",
        isCorrect: false,
      },
      {
        id: null,
        text: "Madrid",
        isCorrect: false,
      },
    ],
    hintText: "It is also known as the City of Light.",
    markValue: 2,
    taxonomy: "CREATE",
    coValue: 1,
    difficultyLevel: "EASY",
    explanation: "Paris is the capital city of France.",
    type: "MCQ",
  },
  {
    question:
      "The capital of Germany is _____ and the capital of Spain is _____.",
    blanks: [
      {
        id: "1",
        answers: ["Berlin", "Pranesh", "Aksay"],
      },
      {
        id: "2",
        answers: ["Sharvesh", "Pranesh", "Aksay"],
      },
    ],
    hintText: null,
    markValue: 2,
    taxonomy: "CREATE",
    coValue: 2,
    difficultyLevel: "EASY",
    explanation: null,
    strictMatch: true,
    llmEval: null,
    template: "The capital of Germany is __ and the capital of Spain is __.",
    type: "FILL_UP",
  },
  {
    question: "Match the following countries with their capitals.",
    hintText: null,
    keys: [
      {
        id: "ddd059ee-9092-4794-927e-f4b598d36907",
        leftPair: "France",
        rightPair: "Paris",
      },
      {
        id: "3e1ccef0-2a15-4393-809e-21dd7761f4e2",
        leftPair: "Germany",
        rightPair: "Berlin",
      },
      {
        id: "0226524a-d033-4d57-9c89-e2b0c70d2322",
        leftPair: "Italy",
        rightPair: "Rome",
      },
    ],
    markValue: 4,
    taxonomy: "APPLY",
    coValue: 2,
    difficultyLevel: "MEDIUM",
    explanation: null,
    type: "MATCH_THE_FOLLOWING",
  },
  {
    question: "Write a function to add two numbers.",
    functionName: "add",
    returnType: "int",
    params: [
      {
        param: "a",
        type: "int",
      },
      {
        param: "b",
        type: "int",
      },
    ],
    language: ["python"],
    hintText: null,
    markValue: 10,
    taxonomy: "APPLY",
    coValue: 2,
    difficultyLevel: "MEDIUM",
    driverCode: "print(add(3, 4))",
    boilerCode: "def add(a, b):\n    pass",
    testcases: [
      {
        input: [2, 3],
        expected: 5,
      },
      {
        input: [10, 20],
        expected: 30,
      },
    ],
    answer: null,
    type: "CODING",
  },
  {
    question:
      "Explain the concept of polymorphism in Object-Oriented Programming.",
    hintText: null,
    markValue: 5,
    taxonomy: "UNDERSTAND",
    coValue: 3,
    difficultyLevel: "MEDIUM",
    explanation: null,
    expectedAnswer:
      "Polymorphism is the ability of an object to take on many forms...",
    strictness: 0.8,
    guidelines: "Cover runtime and compile-time polymorphism.",
    answer: null,
    type: "DESCRIPTIVE",
  },
];

// Sample student answers for demonstrating answer display
const sampleStudentAnswers: { [key: number]: QuestionAnswer } = {
  0: {
    // MCQ answer
    selectedOption: "jail", // Correct answer
    isCorrect: true,
    score: 2,
  },
  1: {
    // Fill-up answer
    blanks: { "1": "Berlin", "2": "Madrid" }, // Partially correct
    correctBlanks: {
      "1": ["Berlin", "Pranesh", "Aksay"],
      "2": ["Sharvesh", "Pranesh", "Aksay"],
    },
    score: 1,
  },
  2: {
    // Match the following answer
    matches: {
      "ddd059ee-9092-4794-927e-f4b598d36907": "Paris", // Correct
      "3e1ccef0-2a15-4393-809e-21dd7761f4e2": "Paris", // Incorrect
    },
    correctMatches: {
      "ddd059ee-9092-4794-927e-f4b598d36907": "Paris",
      "3e1ccef0-2a15-4393-809e-21dd7761f4e2": "Berlin",
    },
    score: 1.5,
  },
  3: {
    // True/False answer
    answer: true, // Correct
    isCorrect: true,
    score: 1,
  },
  4: {
    // Descriptive answer
    text: "Polymorphism allows objects of different types to be treated as objects of a common base type. It includes method overloading and overriding.",
    score: 4,
    feedback:
      "Good explanation but could include more details about runtime vs compile-time polymorphism.",
  },
};

export default function QuestionRendererDemo() {
  const { success: showSuccess } = useToast();

  // Backend data is now directly compatible with the component
  const sampleQuestions = React.useMemo(
    () => backendSampleData as unknown as Question[],
    [],
  );
  const [config, setConfig] = React.useState<QuestionConfig>({
    mode: "display",
    showActions: true,
    showExplanation: true,
    showHint: true,
    showMarks: true,
    showTopics: true,
    showDifficulty: true,
    showBloomsTaxonomy: true,
    shuffleOptions: false,
    readOnly: false,
    compact: false,
    showCorrectAnswers: false,
    showUserAnswers: false,
    showScore: false,
    highlightCorrectness: false,
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const selectedQuestion = sampleQuestions[selectedQuestionIndex];

  // Get student answers for current question
  const currentStudentAnswer = sampleStudentAnswers[selectedQuestionIndex];

  // Enhanced config with student answers when needed
  const enhancedConfig = React.useMemo(
    () => ({
      ...config,
      userAnswers:
        config.mode === "review" || config.showUserAnswers
          ? currentStudentAnswer
          : undefined,
    }),
    [config, currentStudentAnswer],
  );

  const handleConfigChange = (
    key: keyof QuestionConfig,
    value: boolean | string,
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const questionActions = {
    onEdit: (questionId: string) => {
      showSuccess(`Edit action triggered for question: ${questionId}`);
    },
    onDelete: (questionId: string) => {
      showSuccess(`Delete action triggered for question: ${questionId}`);
    },
    onEditMarks: (questionId: string, newMarks: number) => {
      showSuccess(`Marks updated to ${newMarks} for question: ${questionId}`);
    },
    onDuplicate: (questionId: string) => {
      showSuccess(`Duplicate action triggered for question: ${questionId}`);
    },
  };

  const handleAnswerChange = (answer: unknown) => {
    console.log("Answer changed:", answer);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Question Renderer Component - Direct Backend Support
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The component now directly accepts your backend format without any
            transformation needed!
          </p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Badge variant="outline" className="text-xs">
              🎯 {sampleQuestions.length} Questions - Direct Support
            </Badge>
            <Badge variant="secondary" className="text-xs">
              ✅ No Conversion Required
            </Badge>
            <Badge variant="default" className="text-xs">
              📊 Backend Compatible
            </Badge>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{sampleQuestions.length}</div>
              <p className="text-xs text-muted-foreground">Question Types</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Display Modes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Supported Formats</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">Mobile Responsive</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Configuration Panel */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="w-4 h-4" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Question Type</Label>
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-1">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={question.id || `question-${index + 1}`}
                      variant={
                        selectedQuestionIndex === index ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedQuestionIndex(index)}
                      className="justify-start text-xs truncate"
                    >
                      {question.type.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              {/* Mode Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Display Mode</Label>
                <div className="grid grid-cols-1 gap-1">
                  <Button
                    variant={config.mode === "display" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConfigChange("mode", "display")}
                    className="justify-start text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Display (Answer Review)
                  </Button>
                  <Button
                    variant={config.mode === "student" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConfigChange("mode", "student")}
                    className="justify-start text-xs"
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Student (Interactive)
                  </Button>
                  <Button
                    variant={config.mode === "review" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConfigChange("mode", "review")}
                    className="justify-start text-xs"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Review (With Scores)
                  </Button>
                  <Button
                    variant={config.mode === "edit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleConfigChange("mode", "edit")}
                    className="justify-start text-xs"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit Mode
                  </Button>
                </div>
              </div>
              <Separator />
              {/* Display Mode Options */}
              {config.mode === "display" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Display Options
                    </Label>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-correct" className="text-xs">
                        Show Correct Answers
                      </Label>
                      <Switch
                        id="show-correct"
                        checked={config.showCorrectAnswers || false}
                        onCheckedChange={(checked) =>
                          handleConfigChange("showCorrectAnswers", checked)
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                </>
              )}
              {/* Student Answer Options */}
              {(config.mode === "review" || config.mode === "student") && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Student Answer Options
                    </Label>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-user-answers" className="text-xs">
                        Show User Answers
                      </Label>
                      <Switch
                        id="show-user-answers"
                        checked={config.showUserAnswers || false}
                        onCheckedChange={(checked) =>
                          handleConfigChange("showUserAnswers", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-score" className="text-xs">
                        Show Score
                      </Label>
                      <Switch
                        id="show-score"
                        checked={config.showScore || false}
                        onCheckedChange={(checked) =>
                          handleConfigChange("showScore", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="highlight-correctness"
                        className="text-xs"
                      >
                        Highlight Correctness
                      </Label>
                      <Switch
                        id="highlight-correctness"
                        checked={config.highlightCorrectness || false}
                        onCheckedChange={(checked) =>
                          handleConfigChange("highlightCorrectness", checked)
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                </>
              )}
              {/* Configuration Switches */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">General Options</Label>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showActions"
                    className="text-xs flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    Show Actions
                  </Label>
                  <Switch
                    id="showActions"
                    checked={config.showActions}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showActions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showMarks"
                    className="text-xs flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" />
                    Show Marks
                  </Label>
                  <Switch
                    id="showMarks"
                    checked={config.showMarks}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showMarks", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showHint"
                    className="text-xs flex items-center gap-1"
                  >
                    <Lightbulb className="w-3 h-3" />
                    Show Hints
                  </Label>
                  <Switch
                    id="showHint"
                    checked={config.showHint}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showHint", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="showDifficulty"
                    className="text-xs flex items-center gap-1"
                  >
                    <Target className="w-3 h-3" />
                    Show Difficulty
                  </Label>
                  <Switch
                    id="showDifficulty"
                    checked={config.showDifficulty}
                    onCheckedChange={(checked) =>
                      handleConfigChange("showDifficulty", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="shuffleOptions"
                    className="text-xs flex items-center gap-1"
                  >
                    <Shuffle className="w-3 h-3" />
                    Shuffle Options
                  </Label>
                  <Switch
                    id="shuffleOptions"
                    checked={config.shuffleOptions}
                    onCheckedChange={(checked) =>
                      handleConfigChange("shuffleOptions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="compact"
                    className="text-xs flex items-center gap-1"
                  >
                    <Hash className="w-3 h-3" />
                    Compact Mode
                  </Label>
                  <Switch
                    id="compact"
                    checked={config.compact}
                    onCheckedChange={(checked) =>
                      handleConfigChange("compact", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="readOnly" className="text-xs">
                    Read Only
                  </Label>
                  <Switch
                    id="readOnly"
                    checked={config.readOnly}
                    onCheckedChange={(checked) =>
                      handleConfigChange("readOnly", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Question Display */}
          <div className="xl:col-span-3">
            <Tabs defaultValue="preview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview" className="text-xs sm:text-sm">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="data-format" className="text-xs sm:text-sm">
                  Backend Format
                </TabsTrigger>
                <TabsTrigger
                  value="all-questions"
                  className="text-xs sm:text-sm"
                >
                  All Questions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-base sm:text-lg">
                        Question Preview
                      </span>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {selectedQuestion.type.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {config.mode}
                        </Badge>
                        {config.showCorrectAnswers && (
                          <Badge variant="secondary" className="text-xs">
                            With Answers
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuestionRenderer
                      question={selectedQuestion}
                      config={enhancedConfig}
                      actions={config.showActions ? questionActions : undefined}
                      onAnswerChange={handleAnswerChange}
                      questionNumber={selectedQuestionIndex + 1}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data-format" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Your Backend Format
                      </Badge>
                      Direct Compatibility Demo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
                      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(
                          backendSampleData[selectedQuestionIndex],
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✅ <strong>This exact format</strong> is now directly
                        supported by the QuestionRenderer component! No
                        transformation needed - just pass your backend response
                        directly to the component.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      🎯 Direct Backend Support Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-600 dark:text-green-400">
                          ✅ Flexible Property Mapping
                        </h4>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                          <li>
                            • <code>markValue</code> OR <code>marks</code>
                          </li>
                          <li>
                            • <code>hintText</code> OR <code>hint</code>
                          </li>
                          <li>
                            • <code>taxonomy</code> OR
                            <code>bloomsTaxonomy</code>
                          </li>
                          <li>
                            • <code>coValue</code> OR <code>co</code>
                          </li>
                          <li>
                            • <code>difficultyLevel</code> OR
                            <code>difficulty</code>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-600 dark:text-blue-400">
                          🔧 Auto-Handling
                        </h4>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                          <li>• Generates IDs when missing</li>
                          <li>• Handles null option IDs</li>
                          <li>• Creates default bank/topics</li>
                          <li>• Converts enum formats</li>
                          <li>• Graceful fallbacks</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      💻 Simple Usage - No Conversion Needed!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
                      <pre className="text-xs">
                        <code>{`// Your backend API response (your exact format)
const fetchQuestions = async () => {
  const response = await fetch('/api/questions');
  const backendData = await response.json();
  return backendData; // No transformation needed!
};

// Use directly with the component
const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  
  useEffect(() => {
    fetchQuestions().then(setQuestions);
  }, []);
  
  return (
    <div>
      {questions.map((question, index) => (
        <QuestionRenderer
          key={index}
          question={question} // Direct usage!
          config={{ mode: "display" }}
          questionNumber={index + 1}
        />
      ))}
    </div>
  );
};`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all-questions" className="space-y-4">
                <div className="space-y-4">
                  {sampleQuestions.map((question, index) => {
                    const questionStudentAnswer = sampleStudentAnswers[index];
                    const questionConfig = {
                      ...config,
                      userAnswers:
                        config.mode === "review" || config.showUserAnswers
                          ? questionStudentAnswer
                          : undefined,
                    };

                    return (
                      <QuestionRenderer
                        key={question.id || `question-${index + 1}`}
                        question={question}
                        config={questionConfig}
                        actions={
                          config.showActions ? questionActions : undefined
                        }
                        onAnswerChange={handleAnswerChange}
                        questionNumber={index + 1}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Component Features & Backend Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Question Types Supported</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Multiple Choice (MCQ)</li>
                  <li>• Fill in the Blanks</li>
                  <li>• Match the Following</li>
                  <li>• Descriptive/Essay</li>
                  <li>• Coding/Programming</li>
                  <li>• Plus: MMCQ, True/False, File Upload</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Backend Compatibility</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    • <strong>markValue</strong> → marks
                  </li>
                  <li>
                    • <strong>hintText</strong> → hint
                  </li>
                  <li>
                    • <strong>taxonomy</strong> → bloomsTaxonomy
                  </li>
                  <li>
                    • <strong>coValue</strong> → co
                  </li>
                  <li>
                    • <strong>difficultyLevel</strong> → difficulty
                  </li>
                  <li>• Auto-generates missing IDs</li>
                  <li>• Flexible data structure handling</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Display Modes</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    • <strong>Display:</strong> Answer review with user
                    responses
                  </li>
                  <li>
                    • <strong>Student:</strong> Compare user vs correct answers
                  </li>
                  <li>
                    • <strong>Edit:</strong> Question creation/modification
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Key Features</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Backend format transformation</li>
                  <li>• User answer comparison</li>
                  <li>• Correct answer highlighting</li>
                  <li>• Configurable action buttons</li>
                  <li>• LaTeX math rendering</li>
                  <li>• Rich content support</li>
                  <li>• Mobile responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Usage Example */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  How to use with your backend data:
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                  {`import { QuestionRenderer } from "@/components/render-questions";

// Your backend response - use directly, no transformation needed!
const backendQuestion = {
  "question": "What is the capital of France?",
  "options": [
    { "id": null, "text": "Paris", "isCorrect": true },
    { "id": null, "text": "London", "isCorrect": false }
  ],
  "markValue": 2,
  "taxonomy": "REMEMBER",
  "coValue": 1,
  "difficultyLevel": "EASY",
  "type": "MCQ"
};

// Render directly with backend data
<QuestionRenderer 
  question={backendQuestion} 
  config={{ mode: "display" }} 
/>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
