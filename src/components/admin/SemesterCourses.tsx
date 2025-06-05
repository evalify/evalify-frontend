"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  BookOpen,
  User,
  GraduationCap,
  Clock,
  Users,
} from "lucide-react";

interface Course {
  code: string;
  name: string;
  semester: string;
  status: string;
  credits: number;
  description?: string;
  instructorName?: string;
  instructorEmail?: string;
  learningOutcomes?: string[];
}

interface SemesterCoursesProps {
  semester: number;
  courses: Course[];
  onBack: () => void;
  onCourseSelect: (course: Course) => void;
}

export default function SemesterCourses({
  semester,
  courses,
  onBack,
  onCourseSelect,
}: SemesterCoursesProps) {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const activeCourses = courses.filter(
    (course) => course.status === "Active",
  ).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Semesters
          </Button>

          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Semester {semester}
              </h1>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{courses.length}</div>
                      <div className="text-sm text-muted-foreground">
                        Total Courses
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-green-500/10">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalCredits}</div>
                      <div className="text-sm text-muted-foreground">
                        Total Credits
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-500/10">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{activeCourses}</div>
                      <div className="text-sm text-muted-foreground">
                        Active Courses
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-orange-500/10">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">16</div>
                      <div className="text-sm text-muted-foreground">Weeks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.code}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border hover:border-primary/20"
                onClick={() => onCourseSelect(course)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        {course.code}
                      </CardTitle>
                      <h3 className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {course.name}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        course.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-semibold">{course.credits}</span>{" "}
                        Credits
                      </span>
                    </div>

                    {course.instructorName && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">
                          {course.instructorName}
                        </span>
                      </div>
                    )}
                  </div>

                  {course.description && (
                    <>
                      <Separator />
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </>
                  )}

                  <div className="pt-2 border-t">
                    <div className="text-sm text-center text-muted-foreground group-hover:text-primary transition-colors">
                      Click to view details and performance →
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                No Courses Available
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no courses assigned to Semester {semester} at this
                time. Please check back later or contact the academic office.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
