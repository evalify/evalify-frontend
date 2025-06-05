"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Trash2, Eye } from "lucide-react";

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

interface CourseTableProps {
  filteredCourses: Course[];
  isSelectMode: boolean;
  selectedCourses: Set<string>;
  selectedCourseForAction: Course | null;
  onCourseClick: (course: Course) => void;
  onCourseSelect: (courseCode: string, checked: boolean) => void;
  onEditClick: (course: Course) => void;
  onDeleteClick: (course: Course) => void;
  onOpenClick: (course: Course) => void;
}

export default function CourseTable({
  filteredCourses,
  isSelectMode,
  selectedCourses,
  selectedCourseForAction,
  onCourseClick,
  onCourseSelect,
  onEditClick,
  onDeleteClick,
  onOpenClick,
}: CourseTableProps) {
  return (
    <div className="flex-1 flex flex-col px-4 pb-4 min-h-0">
      <div className="flex items-center justify-between px-4 py-2 font-medium text-sm border-b flex-shrink-0">
        {isSelectMode && <div className="w-12"></div>}
        <div className={isSelectMode ? "w-1/6" : "w-1/5"}>Course Code</div>
        <div className={isSelectMode ? "w-1/6" : "w-1/5"}>Course Name</div>
        <div className={isSelectMode ? "w-1/6" : "w-1/5"}>Semester</div>
        <div className={isSelectMode ? "w-1/6" : "w-1/5"}>Credits</div>
        <div className={isSelectMode ? "w-1/6" : "w-1/5"}>Status</div>
        {!isSelectMode && <div className="w-24">Actions</div>}
      </div>

      <ScrollArea className="flex-1 w-full border rounded-md">
        <div className="divide-y">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div
                key={`${course.code}-${index}`}
                className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                  selectedCourses.has(course.code) ? "bg-muted/50" : ""
                } ${
                  !isSelectMode && selectedCourseForAction?.code === course.code
                    ? "bg-accent/50"
                    : !isSelectMode
                      ? "hover:bg-muted/30 cursor-pointer"
                      : ""
                }`}
                onClick={() => !isSelectMode && onCourseClick(course)}
              >
                {isSelectMode && (
                  <div className="w-12 flex justify-center">
                    <Checkbox
                      checked={selectedCourses.has(course.code)}
                      onCheckedChange={(checked) =>
                        onCourseSelect(course.code, checked as boolean)
                      }
                    />
                  </div>
                )}
                <div className={isSelectMode ? "w-1/6" : "w-1/5"}>
                  {course.code}
                </div>
                <div className={isSelectMode ? "w-1/6" : "w-1/5"}>
                  {course.name}
                </div>
                <div className={isSelectMode ? "w-1/6" : "w-1/5"}>
                  {course.semester}
                </div>
                <div className={isSelectMode ? "w-1/6" : "w-1/5"}>
                  {course.credits}
                </div>
                <div className={isSelectMode ? "w-1/6" : "w-1/5"}>
                  {course.status}
                </div>

                {!isSelectMode && (
                  <div className="w-24 flex gap-1">
                    {selectedCourseForAction?.code === course.code ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenClick(course);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(course);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(course);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <div className="w-full h-7"></div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No courses found matching your filters.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
