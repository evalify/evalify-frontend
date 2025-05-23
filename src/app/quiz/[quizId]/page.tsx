"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import TestHeader from "@/components/quiz/test-header";
import TestContent from "@/components/quiz/test-content";
import Sidebar from "@/components/quiz/sidebar";
import { QuizProvider } from "@/components/quiz/quiz-context";
import { getQuizData, processQuizData } from "@/lib/quiz-data";
import { useState } from "react";
import { QuizData } from "@/components/quiz/types/types";

export default function QuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { quizId } = params;
  // Get questionId from query parameter, default to 1 if not present
  const questionId = searchParams.get("questionId") || "1";

  const [data, setData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialQuestionId = parseInt(questionId);

  // Fetch quiz data based on quizId
  useEffect(() => {
    async function loadQuizData() {
      setLoading(true);
      setError(null);
      try {
        const quizData = await getQuizData(quizId as string);
        const processedData = processQuizData(quizData);
        setData(processedData);
      } catch (error) {
        console.error("Failed to load quiz data:", error);
        setError("Failed to load quiz data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadQuizData();
  }, [quizId]);

  // Update URL when questionId changes but without causing a refresh
  const updateQuestionInUrl = (newQuestionId: number | string) => {
    // Update the URL without refreshing the page
    const url = new URL(window.location.href);
    url.searchParams.set("questionId", String(newQuestionId));
    router.replace(url.pathname + url.search);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading quiz...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Display no data state (fallback)
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No quiz data found.</p>
      </div>
    );
  }

  return (
    <QuizProvider
      questions={data.questions}
      initialQuestionId={initialQuestionId}
    >
      <div className="flex flex-col min-h-screen">
        <TestHeader />
        <div className="flex flex-col md:flex-row flex-1">
          <div className="flex-1 border-r border-gray-700">
            <TestContent
              data={data}
              quizId={quizId as string}
              onQuestionChange={updateQuestionInUrl}
            />
          </div>
          <div className="w-full md:w-96 border-l border-gray-700">
            <Sidebar
              data={data}
              quizId={quizId as string}
              onQuestionChange={updateQuestionInUrl}
            />
          </div>
        </div>
      </div>
    </QuizProvider>
  );
}
