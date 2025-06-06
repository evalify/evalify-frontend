"use client";

import { Shield, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function AccessDenied({
  title = "Access Denied",
  description = "You don't have permission to access this page. Please contact your administrator if you believe this is an error.",
  showBackButton = true,
  showHomeButton = true,
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold ">{title}</CardTitle>
          <CardDescription className="">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {showBackButton && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          )}
          {showHomeButton && (
            <Button className="w-full" onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
