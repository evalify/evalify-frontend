"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <Button
      type="submit"
      variant="default"
      size="sm"
      onClick={() => signIn("keycloak")}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
    >
      Sign In
    </Button>
  );
}
