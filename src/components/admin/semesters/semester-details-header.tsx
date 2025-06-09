import React from "react";
import { Semester } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SemesterDetailsHeaderProps {
  semester: Semester;
}

const SemesterDetailsHeader: React.FC<SemesterDetailsHeaderProps> = ({
  semester,
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-semibold">{semester.name}</span>
          <Badge
            variant={semester.isActive ? "default" : "secondary"}
            className="capitalize"
          >
            {semester.isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Year: {semester.year}</p>
      </CardContent>
    </Card>
  );
};

export default SemesterDetailsHeader;
