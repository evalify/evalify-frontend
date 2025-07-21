"use client";

import React, { useState } from "react";
import { MultiStepBankModal } from "@/components/bank/multi-step-bank-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Plus } from "lucide-react";

export default function MultiStepBankDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Example IDs - replace with actual quiz and section IDs
  const quizId = "aefd84e5-76ba-4ef1-8969-29b3784df73a";
  const sectionId = "aa1d5c1d-0567-41d5-a2d1-ed67e1537722";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Multi-Step Bank Selection Demo</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This demonstrates the new multi-step modal for selecting questions
          from question banks. Click the button below to see the complete flow
          from bank selection to question addition.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Add Questions from Bank
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The multi-step modal includes:
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Step 1: Select a question bank from available options</li>
            <li>Step 2: Apply filters to find specific questions</li>
            <li>Step 3: Review and select individual questions</li>
            <li>Step 4: Success confirmation with added question count</li>
          </ul>

          <div className="pt-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Open Multi-Step Bank Selection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Step Modal */}
      <MultiStepBankModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quizId={quizId}
        sectionId={sectionId}
      />
    </div>
  );
}
