import React, { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import { UserType } from "@/lib/auth/utils";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AuthGuard requiredGroups={[UserType.ADMIN, UserType.MANAGER]}>
        <div>{children}</div>
      </AuthGuard>
    </div>
  );
}
