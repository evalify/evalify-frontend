"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios/axios-client";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { RefreshCcw } from "lucide-react";

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
}

export default function TestSelectPage() {
  const router = useRouter();
  const { error: showError } = useToast();

  const {
    data: tests,
    isLoading,
    error,
    refetch,
  } = useQuery<Test[]>({
    queryKey: ["available-tests"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/tests/available");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch tests:", error);

        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.status === 404
              ? "No tests are currently available"
              : error.response?.status === 403
                ? "You don't have permission to view tests"
                : error.response?.status === 401
                  ? "Please login to view tests"
                  : "Failed to fetch available tests. Please try again";

          showError(errorMessage);
        } else {
          showError("An unexpected error occurred. Please try again.");
        }

        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleTestSelect = (testId: string) => {
    router.push(`/test/${testId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin">
            <RefreshCcw className="h-5 w-5" />
          </div>
          <span className="text-lg">Loading available tests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-destructive">Failed to load tests</div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Available Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests?.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{test.title}</CardTitle>
              <CardDescription>
                Duration: {test.duration} minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {test.description}
              </p>
              <Button
                className="w-full"
                onClick={() => handleTestSelect(test.id)}
              >
                Start Test
              </Button>
            </CardContent>
          </Card>
        ))}
        {tests?.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            No tests are currently available.
          </div>
        )}
      </div>
    </div>
  );
}
