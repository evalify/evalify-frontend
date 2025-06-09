"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Target, Plus, Trash2 } from "lucide-react";

interface Instructor {
  name: string;
  email: string;
}

interface Course {
  code: string;
  name: string;
  semester: string;
  status: string;
  credits: number;
  description?: string;
  instructors?: Instructor[];
  learningOutcomes?: string[];
}

interface LearningOutcomesCardProps {
  course: Course;
  isEditing: boolean;
  onLearningOutcomeChange: (index: number, value: string) => void;
  onAddLearningOutcome: () => void;
  onRemoveLearningOutcome: (index: number) => void;
}

export default function LearningOutcomesCard({
  course,
  isEditing,
  onLearningOutcomeChange,
  onAddLearningOutcome,
  onRemoveLearningOutcome,
}: LearningOutcomesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Outcomes
          </div>
          {isEditing && (
            <Button size="sm" variant="outline" onClick={onAddLearningOutcome}>
              <Plus className="h-4 w-4 mr-1" />
              Add Outcome
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            {(course.learningOutcomes || []).map((outcome, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium border">
                  {index + 1}
                </div>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    value={outcome}
                    onChange={(e) =>
                      onLearningOutcomeChange(index, e.target.value)
                    }
                    placeholder={`Learning outcome ${index + 1}`}
                    className="min-h-[60px]"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveLearningOutcome(index)}
                    className="mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!course.learningOutcomes ||
              course.learningOutcomes.length === 0) && (
              <p className="italic">
                No learning outcomes defined. Click Add Outcome to add some.
              </p>
            )}
          </div>
        ) : (
          <>
            {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
              <div className="space-y-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium border">
                      {index + 1}
                    </div>
                    <p className="leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic">
                No learning outcomes defined for this course.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
