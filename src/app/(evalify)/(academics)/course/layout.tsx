import React, { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import { UserType } from "@/lib/auth/utils";

export default function Layout({
  staff,
  student,
}: {
  staff: ReactNode;
  student: ReactNode;
}) {
  return (
    <div>
      <AuthGuard
        requiredGroups={[UserType.STAFF, UserType.MANAGER]}
        fallbackComponent={null}
      >
        <div>{staff}</div>
      </AuthGuard>

      <AuthGuard requiredGroups={[UserType.STUDENT]} fallbackComponent={null}>
        <div>{student}</div>
      </AuthGuard>
    </div>
  );
}
