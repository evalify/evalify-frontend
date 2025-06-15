import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Search, MapPin, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Batch, Course, Student, Lab } from "@/lib/types";

export interface QuizParticipantData {
  students: string[];
  batches: string[];
  courses: string[];
  labs: string[];
}

export interface QuizParticipantProps {
  data: QuizParticipantData;
  updateData: (data: QuizParticipantData) => void;
  students: Student[];
  batches: Batch[];
  courses: Course[];
  labs: Lab[];
  disabled?: boolean;
}

export function QuizParticipant({
  data,
  updateData,
  students,
  batches,
  courses,
  labs,
  disabled = false,
}: QuizParticipantProps) {
  const [searchTerms, setSearchTerms] = useState({
    students: "",
    batches: "",
    courses: "",
    labs: "",
  });

  const handleToggleItem = (
    category: keyof QuizParticipantData,
    itemId: string,
  ) => {
    const currentItems = data[category];
    const updatedItems = currentItems.includes(itemId)
      ? currentItems.filter((id) => id !== itemId)
      : [...currentItems, itemId];

    updateData({ ...data, [category]: updatedItems });
  };

  const handleSelectAll = (
    category: keyof QuizParticipantData,
    allIds: string[],
  ) => {
    updateData({ ...data, [category]: allIds });
  };

  const handleClearAll = (category: keyof QuizParticipantData) => {
    updateData({ ...data, [category]: [] });
  };

  const filterItems = <T extends { id: string }>(
    items: T[],
    searchTerm: string,
    searchFields: (keyof T)[],
  ) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      searchFields.some((field) =>
        String(item[field]).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  const filteredStudents = filterItems(students, searchTerms.students, [
    "name",
    "rollNumber",
  ]);
  const filteredBatches = filterItems(batches, searchTerms.batches, [
    "name",
    "year",
  ]);
  const filteredCourses = filterItems(courses, searchTerms.courses, [
    "name",
    "code",
  ]);
  const filteredLabs = filterItems(labs, searchTerms.labs, [
    "name",
    "location",
  ]);

  const SelectionCard = <T extends { id: string }>({
    title,
    icon: Icon,
    items,
    selectedItems,
    category,
    searchTerm,
    onSearchChange,
    renderItem,
  }: {
    title: string;
    icon: React.ElementType;
    items: T[];
    selectedItems: string[];
    category: keyof QuizParticipantData;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    renderItem: (item: T) => React.ReactNode;
  }) => (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {title}
            <Badge variant="secondary" className="text-xs">
              {selectedItems.length}/{items.length}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            disabled={disabled}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleSelectAll(
                category,
                items.map((item) => item.id),
              )
            }
            disabled={disabled || selectedItems.length === items.length}
            className="flex-1"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClearAll(category)}
            disabled={disabled || selectedItems.length === 0}
            className="flex-1"
          >
            Clear All
          </Button>
        </div>

        <Separator />

        <ScrollArea className="h-64">
          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No {title.toLowerCase()} found
              </p>
            ) : (
              items.map((item: T) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`${category}-${item.id}`}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleToggleItem(category, item.id)}
                    disabled={disabled}
                  />
                  <div className="flex-1 min-w-0">{renderItem(item)}</div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Selection Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.courses.length}
              </div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.students.length}
              </div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.labs.length}
              </div>
              <div className="text-sm text-muted-foreground">Labs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.batches.length}
              </div>
              <div className="text-sm text-muted-foreground">Batches</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SelectionCard
          title="Courses"
          icon={BookOpen}
          items={filteredCourses}
          selectedItems={data.courses}
          category="courses"
          searchTerm={searchTerms.courses}
          onSearchChange={(value) =>
            setSearchTerms((prev) => ({ ...prev, courses: value }))
          }
          renderItem={(course: Course) => (
            <div>
              <div className="font-medium">{course.name}</div>
              <div className="text-sm text-muted-foreground">{course.code}</div>
            </div>
          )}
        />

        <SelectionCard
          title="Students"
          icon={Users}
          items={filteredStudents}
          selectedItems={data.students}
          category="students"
          searchTerm={searchTerms.students}
          onSearchChange={(value) =>
            setSearchTerms((prev) => ({ ...prev, students: value }))
          }
          renderItem={(student: Student) => (
            <div>
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-muted-foreground">
                {student.rollNumber}
              </div>
            </div>
          )}
        />

        <SelectionCard
          title="Labs"
          icon={MapPin}
          items={filteredLabs}
          selectedItems={data.labs}
          category="labs"
          searchTerm={searchTerms.labs}
          onSearchChange={(value) =>
            setSearchTerms((prev) => ({ ...prev, labs: value }))
          }
          renderItem={(lab: Lab) => (
            <div>
              <div className="font-medium">{lab.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {lab.location}
              </div>
            </div>
          )}
        />

        <SelectionCard
          title="Batches"
          icon={Calendar}
          items={filteredBatches}
          selectedItems={data.batches}
          category="batches"
          searchTerm={searchTerms.batches}
          onSearchChange={(value) =>
            setSearchTerms((prev) => ({ ...prev, batches: value }))
          }
          renderItem={(batch: Batch) => (
            <div>
              <div className="font-medium">{batch.name}</div>
              <div className="text-sm text-muted-foreground">{batch.year}</div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
