"use client";

import Quiz from "@/repo/quiz/quiz";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuiz, useDeleteQuiz } from "@/hooks/use-quiz-crud";
import React, { use, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Calendar,
  Users,
  FileText,
  Plus,
  Edit,
  Trash2,
  Settings,
  Award,
  Timer,
  Shield,
  Monitor,
  MoreVertical,
  HelpCircle,
  Library,
} from "lucide-react";
import { QuestionRenderer, Question } from "@/components/render-questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Props = {
  params: Promise<{
    courseId: string;
    quizId: string;
  }>;
};

interface QuizSection {
  id: string;
  name: string;
  questionCount?: number;
  totalMarks?: number;
}

interface QuizQuestionResponse {
  question: {
    questionId: string;
    question: string;
    type: string;
    marks: number;
    bloomsTaxonomy: string;
    co: number;
    difficulty: string;
    explanation?: string | null;
    hint?: string | null;
    // Different question type properties
    answers?: boolean; // For TRUE/FALSE
    options?: Array<{
      id: string | null;
      text: string;
      isCorrect: boolean;
    }>; // For MCQ/MMCQ
    blanks?: Array<{
      id: string;
      answers: string[];
    }>; // For FILL_UP
    template?: string; // For FILL_UP
    strictMatch?: boolean;
    llmEval?: boolean;
    expectedAnswer?: string;
    strictness?: number;
    guidelines?: string;
    topics?: Array<{
      id: string;
      name: string;
    }>;
  };
  sectionId: string;
}

