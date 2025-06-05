"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BarChart3, Calendar, Users } from "lucide-react";
import BasicInformationCard from "./BasicInformationCard";
import CourseDescriptionCard from "./CourseDescriptionCard";
import LearningOutcomesCard from "./LearningOutcomesCard";
import InstructorInformationCard from "./InstructorInformationCard";
import PerformanceOverviewCard from "./PerformanceOverviewCard";

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

interface Quiz {
  id: string;
  title: string;
  date: string;
  averageScore: number;
  totalQuestions: number;
  participantCount: number;
}

interface CourseDetailedViewProps {
  course: Course;
  quizzes: Quiz[];
  onBack: () => void;
}

export default function CourseDetailedView({
  course,
  quizzes,
  onBack,
}: CourseDetailedViewProps) {
  const recentQuizzes = quizzes.slice(-5).reverse(); // Get last 5 quizzes, most recent first

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Dummy functions for shared components (not used in view-only mode)
  const dummyInputChange = () => {};
  const dummyLearningOutcomeChange = () => {};
  const dummyAddLearningOutcome = () => {};
  const dummyRemoveLearningOutcome = () => {};
  const dummyInstructorChange = () => {};
  const dummyAddInstructor = () => {};
  const dummyRemoveInstructor = () => {};

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-muted-foreground">
              {course.code} • Semester {course.semester}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reuse existing components in view-only mode */}
            <BasicInformationCard
              course={course}
              isEditing={false}
              onInputChange={dummyInputChange}
            />

            <CourseDescriptionCard
              course={course}
              isEditing={false}
              onInputChange={dummyInputChange}
            />

            <LearningOutcomesCard
              course={course}
              isEditing={false}
              onLearningOutcomeChange={dummyLearningOutcomeChange}
              onAddLearningOutcome={dummyAddLearningOutcome}
              onRemoveLearningOutcome={dummyRemoveLearningOutcome}
            />

            {/* Recent Quizzes - Unique to detailed view */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Quiz Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentQuizzes.length > 0 ? (
                  <div className="space-y-4">
                    {recentQuizzes.map((quiz) => (
                      <div key={quiz.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{quiz.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(quiz.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {quiz.participantCount} participants
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${getScoreColor(quiz.averageScore)}`}
                            >
                              {quiz.averageScore.toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {quiz.totalQuestions} questions
                            </p>
                          </div>
                        </div>
                        <Progress value={quiz.averageScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Quiz Data</h3>
                    <p className="text-muted-foreground">
                      No quizzes have been conducted for this course yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Instructor & Performance */}
          <div className="space-y-6">
            {/* Reuse existing instructor component with correct props */}
            <InstructorInformationCard
              course={course}
              isEditing={false}
              onInstructorChange={dummyInstructorChange}
              onAddInstructor={dummyAddInstructor}
              onRemoveInstructor={dummyRemoveInstructor}
            />

            {/* Performance Overview - Unique to detailed view */}
            <PerformanceOverviewCard
              quizzes={quizzes}
              recentQuizzes={recentQuizzes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
