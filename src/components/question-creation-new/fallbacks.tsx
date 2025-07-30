import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function QuestionCreationSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question input skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Options skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-10 flex-1" />
            </div>
          ))}
        </div>

        {/* Additional settings skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

interface ErrorFallbackProps {
  message?: string;
}

export function QuestionCreationError({
  message = "Oops! An error occurred. Please try again later.",
}: ErrorFallbackProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Something went wrong
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
