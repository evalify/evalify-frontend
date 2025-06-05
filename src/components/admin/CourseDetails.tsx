"use client";

import { useState } from "react";
import CourseDetailsHeader from "./CourseDetailsHeader";
import BasicInformationCard from "./BasicInformationCard";
import CourseDescriptionCard from "./CourseDescriptionCard";
import LearningOutcomesCard from "./LearningOutcomesCard";
import InstructorInformationCard from "./InstructorInformationCard";
import QuickActionsCard from "./QuickActionsCard";

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

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
  onEdit: (course: Course) => void;
  onUpdate: (oldCode: string, updatedCourse: Course) => void;
}

export default function CourseDetails({
  course,
  onBack,
  onUpdate,
}: CourseDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course>(course);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original course data if canceling
      setEditedCourse(course);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onUpdate(course.code, editedCourse);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Course, value: string | number) => {
    setEditedCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInstructorChange = (
    index: number,
    field: keyof Instructor,
    value: string,
  ) => {
    const newInstructors = [...(editedCourse.instructors || [])];
    newInstructors[index] = { ...newInstructors[index], [field]: value };
    setEditedCourse((prev) => ({
      ...prev,
      instructors: newInstructors,
    }));
  };

  const addInstructor = () => {
    const newInstructors = [
      ...(editedCourse.instructors || []),
      { name: "", email: "" },
    ];
    setEditedCourse((prev) => ({
      ...prev,
      instructors: newInstructors,
    }));
  };

  const removeInstructor = (index: number) => {
    const newInstructors = (editedCourse.instructors || []).filter(
      (_, i) => i !== index,
    );
    setEditedCourse((prev) => ({
      ...prev,
      instructors: newInstructors.length > 0 ? newInstructors : undefined,
    }));
  };

  const handleLearningOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...(editedCourse.learningOutcomes || [])];
    newOutcomes[index] = value;
    setEditedCourse((prev) => ({
      ...prev,
      learningOutcomes: newOutcomes,
    }));
  };

  const addLearningOutcome = () => {
    const newOutcomes = [...(editedCourse.learningOutcomes || []), ""];
    setEditedCourse((prev) => ({
      ...prev,
      learningOutcomes: newOutcomes,
    }));
  };

  const removeLearningOutcome = (index: number) => {
    const newOutcomes = (editedCourse.learningOutcomes || []).filter(
      (_, i) => i !== index,
    );
    setEditedCourse((prev) => ({
      ...prev,
      learningOutcomes: newOutcomes,
    }));
  };

  const displayCourse = isEditing ? editedCourse : course;

  return (
    <div className="h-screen flex flex-col p-6">
      {/* Header */}
      <CourseDetailsHeader
        course={displayCourse}
        isEditing={isEditing}
        onBack={onBack}
        onEditToggle={handleEditToggle}
        onSave={handleSave}
        onInputChange={handleInputChange}
        showEditControls={true}
      />

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto">
        {/* Course Information - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInformationCard
            course={displayCourse}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />

          <CourseDescriptionCard
            course={displayCourse}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />

          <LearningOutcomesCard
            course={displayCourse}
            isEditing={isEditing}
            onLearningOutcomeChange={handleLearningOutcomeChange}
            onAddLearningOutcome={addLearningOutcome}
            onRemoveLearningOutcome={removeLearningOutcome}
          />
        </div>

        {/* Instructor Information - Right Column */}
        <div className="space-y-6">
          <InstructorInformationCard
            course={displayCourse}
            isEditing={isEditing}
            onInstructorChange={handleInstructorChange}
            onAddInstructor={addInstructor}
            onRemoveInstructor={removeInstructor}
          />

          {/* Quick Actions Card */}
          {!isEditing && <QuickActionsCard onEditToggle={handleEditToggle} />}
        </div>
      </div>
    </div>
  );
}
