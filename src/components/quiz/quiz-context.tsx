"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  QuizContextType,
  QuizStats,
  MatchTheFollowingAnswer,
  FillInTheBlanksAnswer,
  DescriptiveAnswer,
  MCQAnswer,
  CodingAnswer,
  MultipleSelectAnswer,
} from "@/components/quiz/types/types";

interface QuizProviderProps {
  children: React.ReactNode;
  questions: {
    id: string | number;
    sectionId: number;
    type: string;
  }[];
  initialQuestionId?: number;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({
  children,
  questions,
  initialQuestionId,
}: QuizProviderProps) {
  const [questionStatus, setQuestionStatus] = useState<Record<string, number>>(
    () => {
      const initialStatus: Record<string, number> = {};
      questions.forEach((q) => {
        initialStatus[String(q.id)] = 0;
      });
      return initialStatus;
    },
  );

  // Use initialQuestionId if provided, otherwise use the first question
  const firstQuestionId = initialQuestionId || questions[0]?.id || 0;
  const [currentQuestionId, setCurrentQuestionId] = useState<string | number>(
    firstQuestionId,
  );

  // Find the section corresponding to the initial question
  const initialQuestion = questions.find(
    (q) => String(q.id) === String(firstQuestionId),
  );
  const [currentSectionId, setCurrentSectionId] = useState<number>(
    initialQuestion?.sectionId || questions[0]?.sectionId || 0,
  );

  const [matchAnswers, setMatchAnswersState] = useState<
    Record<string, MatchTheFollowingAnswer[]>
  >({});
  const [blanksAnswers, setBlanksAnswersState] = useState<
    Record<string, FillInTheBlanksAnswer>
  >({});
  const [descriptiveAnswers, setDescriptiveAnswersState] = useState<
    Record<string, DescriptiveAnswer>
  >({});
  const [mcqAnswers, setMCQAnswersState] = useState<Record<string, MCQAnswer>>(
    {},
  );
  const [codingAnswers, setCodingAnswersState] = useState<
    Record<string, CodingAnswer>
  >({});
  const [multipleSelectAnswers, setMultipleSelectAnswersState] = useState<
    Record<string, MultipleSelectAnswer>
  >({});

  const [stats, setStats] = useState<QuizStats>({
    attempted: 0,
    viewed: 0,
    notViewed: questions.length,
    forReview: 0,
    total: questions.length,
  });

  const markQuestionAttempted = useCallback((id: string | number) => {
    setQuestionStatus((prev) => ({
      ...prev,
      [String(id)]: 1,
    }));
  }, []);

  // Updated to always mark as viewed
  const markQuestionViewed = useCallback((id: string | number) => {
    setQuestionStatus((prev) => ({
      ...prev,
      [String(id)]: 2,
    }));
  }, []);

  const markQuestionForReview = useCallback((id: string | number) => {
    setQuestionStatus((prev) => ({
      ...prev,
      [String(id)]: 4,
    }));
  }, []);

  // Updated MCQ answer handler
  const setMCQAnswers = useCallback(
    (questionId: string | number, answer: MCQAnswer) => {
      setMCQAnswersState((prev) => ({
        ...prev,
        [String(questionId)]: answer,
      }));
      // Only mark attempted if selectedOption is valid index
      if (answer.selectedOption >= 0) {
        markQuestionAttempted(questionId);
      }
    },
    [markQuestionAttempted],
  );

  // Other answer handlers remain the same
  const setMatchAnswers = useCallback(
    (questionId: string | number, answers: MatchTheFollowingAnswer[]) => {
      setMatchAnswersState((prev) => ({
        ...prev,
        [String(questionId)]: answers,
      }));
      if (answers.length > 0) markQuestionAttempted(questionId);
    },
    [markQuestionAttempted],
  );

  const setBlanksAnswers = useCallback(
    (questionId: string | number, answers: FillInTheBlanksAnswer) => {
      setBlanksAnswersState((prev) => ({
        ...prev,
        [String(questionId)]: answers,
      }));
      if (answers.blanks.some((blank) => blank.trim() !== ""))
        markQuestionAttempted(questionId);
    },
    [markQuestionAttempted],
  );

  const setDescriptiveAnswers = useCallback(
    (questionId: string | number, answer: DescriptiveAnswer) => {
      setDescriptiveAnswersState((prev) => ({
        ...prev,
        [String(questionId)]: answer,
      }));
      if (answer.text.trim() !== "") markQuestionAttempted(questionId);
    },
    [markQuestionAttempted],
  );

  const setCodingAnswers = useCallback(
    (
      questionId: string | number,
      answer: CodingAnswer,
      hasChanged: boolean = false,
    ) => {
      setCodingAnswersState((prev) => ({
        ...prev,
        [String(questionId)]: answer,
      }));

      // Mark as attempted only if there's been a change made by the user
      if (hasChanged) {
        markQuestionAttempted(questionId);
      } else {
        // Mark as viewed if not already attempted
        setQuestionStatus((prev) => {
          // Only update to viewed (2) if it's not already attempted (1)
          if (prev[String(questionId)] !== 1) {
            return {
              ...prev,
              [String(questionId)]: 2, // viewed status
            };
          }
          return prev;
        });
      }
    },
    [markQuestionAttempted, setQuestionStatus],
  );

  // Multiple select answer handler
  const setMultipleSelectAnswers = useCallback(
    (questionId: string | number, answer: MultipleSelectAnswer) => {
      setMultipleSelectAnswersState((prev) => ({
        ...prev,
        [String(questionId)]: answer,
      }));
      // Mark as attempted if at least one option is selected
      if (answer.selectedOptions.length > 0) {
        markQuestionAttempted(questionId);
      }
    },
    [markQuestionAttempted],
  );

  const handleSetCurrentQuestionId = useCallback(
    (id: string | number) => {
      setQuestionStatus((prev) => {
        const updatedStatus = { ...prev };
        if (
          currentQuestionId &&
          updatedStatus[String(currentQuestionId)] === 0
        ) {
          updatedStatus[String(currentQuestionId)] = 2;
        }
        return updatedStatus;
      });

      setCurrentQuestionId(id);
      const question = questions.find((q) => String(q.id) === String(id));
      if (question) setCurrentSectionId(question.sectionId);
    },
    [currentQuestionId, questions],
  );

  useEffect(() => {
    const newStats: QuizStats = {
      attempted: 0,
      viewed: 0,
      notViewed: 0,
      forReview: 0,
      total: questions.length,
    };

    Object.entries(questionStatus).forEach(([, status]) => {
      if (status === 0) newStats.notViewed++;
      else if (status === 1) newStats.attempted++;
      else if (status === 2) newStats.viewed++;
      else if (status === 4) newStats.forReview++;
    });

    setStats(newStats);
  }, [questionStatus, questions.length]);

  return (
    <QuizContext.Provider
      value={{
        questionStatus,
        currentQuestionId,
        currentSectionId,
        setCurrentQuestionId: handleSetCurrentQuestionId,
        setCurrentSectionId,
        markQuestionAttempted,
        markQuestionViewed,
        markQuestionForReview,
        setMatchAnswers,
        matchAnswers,
        blanksAnswers,
        setBlanksAnswers,
        descriptiveAnswers,
        setDescriptiveAnswers,
        mcqAnswers,
        setMCQAnswers,
        codingAnswers,
        setCodingAnswers,
        multipleSelectAnswers,
        setMultipleSelectAnswers,
        stats,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
