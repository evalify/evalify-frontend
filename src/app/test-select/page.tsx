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
import { useToast } from "@/hooks/use-toast";

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
}

export default function TestSelectPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: tests, isLoading } = useQuery<Test[]>({
    queryKey: ["available-tests"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/tests/available");
        return response.data;
      } catch {
        toast("Failed to fetch available tests");
        return [];
      }
    },
  });

  const handleTestSelect = (testId: string) => {
    router.push(`/test/${testId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading available tests...</div>
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
