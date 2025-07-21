"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Step Components
import { BankSelectionComponent } from "./bank-selection-component";
import { FilterSelectionComponent } from "./filter-selection-component";
import { QuestionSelectionComponent } from "./question-selection-component";
import { SuccessStep } from "./steps";

// Icons
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Database,
  Filter,
  ListChecks,
  Sparkles,
} from "lucide-react";

// Types
import { BankSchema } from "@/repo/bank/bank";
import Bank, { AddBankQuestionDTO, BankQuestion } from "@/repo/bank/bank";

interface MultiStepBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  sectionId: string;
}

interface StepData {
  selectedBank?: BankSchema;
  selectedQuestions?: BankQuestion[];
  addedCount?: number;
}

type StepType = "bank" | "filters" | "questions" | "success";

interface Step {
  id: StepType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: "bank",
    title: "Select Bank",
    description: "Choose a question bank",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "filters",
    title: "Apply Filters",
    description: "Set your question criteria",
    icon: <Filter className="h-4 w-4" />,
  },
  {
    id: "questions",
    title: "Select Questions",
    description: "Choose specific questions",
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    id: "success",
    title: "Complete",
    description: "Questions added successfully",
    icon: <Sparkles className="h-4 w-4" />,
  },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function MultiStepBankModal({
  isOpen,
  onClose,
  quizId,
  sectionId,
}: MultiStepBankModalProps) {
  const { success, error } = useToast();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [stepData, setStepData] = useState<StepData>({});

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Mutation for adding questions to quiz
  const addQuestionsToQuizMutation = useMutation({
    mutationFn: (dto: AddBankQuestionDTO) =>
      Bank.addBankQuestionToQuiz(quizId, dto),
    onSuccess: (response) => {
      setStepData((prev) => ({
        ...prev,
        addedCount: response.addedQuestionsCount,
      }));
      success(
        `Successfully added ${response.addedQuestionsCount} unique questions to the quiz`,
      );
      handleNext();
    },
    onError: (err: Error) => {
      const errorMessage =
        (
          err as unknown as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        ).response?.data?.message ||
        err.message ||
        "Unknown error";
      error("Failed to add questions: " + errorMessage);
    },
  });

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setDirection(1);
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const handleBankSelect = useCallback(
    (bank: BankSchema) => {
      setStepData((prev) => ({ ...prev, selectedBank: bank }));
      handleNext();
    },
    [handleNext],
  );

  const handleQuestionsSelect = useCallback(
    (questions: BankQuestion[]) => {
      setStepData((prev) => ({ ...prev, selectedQuestions: questions }));
      handleNext();
    },
    [handleNext],
  );

  const handleAddQuestions = useCallback(
    (selectedQuestions: BankQuestion[]) => {
      if (selectedQuestions.length === 0) {
        error("Please select at least one question to add to the quiz");
        return;
      }

      // Extract backend IDs from questions
      const backendQuestionIds = selectedQuestions
        .map((q) => {
          const originalData = q._originalData || q;
          return (
            originalData._id ||
            originalData.questionId ||
            originalData.uuid ||
            originalData.question_id ||
            originalData.id ||
            q.id
          );
        })
        .filter((id) => id);

      if (backendQuestionIds.length === 0) {
        error("Could not find valid question IDs. Please try again.");
        return;
      }

      const dto: AddBankQuestionDTO = {
        sectionId: sectionId,
        bankQuestionId: backendQuestionIds,
      };

      addQuestionsToQuizMutation.mutate(dto);
    },
    [sectionId, addQuestionsToQuizMutation, error],
  );

  const handleClose = useCallback(() => {
    setCurrentStepIndex(0);
    setStepData({});
    setDirection(0);
    onClose();
  }, [onClose]);

  const canProceed = useMemo(() => {
    switch (currentStep.id) {
      case "bank":
        return !!stepData.selectedBank;
      case "filters":
        return !!stepData.selectedQuestions?.length; // Can proceed when questions are filtered
      case "questions":
        return !!stepData.selectedQuestions?.length; // Can proceed when questions are selected
      case "success":
        return false;
      default:
        return false;
    }
  }, [currentStep.id, stepData]);

  const renderStepContent = () => {
    switch (currentStep.id) {
      case "bank":
        return (
          <BankSelectionComponent
            onBankSelect={handleBankSelect}
            selectedBank={stepData.selectedBank}
            isInModal={true}
          />
        );
      case "filters":
        return (
          <FilterSelectionComponent
            bankId={stepData.selectedBank?.id || ""}
            quizId={quizId}
            sectionId={sectionId}
            onQuestionsFiltered={handleQuestionsSelect}
          />
        );
      case "questions":
        return (
          <QuestionSelectionComponent
            questions={stepData.selectedQuestions || []}
            onQuestionsSelected={(questions) => {
              setStepData((prev) => ({
                ...prev,
                selectedQuestions: questions,
              }));
            }}
            selectedQuestions={stepData.selectedQuestions}
          />
        );
      case "success":
        return (
          <SuccessStep
            addedCount={stepData.addedCount || 0}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] p-0 overflow-hidden w-[98vw] h-[98vh]">
        {/* Header */}
        <DialogHeader className="p-3 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Add Questions from Bank
              </DialogTitle>
              <p className="text-muted-foreground mt-1">
                {currentStep.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{currentStep.title}</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  index <= currentStepIndex
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    index < currentStepIndex
                      ? "bg-primary border-primary text-primary-foreground"
                      : index === currentStepIndex
                        ? "border-primary bg-primary/10"
                        : "border-muted bg-muted/50"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative min-h-[450px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStepIndex}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 overflow-auto"
            >
              <div className="p-6 min-h-full pb-6">{renderStepContent()}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        {currentStep.id !== "success" && (
          <div className="p-6 pt-4 border-t bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {stepData.selectedBank && (
                  <Badge variant="secondary" className="hidden sm:flex">
                    {stepData.selectedBank.name}
                  </Badge>
                )}
                {stepData.selectedQuestions &&
                  stepData.selectedQuestions.length > 0 && (
                    <Badge
                      variant="default"
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                    >
                      {stepData.selectedQuestions.length} questions selected
                    </Badge>
                  )}
              </div>

              {currentStep.id === "questions" ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      handleAddQuestions(stepData.selectedQuestions || [])
                    }
                    disabled={
                      !stepData.selectedQuestions?.length ||
                      addQuestionsToQuizMutation.isPending
                    }
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
                    size="lg"
                  >
                    {addQuestionsToQuizMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Adding Questions...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Add {stepData.selectedQuestions?.length || 0} Questions
                        to Quiz
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="flex items-center gap-2"
                >
                  {currentStep.id === "filters" ? "Select Questions" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
