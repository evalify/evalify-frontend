"use client";

import { useQuery } from "@tanstack/react-query";
import { use, useMemo, useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Clock,
  MapPin,
  Calendar,
  Monitor,
  Shield,
  Shuffle,
  Calculator,
  FileText,
  Eye,
  Lock,
  Timer,
  AlertTriangle,
  Info,
  CheckCircle,
  Play,
} from "lucide-react";

import Quiz from "@/repo/quiz/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Course, Lab } from "@/types/types";

type Props = {
  params: Promise<{
    quizId: string;
  }>;
};

const QuizInstructionsPage = (props: Props) => {
  const { params } = props;
  const { quizId } = use(params);
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(Date.now());

  const {
    data: quizData,
    error,
    refetch,
  } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => await Quiz.getQuizById(quizId),
    refetchOnWindowFocus: false,
    enabled: !!quizId,
  });

  // Update current time every second for precise timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Refetch quiz data when quiz should become active
  useEffect(() => {
    if (!quizData) return;

    const startTime = new Date(quizData.startTime).getTime();
    const timeUntilStart = startTime - currentTime;

    if (timeUntilStart > 0 && timeUntilStart <= 60000) {
      // Within 1 minute of start
      const checkInterval = setInterval(() => {
        const now = Date.now();
        if (now >= startTime) {
          refetch(); // Refetch to get updated quiz status
          clearInterval(checkInterval);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(checkInterval);
    }
  }, [quizData, currentTime, refetch]);

  // Format duration from nanoseconds to readable format
  const formatDuration = (nanoseconds: number) => {
    const totalMs = nanoseconds / 1_000_000;
    const hours = Math.floor(totalMs / 3_600_000);
    const minutes = Math.floor((totalMs % 3_600_000) / 60_000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Check if quiz is currently active - using real-time current time
  const isQuizActive = useMemo(() => {
    if (!quizData) return false;
    const startTime = new Date(quizData.startTime).getTime();
    const endTime = new Date(quizData.endTime).getTime();
    return (
      currentTime >= startTime &&
      currentTime <= endTime &&
      quizData.status === "ACTIVE"
    );
  }, [quizData, currentTime]);

  // Check if quiz hasn't started yet - using real-time current time
  const isQuizUpcoming = useMemo(() => {
    if (!quizData) return false;
    const startTime = new Date(quizData.startTime).getTime();
    return currentTime < startTime;
  }, [quizData, currentTime]);

  // Calculate time remaining until quiz starts
  const timeUntilStart = useMemo(() => {
    if (!quizData || !isQuizUpcoming) return null;
    const startTime = new Date(quizData.startTime).getTime();
    const diff = startTime - currentTime;
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { minutes, seconds };
  }, [quizData, isQuizUpcoming, currentTime]);

  const handleStartQuiz = () => {
    router.push(`/exam/quiz/${quizId}`);
  };

  if (error || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Card className="max-w-lg w-full mx-4">
          <CardContent className="text-center py-16">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
            <p className="text-muted-foreground text-lg">
              {`The quiz you're looking for doesn't exist or has been removed.`}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-border">
        <div className="px-4 py-4">
          <div className="text-center space-y-3">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {quizData.name}
              </h1>
              {quizData.description && (
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  {quizData.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Badge
                variant={
                  isQuizActive
                    ? "default"
                    : isQuizUpcoming
                      ? "secondary"
                      : "outline"
                }
                className="text-xs px-3 py-1"
              >
                {isQuizActive
                  ? "LIVE NOW"
                  : isQuizUpcoming
                    ? "UPCOMING"
                    : quizData.status}
              </Badge>
              {quizData.isProtected && (
                <Badge variant="destructive" className="text-xs px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {/* Key Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">
                    {formatDuration(quizData.duration)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="text-sm font-semibold">
                    {format(new Date(quizData.startTime), "MMM dd, hh:mm a")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Timer className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">End Time</p>
                  <p className="text-sm font-semibold">
                    {format(new Date(quizData.endTime), "MMM dd, hh:mm a")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Alerts */}
        <div className="space-y-3 mb-6">
          {isQuizUpcoming && (
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-800 dark:text-blue-200 text-sm font-bold">
                Quiz Not Yet Started
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300 text-xs">
                This quiz will begin on{" "}
                {format(
                  new Date(quizData.startTime),
                  "EEEE, MMMM dd, yyyy 'at' hh:mm a",
                )}
                .
              </AlertDescription>
            </Alert>
          )}

          {quizData.isProtected && (
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertTitle className="text-sm font-bold">
                Secure Quiz Environment
              </AlertTitle>
              <AlertDescription className="text-xs">
                This quiz runs in secure mode. Avoid switching tabs or
                applications.
              </AlertDescription>
            </Alert>
          )}

          {quizData.autoSubmit && (
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-200 text-sm font-bold">
                Auto-Submit Enabled
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300 text-xs">
                Quiz will be automatically submitted when time expires.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Faculty Instructions - Show prominently if available */}
        {quizData.instructions && quizData.instructions.trim() && (
          <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-lg">
                <FileText className="h-4 w-4" />
                Instructions from Faculty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue dark:prose-invert max-w-none">
                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {quizData.instructions}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Quiz Settings */}
          <div className="xl:col-span-3 space-y-6">
            {/* Quiz Features */}
            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-900/80">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Info className="h-5 w-5 text-primary" />
                  Quiz Settings & Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div
                      className={`p-2 rounded-lg ${quizData.fullScreen ? "bg-green-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"}`}
                    >
                      <Monitor className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Full Screen Mode</p>
                      <p className="text-xs text-muted-foreground">
                        {quizData.fullScreen ? "Required" : "Not required"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div
                      className={`p-2 rounded-lg ${quizData.shuffleQuestions ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"}`}
                    >
                      <Shuffle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Question Order</p>
                      <p className="text-xs text-muted-foreground">
                        {quizData.shuffleQuestions
                          ? "Randomized"
                          : "Fixed order"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div
                      className={`p-2 rounded-lg ${quizData.shuffleOptions ? "bg-purple-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"}`}
                    >
                      <Shuffle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Answer Options</p>
                      <p className="text-xs text-muted-foreground">
                        {quizData.shuffleOptions ? "Randomized" : "Fixed order"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div
                      className={`p-2 rounded-lg ${quizData.calculator ? "bg-green-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"}`}
                    >
                      <Calculator className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Calculator</p>
                      <p className="text-xs text-muted-foreground">
                        {quizData.calculator ? "Available" : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div
                      className={`p-2 rounded-lg ${quizData.linearQuiz ? "bg-orange-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"}`}
                    >
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Navigation</p>
                      <p className="text-xs text-muted-foreground">
                        {quizData.linearQuiz
                          ? "Linear - cannot go back"
                          : "Free navigation"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div
                      className={`p-2 rounded-lg ${quizData.publishResult ? "bg-green-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"}`}
                    >
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Results</p>
                      <p className="text-xs text-muted-foreground">
                        {quizData.publishResult
                          ? "Shown immediately"
                          : "Available later"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Guidelines */}
            <Card className="shadow-sm border-0 bg-white/80 dark:bg-slate-900/80">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  General Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg mt-0.5">
                        <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Read Carefully</p>
                        <p className="text-xs text-muted-foreground">
                          Read all questions thoroughly.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mt-0.5">
                        <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Navigation</p>
                        <p className="text-xs text-muted-foreground">
                          Use navigation buttons to move between questions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg mt-0.5">
                        <CheckCircle className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Time Management</p>
                        <p className="text-xs text-muted-foreground">
                          Submit before time expires.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg mt-0.5">
                        <CheckCircle className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Connection</p>
                        <p className="text-xs text-muted-foreground">
                          Ensure stable internet connection.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            {/* Course Information */}
            {quizData.courseCodes && quizData.courseCodes.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quizData.courseCodes.map((course: Course) => (
                    <div key={course.id} className="p-3 rounded-lg bg-muted/30">
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {course.courseCode as string}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Lab Requirements */}
            {quizData.labs && quizData.labs.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Authorized Labs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quizData.labs.map((lab: Lab) => (
                    <div key={lab.id} className="p-3 rounded-lg bg-muted/30">
                      <p className="font-medium">{lab.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {lab.block}
                      </p>
                      {lab.ipSubnet && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {lab.ipSubnet}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quiz Sets */}
            {quizData.noOfSets > 1 && (
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Question Sets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {quizData.noOfSets}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Different question sets available
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 mb-8">
          {/* Countdown Timer for Upcoming Quiz */}
          {isQuizUpcoming && timeUntilStart && (
            <div className="text-center mb-8">
              <Card className="inline-block shadow-2xl border-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 backdrop-blur-sm">
                <CardContent className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Quiz starts in
                      </p>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {timeUntilStart.minutes}m {timeUntilStart.seconds}s
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Start Button */}
          <div className="flex justify-center">
            {isQuizActive ? (
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Button
                  size="lg"
                  className="relative px-12 py-4 text-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105 hover:shadow-green-500/25"
                  onClick={handleStartQuiz}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Play className="h-6 w-6" />
                    </div>
                    <span>Start Quiz Now</span>
                  </div>
                </Button>
              </div>
            ) : isQuizUpcoming ? (
              <div className="relative">
                <Button
                  size="lg"
                  variant="outline"
                  disabled
                  className="px-12 py-4 text-xl font-semibold bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg text-gray-500 dark:text-gray-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full">
                      <Clock className="h-6 w-6" />
                    </div>
                    <span>Quiz Not Yet Available</span>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Button
                  size="lg"
                  variant="outline"
                  disabled
                  className="px-12 py-4 text-xl font-semibold bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl shadow-lg text-red-500 dark:text-red-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-200 dark:bg-red-800 rounded-full">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <span>Quiz No Longer Available</span>
                  </div>
                </Button>
              </div>
            )}
          </div>

          {/* Additional Status Information */}
          {isQuizActive && (
            <div className="text-center mt-6">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✨ Quiz is live and ready to start!
              </p>
            </div>
          )}

          {isQuizUpcoming && (
            <div className="text-center mt-6">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                🕒 Please wait for the quiz to begin
              </p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Please review all instructions carefully before starting the quiz.
            If you have any questions, contact your instructor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizInstructionsPage;
