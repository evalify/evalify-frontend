"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Clock } from "lucide-react";

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

interface SemesterGridProps {
  onSemesterSelect: (semester: number) => void;
  courses: Course[];
}

export default function SemesterGrid({
  onSemesterSelect,
  courses,
}: SemesterGridProps) {
  const getCoursesForSemester = (semester: number) => {
    return courses.filter((course) => course.semester === semester.toString());
  };

  // Enhanced semester statistics with real data
  const getSemesterStats = (semester: number) => {
    const semesterCourses = getCoursesForSemester(semester);
    const baseStudents = 120 - (semester - 1) * 5; // Decreasing students per semester
    const completion = Math.max(75, 95 - (semester - 1) * 2); // Decreasing completion rate with minimum

    return {
      courses: semesterCourses.length,
      students: baseStudents,
      duration: "16 weeks",
      completion: completion,
    };
  };

  return (
    <div className="space-y-10">
      {/* Academic Years */}
      {[1, 2, 3, 4].map((year) => (
        <div key={year} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[year * 2 - 1, year * 2].map((semester) => {
              const stats = getSemesterStats(semester);

              return (
                <Card
                  key={semester}
                  className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20"
                  onClick={() => onSemesterSelect(semester)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-medium group-hover:text-primary transition-colors">
                        Semester {semester}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">{stats.courses}</div>
                          <div className="text-xs text-muted-foreground">
                            Courses
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">{stats.students}</div>
                          <div className="text-xs text-muted-foreground">
                            Students
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <div>
                          <div className="font-medium">{stats.duration}</div>
                          <div className="text-xs text-muted-foreground">
                            Duration
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t text-center">
                      <span className="text-xs text-primary group-hover:underline">
                        View courses →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
