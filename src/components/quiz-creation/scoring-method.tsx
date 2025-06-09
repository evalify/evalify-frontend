"use client";
import React from "react";

type ScoringMethodProps = {
  data: {
    method?: "Standard" | "Weighted";
    pointsPerQuestion?: number;
    penalizeWrongAnswers?: boolean;
    penaltyAmount?: number;
  };
  updateData: (data: ScoringMethodProps["data"]) => void;
};

export function ScoringMethod({}: ScoringMethodProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Scoring settings will be implemented here
        </p>
      </div>
    </div>
  );
}