const Page = ({ params }: Props) => {
  const param = use(params);
  const { quizId, courseId } = param;
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [isDeleteSectionOpen, setIsDeleteSectionOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [isDeleteQuestionOpen, setIsDeleteQuestionOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isDeleteQuizOpen, setIsDeleteQuizOpen] = useState(false);

  // Use the new CRUD hooks
  const { data: quiz, isLoading: isQuizLoading } = useQuiz(quizId);
  const deleteQuizMutation = useDeleteQuiz();

  const { data: quizSections, isLoading: isSectionsLoading } = useQuery({
    queryKey: ["quizSections", quizId],
    queryFn: () => Quiz.getQuizSections(quizId),
    enabled: !!quizId,
  });

  const { data: quizQuestions, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ["quizQuestions", quizId],
    queryFn: () => Quiz.getQuizQuestions(quizId),
    enabled: !!quizId,
  });

  // const isQuizEditable = true
  const isQuizEditable = useMemo(() => {
    if (!quiz?.status) return true;
    const status = quiz.status.toUpperCase();
    return !["LIVE", "COMPLETED"].includes(status);
  }, [quiz?.status]);

  const createSectionMutation = useMutation({
    mutationFn: (data: { name: string }) =>
      Quiz.createQuizSection(quizId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizSections", quizId] });
      success("Section created successfully");
      setIsCreateSectionOpen(false);
      setSectionName("");
    },
    onError: () => {
      error("Failed to create section");
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string;
      data: { name: string };
    }) => Quiz.updateQuizSection(quizId, sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizSections", quizId] });
      success("Section updated successfully");
      setIsEditSectionOpen(false);
      setEditingSectionId(null);
      setSectionName("");
    },
    onError: () => {
      error("Failed to update section");
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: string) =>
      Quiz.deleteQuizSection(quizId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizSections", quizId] });
      success("Section deleted successfully");
      setIsDeleteSectionOpen(false);
      setSectionToDelete(null);
    },
    onError: () => {
      error("Failed to delete section");
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) =>
      Quiz.deleteQuizQuestion(quizId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizQuestions", quizId] });
      success("Question deleted successfully");
    },
    onError: () => {
      error("Failed to delete question");
    },
  });

  const quizStats = useMemo(() => {
    if (!quizQuestions || !Array.isArray(quizQuestions)) {
      return { totalQuestions: 0, totalMarks: 0 };
    }

    const totalQuestions = quizQuestions.length;
    const totalMarks = quizQuestions.reduce(
      (sum: number, q: QuizQuestionResponse) => sum + (q.question.marks || 0),
      0,
    );

    return { totalQuestions, totalMarks };
  }, [quizQuestions]);

  const getQuestionsForSection = useCallback(
    (sectionId: string) => {
      if (!quizQuestions || !Array.isArray(quizQuestions)) return [];
      return quizQuestions.filter(
        (q: QuizQuestionResponse) => q.sectionId === sectionId,
      );
    },
    [quizQuestions],
  );

  const handleCreateSection = useCallback(() => {
    setIsCreateSectionOpen(true);
  }, []);

  const handleEditSection = useCallback((section: QuizSection) => {
    setEditingSectionId(section.id);
    setSectionName(section.name);
    setIsEditSectionOpen(true);
  }, []);

  const handleDeleteSection = useCallback((sectionId: string) => {
    setSectionToDelete(sectionId);
    setIsDeleteSectionOpen(true);
  }, []);

  const handleCreateSectionSubmit = useCallback(() => {
    if (sectionName.trim()) {
      createSectionMutation.mutate({ name: sectionName.trim() });
    }
  }, [sectionName, createSectionMutation]);

  const handleEditSectionSubmit = useCallback(() => {
    if (sectionName.trim() && editingSectionId) {
      updateSectionMutation.mutate({
        sectionId: editingSectionId,
        data: { name: sectionName.trim() },
      });
    }
  }, [sectionName, editingSectionId, updateSectionMutation]);

  const handleDeleteSectionConfirm = useCallback(() => {
    if (sectionToDelete) {
      deleteSectionMutation.mutate(sectionToDelete);
    }
  }, [sectionToDelete, deleteSectionMutation]);

  const handleEditQuestion = useCallback(
    (questionId: string) => {
      // Navigate to question edit page with quiz and course context
      const { courseId } = param;
      router.push(
        `/question/${questionId}/edit?quizId=${quizId}&courseId=${courseId}`,
      );
    },
    [router, quizId, param],
  );

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestionToDelete(questionId);
    setIsDeleteQuestionOpen(true);
  }, []);

  const handleDeleteQuestionConfirm = useCallback(() => {
    if (questionToDelete) {
      deleteQuestionMutation.mutate(questionToDelete);
      setIsDeleteQuestionOpen(false);
      setQuestionToDelete(null);
    }
  }, [questionToDelete, deleteQuestionMutation]);

  const handleAddQuestion = useCallback(
    (sectionId: string) => {
      // Navigate to question creation page with quiz config
      const { courseId } = param;
      router.push(
        `/course/${courseId}/quiz/${quizId}/question/create?sectionId=${sectionId}`,
      );
    },
    [router, quizId, param],
  );

  const handleAddQuestionFromBank = useCallback(
    (sectionId: string) => {
      // Navigate to question bank selection
      console.log("Add question from bank to section:", sectionId);
      // TODO: Implement question bank selection modal or page
      success("Add from bank", {
        description: `Add question from bank to section ${sectionId}`,
      });
    },
    [success],
  );

  const handleEditQuiz = useCallback(() => {
    // Navigate to quiz edit page using the manage route
    router.push(`/course/${courseId}/quiz/${quizId}/manage`);
  }, [router, courseId, quizId]);

  const handleDeleteQuiz = useCallback(() => {
    setIsDeleteQuizOpen(true);
  }, []);

  const handleDeleteQuizConfirm = useCallback(() => {
    deleteQuizMutation.mutate(quizId, {
      onSuccess: () => {
        setIsDeleteQuizOpen(false);
        // Navigate back to course page after successful deletion
        router.push(`/course/${courseId}/quiz`);
      },
    });
  }, [deleteQuizMutation, quizId, router, courseId]);

  const formatDuration = useCallback((nanoseconds: number) => {
    const hours = Math.floor(nanoseconds / (1000000000 * 60 * 60));
    const minutes = Math.floor(
      (nanoseconds % (1000000000 * 60 * 60)) / (1000000000 * 60),
    );
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  const getStatusBadgeVariant = useCallback((status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "secondary";
      case "active":
        return "default";
      case "draft":
        return "outline";
      default:
        return "secondary";
    }
  }, []);

  if (isQuizLoading || isSectionsLoading || isQuestionsLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Quiz not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Quiz Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{quiz.name}</h1>
            <p className="text-muted-foreground">{quiz.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(quiz.status)}>
              {quiz.status}
            </Badge>
            {isQuizEditable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditQuiz}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Quiz
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteQuiz}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Quiz
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        {/* Quiz Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <FileText className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{quizStats.totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Award className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{quizStats.totalMarks}</p>
                <p className="text-xs text-muted-foreground">Total Marks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Clock className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {formatDuration(quiz.duration)}
                </p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  {quiz.batches?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Batches</p>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Quiz Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <Calendar className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Start Time</p>
                <p className="text-lg font-semibold">
                  {quiz.startTime
                    ? format(new Date(quiz.startTime), "PPp")
                    : "Not set"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Timer className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium">End Time</p>
                <p className="text-lg font-semibold">
                  {quiz.endTime
                    ? format(new Date(quiz.endTime), "PPp")
                    : "Not set"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Shield className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Protection</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={quiz.isProtected ? "destructive" : "secondary"}
                  >
                    {quiz.isProtected ? "Protected" : "Open"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Monitor className="h-8 w-8 text-teal-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Courses</p>
                <div className="flex gap-1 flex-wrap">
                  {quiz.courseCodes?.map((code: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quiz Sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quiz Sections
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateSection}
                disabled={createSectionMutation.isPending || !isQuizEditable}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isQuizEditable && (
            <div className="mb-4 p-3 bg-muted/50 border border-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Quiz editing is disabled because the quiz status is{" "}
                {quiz.status}
              </p>
            </div>
          )}
          {!quizSections || quizSections.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sections created yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first section to organize questions
              </p>
            </div>
          ) : (
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={quizSections[0]?.id ? [quizSections[0].id] : []}
            >
              {quizSections.map((section: QuizSection) => {
                const sectionQuestions = getQuestionsForSection(section.id);
                const sectionMarks = sectionQuestions.reduce(
                  (sum, q) => sum + (q.question.marks || 0),
                  0,
                );
                return (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{section.name}</h3>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              {sectionQuestions.length} Questions
                            </Badge>
                            <Badge variant="outline">
                              {sectionMarks} Marks
                            </Badge>
                          </div>
                        </div>
                        {isQuizEditable && (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditSection(section)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit Section
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteSection(section.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                Section
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {/* Add Questions Buttons */}
                        <div className="flex gap-2 pb-3 border-b">
                          <Button
                            onClick={() => handleAddQuestion(section.id)}
                            disabled={!isQuizEditable}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </Button>
                          <Button
                            onClick={() =>
                              handleAddQuestionFromBank(section.id)
                            }
                            disabled={!isQuizEditable}
                            variant="outline"
                            size="sm"
                          >
                            <Library className="h-4 w-4 mr-2" />
                            From Bank
                          </Button>
                        </div>

                        {/* Questions List */}
                        {sectionQuestions.length === 0 ? (
                          <div className="text-center py-6 border-2 border-dashed border-muted rounded-lg">
                            <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              No questions in this section
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Add questions using the buttons above
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {sectionQuestions.map((questionResponse, index) => {
                              // Transform the question to match the renderer's expected format
                              const question: Question = {
                                ...questionResponse.question,
                                id: questionResponse.question.questionId,
                                type: questionResponse.question
                                  .type as Question["type"],
                              };

                              return (
                                <QuestionRenderer
                                  key={questionResponse.question.questionId}
                                  question={question}
                                  questionNumber={index + 1}
                                  config={{
                                    mode: "display",
                                    showActions: isQuizEditable,
                                    showMarks: true,
                                    showDifficulty: true,
                                    showBloomsTaxonomy: true,
                                    showTopics: true,
                                    showExplanation: true,
                                    showCorrectAnswers: true,
                                    readOnly: !isQuizEditable,
                                  }}
                                  actions={{
                                    onEdit: handleEditQuestion,
                                    onDelete: handleDeleteQuestion,
                                  }}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Create Section Dialog */}
      <Dialog open={isCreateSectionOpen} onOpenChange={setIsCreateSectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
            <DialogDescription>
              Add a new section to organize your quiz questions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section-name">Section Name</Label>
              <Input
                id="section-name"
                placeholder="Enter section name..."
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleCreateSectionSubmit()
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateSectionOpen(false);
                setSectionName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSectionSubmit}
              disabled={!sectionName.trim() || createSectionMutation.isPending}
            >
              {createSectionMutation.isPending
                ? "Creating..."
                : "Create Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={isEditSectionOpen} onOpenChange={setIsEditSectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>Update the section name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section-name">Section Name</Label>
              <Input
                id="edit-section-name"
                placeholder="Enter section name..."
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleEditSectionSubmit()
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditSectionOpen(false);
                setEditingSectionId(null);
                setSectionName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSectionSubmit}
              disabled={!sectionName.trim() || updateSectionMutation.isPending}
            >
              {updateSectionMutation.isPending
                ? "Updating..."
                : "Update Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Section Dialog */}
      <DeleteDialog
        isOpen={isDeleteSectionOpen}
        onClose={() => {
          setIsDeleteSectionOpen(false);
          setSectionToDelete(null);
        }}
        onConfirm={handleDeleteSectionConfirm}
        title="Delete Section"
        description="Are you sure you want to delete this section? This action cannot be undone and will remove all questions in this section."
        isLoading={deleteSectionMutation.isPending}
      />

      {/* Delete Question Dialog */}
      <DeleteDialog
        isOpen={isDeleteQuestionOpen}
        onClose={() => {
          setIsDeleteQuestionOpen(false);
          setQuestionToDelete(null);
        }}
        onConfirm={handleDeleteQuestionConfirm}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        isLoading={deleteQuestionMutation.isPending}
      />

      {/* Delete Quiz Dialog */}
      <DeleteDialog
        isOpen={isDeleteQuizOpen}
        onClose={() => setIsDeleteQuizOpen(false)}
        onConfirm={handleDeleteQuizConfirm}
        title="Delete Quiz"
        description="Are you sure you want to delete this entire quiz? This action cannot be undone and will remove all sections, questions, and associated data."
        isLoading={deleteQuizMutation.isPending}
      />
    </div>
  );
};

export default Page;
