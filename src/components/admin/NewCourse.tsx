"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Counter from "./Counter";
import { Plus, Trash2 } from "lucide-react";

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

interface NewCourseProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCourse?: (course: Course) => void;
  onUpdateCourse?: (oldCode: string, updatedCourse: Course) => void;
  editingCourse?: Course | null;
}

export default function NewCourse({
  isOpen,
  onClose,
  onCreateCourse,
  onUpdateCourse,
  editingCourse,
}: NewCourseProps) {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState(1);
  const [status, setStatus] = useState("active");
  const [credits, setCredits] = useState(3);
  const [description, setDescription] = useState("");
  const [instructors, setInstructors] = useState<Instructor[]>([
    { name: "", email: "" },
  ]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);

  const isEditing = !!editingCourse;

  // Pre-fill form when editing
  useEffect(() => {
    if (editingCourse) {
      setCourseCode(editingCourse.code);
      setCourseName(editingCourse.name);
      setSemester(Number.parseInt(editingCourse.semester));
      setStatus(editingCourse.status.toLowerCase());
      setCredits(editingCourse.credits);
      setDescription(editingCourse.description || "");
      setInstructors(editingCourse.instructors || [{ name: "", email: "" }]);
      setLearningOutcomes(editingCourse.learningOutcomes || []);
    } else {
      resetForm();
    }
  }, [editingCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!courseCode.trim() || !courseName.trim() || !status || credits < 1) {
      alert("Please fill in all required fields");
      return;
    }

    // Filter out empty instructors
    const validInstructors = instructors.filter(
      (instructor) => instructor.name.trim() || instructor.email.trim(),
    );

    // Create course object
    const courseData: Course = {
      code: courseCode.trim(),
      name: courseName.trim(),
      semester: semester.toString(),
      status: status.charAt(0).toUpperCase() + status.slice(1),
      credits: credits,
      description: description.trim() || undefined,
      instructors: validInstructors.length > 0 ? validInstructors : undefined,
      learningOutcomes:
        learningOutcomes.length > 0
          ? learningOutcomes.filter((outcome) => outcome.trim() !== "")
          : undefined,
    };

    if (isEditing && onUpdateCourse && editingCourse) {
      // Update existing course
      onUpdateCourse(editingCourse.code, courseData);
    } else if (onCreateCourse) {
      // Create new course
      onCreateCourse(courseData);
    }

    // Reset form and close modal
    resetForm();
    onClose();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCourseCode("");
    setCourseName("");
    setSemester(1);
    setStatus("active");
    setCredits(3);
    setDescription("");
    setInstructors([{ name: "", email: "" }]);
    setLearningOutcomes([]);
  };

  const handleInstructorChange = (
    index: number,
    field: keyof Instructor,
    value: string,
  ) => {
    const newInstructors = [...instructors];
    newInstructors[index] = { ...newInstructors[index], [field]: value };
    setInstructors(newInstructors);
  };

  const addInstructor = () => {
    setInstructors([...instructors, { name: "", email: "" }]);
  };

  const removeInstructor = (index: number) => {
    if (instructors.length > 1) {
      const newInstructors = instructors.filter((_, i) => i !== index);
      setInstructors(newInstructors);
    }
  };

  const handleLearningOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes[index] = value;
    setLearningOutcomes(newOutcomes);
  };

  const addLearningOutcome = () => {
    setLearningOutcomes([...learningOutcomes, ""]);
  };

  const removeLearningOutcome = (index: number) => {
    const newOutcomes = learningOutcomes.filter((_, i) => i !== index);
    setLearningOutcomes(newOutcomes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 overflow-y-auto">
      <Card className="w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto my-8">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Course" : "Create Course"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  name="courseCode"
                  placeholder="Enter course code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  name="courseName"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="semester">Semester</Label>
                <Counter value={semester} onChange={setSemester} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Enter credits"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                />
              </div>

              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  defaultValue="active"
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectGroup>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Course Description */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Instructors Information */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <Label>Instructors</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInstructor}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Instructor
                </Button>
              </div>

              {instructors.map((instructor, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg"
                >
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`instructorName-${index}`}>
                      Instructor Name
                    </Label>
                    <Input
                      id={`instructorName-${index}`}
                      placeholder="Enter instructor name"
                      value={instructor.name}
                      onChange={(e) =>
                        handleInstructorChange(index, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`instructorEmail-${index}`}>
                      Instructor Email
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`instructorEmail-${index}`}
                        type="email"
                        placeholder="Enter instructor email"
                        value={instructor.email}
                        onChange={(e) =>
                          handleInstructorChange(index, "email", e.target.value)
                        }
                        className="flex-1"
                      />
                      {instructors.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => removeInstructor(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Outcomes */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <Label>Learning Outcomes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLearningOutcome}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Outcome
                </Button>
              </div>

              {learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 border rounded-full flex items-center justify-center text-sm mt-2">
                    {index + 1}
                  </div>
                  <Textarea
                    value={outcome}
                    onChange={(e) =>
                      handleLearningOutcomeChange(index, e.target.value)
                    }
                    placeholder={`Learning outcome ${index + 1}`}
                    className="flex-1 min-h-[60px]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeLearningOutcome(index)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
