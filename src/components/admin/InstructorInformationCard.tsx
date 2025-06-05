"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Plus, Trash2 } from "lucide-react";

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

interface InstructorInformationCardProps {
  course: Course;
  isEditing: boolean;
  onInstructorChange: (
    index: number,
    field: keyof Instructor,
    value: string,
  ) => void;
  onAddInstructor: () => void;
  onRemoveInstructor: (index: number) => void;
}

export default function InstructorInformationCard({
  course,
  isEditing,
  onInstructorChange,
  onAddInstructor,
  onRemoveInstructor,
}: InstructorInformationCardProps) {
  const instructors = course.instructors || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Instructor Information
          </div>
          {isEditing && (
            <Button size="sm" variant="outline" onClick={onAddInstructor}>
              <Plus className="h-4 w-4 mr-1" />
              Add Instructor
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {instructors.map((instructor, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Instructor {index + 1}
                  </Label>
                  {instructors.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRemoveInstructor(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Name</Label>
                    <Input
                      value={instructor.name}
                      onChange={(e) =>
                        onInstructorChange(index, "name", e.target.value)
                      }
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input
                      type="email"
                      value={instructor.email}
                      onChange={(e) =>
                        onInstructorChange(index, "email", e.target.value)
                      }
                      placeholder="Enter instructor email"
                    />
                  </div>
                </div>
              </div>
            ))}

            {instructors.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No instructors assigned. Click Add Instructor to add some.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {instructors.length > 0 ? (
              instructors.map((instructor, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">
                        Instructor {instructors.length > 1 && index + 1}
                      </Label>
                      <p className="text-lg font-semibold">
                        {instructor.name || "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      {instructor.email ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4" />
                          <a
                            href={`mailto:${instructor.email}`}
                            className="hover:underline"
                          >
                            {instructor.email}
                          </a>
                        </div>
                      ) : (
                        <p className="italic text-muted-foreground">
                          No email provided
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="italic text-muted-foreground">
                No instructors assigned to this course.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
