"use client";

import React from "react";

// Using React.FC without props since this component doesn't take any props
type StudentOverviewCardProps = React.PropsWithChildren;

export const StudentOverviewCard: React.FC<StudentOverviewCardProps> = () => {
  return (
    <div className="mb-8">{/* Empty space where the cards used to be */}</div>
  );
};
