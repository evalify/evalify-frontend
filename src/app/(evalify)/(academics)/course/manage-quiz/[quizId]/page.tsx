"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { DateTimePicker } from "@/components/bank/datetime-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  BookOpen,
  Settings,
  Plus,
  Database,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { Quiz, Course, Student, Lab, Batch } from "@/lib/types";
import { format } from "date-fns";

const ManageQuizPage = () => {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Quiz>>({});

  // Dropdown options (normally fetched from API)
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        // Mock API call - replace with actual implementation
        const mockQuiz: Quiz = {
          id: quizId,
          name: "Data Structures Mid-Term Exam",
          description:
            "Comprehensive examination covering arrays, linked lists, stacks, and queues",
          instructions:
            "Answer all questions. No external help allowed. Calculator permitted for mathematical calculations.",
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
          duration: "PT2H",
          password: "exam2024",
          fullScreen: true,
          shuffleQuestions: true,
          shuffleOptions: false,
          linearQuiz: true,
          calculator: true,
          autoSubmit: true,
          publishResult: false,
          publishQuiz: true,
          createdAt: new Date().toISOString(),
          course: ["course-1", "course-2"],
          student: ["student-1", "student-2", "student-3"],
          lab: ["lab-1"],
          batch: ["batch-1", "batch-2"],
          createdBy: "faculty-123",
        };

        setQuiz(mockQuiz);
        setFormData(mockQuiz);

        // Mock data for dropdowns
        setCourses([
          { id: "course-1", name: "Data Structures", code: "CS201" },
          { id: "course-2", name: "Algorithms", code: "CS301" },
          { id: "course-3", name: "Database Systems", code: "CS202" },
        ]);

        setStudents([
          {
            id: "student-1",
            name: "John Doe",
            email: "john@example.com",
            rollNumber: "2021001",
          },
          {
            id: "student-2",
            name: "Jane Smith",
            email: "jane@example.com",
            rollNumber: "2021002",
          },
          {
            id: "student-3",
            name: "Bob Johnson",
            email: "bob@example.com",
            rollNumber: "2021003",
          },
        ]);

        setLabs([
          {
            id: "lab-1",
            name: "Computer Lab A",
            location: "Block A, Room 101",
          },
          {
            id: "lab-2",
            name: "Computer Lab B",
            location: "Block B, Room 201",
          },
        ]);

        setBatches([
          { id: "batch-1", name: "CS Batch A", year: 2021 },
          { id: "batch-2", name: "CS Batch B", year: 2021 },
          { id: "batch-3", name: "CS Batch C", year: 2022 },
        ]);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // API call to save quiz data
      console.log("Saving quiz data:", formData);
      setQuiz(formData as Quiz);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving quiz:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(quiz || {});
    setIsEditing(false);
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;

    const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
    const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;

    return `${hours}h ${minutes}m`;
  };

  const removeFromArray = (field: keyof Quiz, valueToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        (prev[field] as string[])?.filter((item) => item !== valueToRemove) ||
        [],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading quiz data...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quiz Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested quiz could not be found.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{quiz.name}</h1>
          <p className="text-gray-600 mt-1">
            Manage quiz settings and participants
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Quiz
              </Button>
              <Button
                onClick={() => router.push(`/quiz/create-quiz`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Questions
              </Button>
              <Button
                onClick={() => router.push(`/quiz/add-from-bank/${quizId}`)}
                variant="outline"
              >
                <Database className="w-4 h-4 mr-2" />
                Add from Bank
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quiz Information
              </CardTitle>
              <CardDescription>
                Basic quiz details and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Quiz Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password (Optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="Leave empty for no password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  {isEditing ? (
                    <DateTimePicker
                      value={
                        formData.startTime
                          ? new Date(formData.startTime)
                          : undefined
                      }
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          startTime: date?.toISOString() || "",
                        }))
                      }
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">
                      {format(new Date(quiz.startTime), "PPp")}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  {isEditing ? (
                    <DateTimePicker
                      value={
                        formData.endTime
                          ? new Date(formData.endTime)
                          : undefined
                      }
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          endTime: date?.toISOString() || "",
                        }))
                      }
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">
                      {format(new Date(quiz.endTime), "PPp")}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    placeholder="PT2H (ISO 8601 format)"
                  />
                  <p className="text-xs text-gray-500">
                    Current: {formatDuration(quiz.duration)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quiz Settings
              </CardTitle>
              <CardDescription>
                Configure quiz behavior and security options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Question Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shuffleQuestions"
                        checked={formData.shuffleQuestions || false}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            shuffleQuestions: checked as boolean,
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="shuffleQuestions">
                        Shuffle Questions
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shuffleOptions"
                        checked={formData.shuffleOptions || false}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            shuffleOptions: checked as boolean,
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="shuffleOptions">Shuffle Options</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="linearQuiz"
                        checked={formData.linearQuiz || false}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            linearQuiz: checked as boolean,
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="linearQuiz">
                        Linear Quiz (No going back)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Security & Tools</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fullScreen"
                        checked={formData.fullScreen || false}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            fullScreen: checked as boolean,
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="fullScreen">Full Screen Mode</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="calculator"
                        checked={formData.calculator || false}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            calculator: checked as boolean,
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="calculator">Allow Calculator</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoSubmit"
                        checked={formData.autoSubmit || false}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            autoSubmit: checked as boolean,
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="autoSubmit">Auto Submit</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Publishing</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="publishQuiz"
                        checked={formData.publishQuiz || false}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            publishQuiz: checked as boolean,
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="publishQuiz">Publish Quiz</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="publishResult"
                        checked={formData.publishResult || false}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            publishResult: checked as boolean,
                          }))
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor="publishResult">Publish Results</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Courses ({quiz.course.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <MultiSelect
                    options={courses.map((course) => ({
                      value: course.id,
                      label: `${course.code} - ${course.name}`,
                    }))}
                    selected={formData.course || []}
                    onChange={(selectedValues) =>
                      setFormData((prev) => ({
                        ...prev,
                        course: selectedValues as string[],
                      }))
                    }
                    placeholder="Select courses..."
                  />
                ) : (
                  <div className="space-y-2">
                    {quiz.course.map((courseId) => {
                      const course = courses.find((c) => c.id === courseId);
                      return course ? (
                        <div
                          key={courseId}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span>
                            {course.code} - {course.name}
                          </span>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                removeFromArray("course", courseId)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Students ({quiz.student.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <MultiSelect
                    options={students.map((student) => ({
                      value: student.id,
                      label: `${student.rollNumber} - ${student.name}`,
                    }))}
                    selected={formData.student || []}
                    onChange={(selectedValues) =>
                      setFormData((prev) => ({
                        ...prev,
                        student: selectedValues as string[],
                      }))
                    }
                    placeholder="Select students..."
                  />
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {quiz.student.map((studentId) => {
                      const student = students.find((s) => s.id === studentId);
                      return student ? (
                        <div
                          key={studentId}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">
                              {student.rollNumber}
                            </p>
                          </div>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                removeFromArray("student", studentId)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Labs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Labs ({quiz.lab.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <MultiSelect
                    options={labs.map((lab) => ({
                      value: lab.id,
                      label: `${lab.name} - ${lab.location}`,
                    }))}
                    selected={formData.lab || []}
                    onChange={(selectedValues) =>
                      setFormData((prev) => ({
                        ...prev,
                        lab: selectedValues as string[],
                      }))
                    }
                    placeholder="Select labs..."
                  />
                ) : (
                  <div className="space-y-2">
                    {quiz.lab.map((labId) => {
                      const lab = labs.find((l) => l.id === labId);
                      return lab ? (
                        <div
                          key={labId}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <p className="font-medium">{lab.name}</p>
                            <p className="text-sm text-gray-500">
                              {lab.location}
                            </p>
                          </div>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromArray("lab", labId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Batches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Batches ({quiz.batch.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <MultiSelect
                    options={batches.map((batch) => ({
                      value: batch.id,
                      label: `${batch.name} (${batch.year})`,
                    }))}
                    selected={formData.batch || []}
                    onChange={(selectedValues) =>
                      setFormData((prev) => ({
                        ...prev,
                        batch: selectedValues as string[],
                      }))
                    }
                    placeholder="Select batches..."
                  />
                ) : (
                  <div className="space-y-2">
                    {quiz.batch.map((batchId) => {
                      const batch = batches.find((b) => b.id === batchId);
                      return batch ? (
                        <div
                          key={batchId}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span>
                            {batch.name} ({batch.year})
                          </span>
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromArray("batch", batchId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Questions</CardTitle>
              <CardDescription>Manage questions for this quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Button
                  onClick={() => router.push(`/quiz/create-quiz`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Questions
                </Button>
                <Button
                  onClick={() => router.push(`/quiz/add-from-bank/${quizId}`)}
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Add from Question Bank
                </Button>
              </div>

              <Alert>
                <AlertDescription>
                  No questions have been added to this quiz yet. Use the buttons
                  above to add questions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Information */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Created:</strong>
              {format(new Date(quiz.createdAt), "PPp")}
            </div>
            <div>
              <strong>Created By:</strong>
              {typeof quiz.createdBy === "string" ? quiz.createdBy : "Faculty"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageQuizPage;
