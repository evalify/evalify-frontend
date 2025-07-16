import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertTriangle, Construction, Hammer } from "lucide-react";

type Props = {
  featureName: string;
  message?: string;
};

function UnderDev({
  featureName,
  message = "This feature is currently under development",
}: Props) {
  return (
    <div className="flex h-[90vh] justify-center items-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Construction className="h-6 w-6 text-yellow-500" />
            <span>{featureName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p>{message}</p>
          </div>
          <div className="flex justify-center">
            <Hammer className="h-24 w-24 text-muted-foreground animate-bounce" />
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Will be available Soon!!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default UnderDev;
