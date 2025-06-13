"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import TopBar from "@/components/question_creation/top-bar";
import {
  DetailedTestResultView,
  DetailedTestResult,
} from "@/components/results";
import { MockResultsAPI } from "@/lib/results-api";

export default function TestResultPage() {
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState<DetailedTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestResult = async () => {
      // Use a mock student ID since we're not requiring login
      const mockStudentId = "student-1";

      try {
        setLoading(true);
        setError(null);
        const testId = params.testId as string;

        const data = await MockResultsAPI.getTestResult(mockStudentId, testId);
        setResult(data);
      } catch (err) {
        console.error("Failed to load test result:", err);
        setError("Failed to load test result. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params.testId) {
      loadTestResult();
    }
  }, [params.testId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading test result...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Error Loading Test Result
              </h2>
              <p className="text-muted-foreground mb-4">
                {error || "Test result not found"}
              </p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="container mx-auto px-4 py-8">
        <DetailedTestResultView result={result} onBack={handleBack} />
      </div>
    </div>
  );
}
