import React, { ReactNode } from "react";

export default function Layout({
  staff,
  student,
}: {
  staff: ReactNode;
  student: ReactNode;
}) {
  return (
    <div>
      <div>{staff}</div>
      <div>{student}</div>
    </div>
  );
}
