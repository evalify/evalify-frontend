"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

const TopBar: React.FC = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const isDark = mounted ? resolvedTheme === "dark" : false;
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
      {/* Left side - Evalify text and create button */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Evalify</h1>
      </div>

      {/* Right side - Theme toggle and user avatar */}
      <div className="flex items-center gap-4">
        {/* Theme toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          {mounted ? (
            resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )
          ) : (
            // Fallback icon during SSR to prevent hydration mismatch
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default TopBar;
