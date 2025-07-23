"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/use-navigation";
import { cn } from "@/lib/utils";

interface NavigationControlsProps {
  className?: string;
  showLabels?: boolean;
}

export function NavigationControls({
  className,
  showLabels = false,
}: NavigationControlsProps) {
  const { goBack, goForward, canGoBack, canGoForward } = useNavigation();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={goBack}
        disabled={!canGoBack}
        className="h-8 w-8 p-0"
        title="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
        {showLabels && <span className="sr-only">Back</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={goForward}
        disabled={!canGoForward}
        className="h-8 w-8 p-0"
        title="Go forward"
      >
        <ArrowRight className="h-4 w-4" />
        {showLabels && <span className="sr-only">Forward</span>}
      </Button>
    </div>
  );
}
