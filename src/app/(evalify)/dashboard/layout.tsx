"use client";
import React, { ReactNode, useEffect } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import { UserType } from "@/lib/auth/utils";
import { useSidebar } from "@/components/ui/sidebar";

export default function Layout({
  admin,
  staff,
  student,
}: {
  admin: ReactNode;
  staff: ReactNode;
  student: ReactNode;
}) {
  const { open, toggleSidebar } = useSidebar();

  useEffect(() => {
    if (!open) {
      toggleSidebar();
    }
  });

  return (
    <div>
      <AuthGuard
        requiredGroups={[UserType.STAFF, UserType.MANAGER]}
        fallbackComponent={null}
      >
        <div>{staff}</div>
      </AuthGuard>

      <AuthGuard requiredGroups={[UserType.ADMIN]} fallbackComponent={null}>
        <div>{admin}</div>
      </AuthGuard>

      <AuthGuard requiredGroups={[UserType.STUDENT]} fallbackComponent={null}>
        <div>{student}</div>
      </AuthGuard>
    </div>
  );
}
