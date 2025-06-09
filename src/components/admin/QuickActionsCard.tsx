"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, BookOpen, User } from "lucide-react";

interface QuickActionsCardProps {
  onEditToggle: () => void;
}

export default function QuickActionsCard({
  onEditToggle,
}: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button className="w-full" onClick={onEditToggle}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Course Details
          </Button>
          <Button variant="outline" className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            View Syllabus
          </Button>
          <Button variant="outline" className="w-full">
            <User className="h-4 w-4 mr-2" />
            Manage Students
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
