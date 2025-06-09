"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";

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

interface BasicInformationCardProps {
  course: Course;
  isEditing: boolean;
  onInputChange: (field: keyof Course, value: string | number) => void;
}

export default function BasicInformationCard({
  course,
  isEditing,
  onInputChange,
}: BasicInformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Course Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Course Code</Label>
              {isEditing ? (
                <Input
                  value={course.code}
                  onChange={(e) => onInputChange("code", e.target.value)}
                  placeholder="Enter course code"
                />
              ) : (
                <p className="text-lg font-semibold">{course.code}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Course Name</Label>
              {isEditing ? (
                <Input
                  value={course.name}
                  onChange={(e) => onInputChange("name", e.target.value)}
                  placeholder="Enter course name"
                />
              ) : (
                <p className="text-lg font-semibold">{course.name}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Credits</Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={course.credits}
                  onChange={(e) =>
                    onInputChange("credits", Number(e.target.value))
                  }
                  placeholder="Enter credits"
                />
              ) : (
                <p className="text-lg font-semibold">
                  {course.credits} Credits
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Semester</Label>
              {isEditing ? (
                <Select
                  value={course.semester}
                  onValueChange={(value) => onInputChange("semester", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-lg font-semibold">
                  Semester {course.semester}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              {isEditing ? (
                <Select
                  defaultValue="active"
                  value={course.status.toLowerCase()}
                  onValueChange={(value) =>
                    onInputChange(
                      "status",
                      value.charAt(0).toUpperCase() + value.slice(1),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  <Badge>{course.status}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
