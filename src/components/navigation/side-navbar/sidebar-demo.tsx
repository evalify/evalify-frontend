"use client";

import { useState } from "react";
import { AppSidebar } from "./side-navbar";
import { EnhancedSidebar } from "./enhanced-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SidebarDemo() {
  const [currentSidebar, setCurrentSidebar] = useState<"basic" | "enhanced">(
    "basic",
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Evalify Sidebar Design</h1>
          <p className="text-muted-foreground">
            Educational platform navigation sidebar with two design variants
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant={currentSidebar === "basic" ? "default" : "outline"}
            onClick={() => setCurrentSidebar("basic")}
          >
            Basic Sidebar
          </Button>
          <Button
            variant={currentSidebar === "enhanced" ? "default" : "outline"}
            onClick={() => setCurrentSidebar("enhanced")}
          >
            Enhanced Sidebar
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Basic Sidebar
                <Badge variant="secondary">Simple</Badge>
              </CardTitle>
              <CardDescription>
                Clean, minimal design with organized navigation groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Main navigation (Dashboard, Users, Courses, Semester)</li>
                <li>• Assessment tools (Quiz, Question Bank, Labs)</li>
                <li>• Analytics section (Results)</li>
                <li>• System section (Settings, Theme Toggle)</li>
                <li>• Redesigned user authentication in footer</li>
                <li>• Collapsible to icon-only mode</li>
                <li>• Active state indicators</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Enhanced Sidebar
                <Badge variant="default">Feature-rich</Badge>
              </CardTitle>
              <CardDescription>
                Advanced design with sub-menus, badges, and user profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Collapsible sub-navigation menus</li>
                <li>• Badge notifications for counts</li>
                <li>• User profile dropdown in footer</li>
                <li>• Hierarchical navigation structure</li>
                <li>• Enhanced visual feedback</li>
                <li>• Quick action items (Add/Create)</li>
                <li>• Fixed theme toggle functionality</li>
                <li>• Simplified user navigation (no dropdown)</li>
                <li>• Direct access to logout and settings</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="h-[600px] overflow-hidden">
          <CardHeader>
            <CardTitle>
              Live Preview - {currentSidebar === "basic" ? "Basic" : "Enhanced"}
              Sidebar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <SidebarProvider>
              {currentSidebar === "basic" ? (
                <AppSidebar />
              ) : (
                <EnhancedSidebar />
              )}
              <SidebarInset>
                <div className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">
                      Main Content Area
                    </h2>
                    <p className="text-muted-foreground">
                      This is where your main application content would appear.
                      The sidebar provides navigation to different sections of
                      the Evalify educational platform with redesigned
                      authentication and working theme toggle.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Overview of platform activity, quick stats, and
                            recent updates.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            Assessment Tools
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Create and manage quizzes, question banks, and lab
                            assignments.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            View results, generate reports, and track student
                            progress.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Structure</CardTitle>
            <CardDescription>
              Complete overview of the sidebar navigation hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Main Navigation</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>📊 Dashboard</li>
                  <li>👥 Users</li>
                  <li>🎓 Courses</li>
                  <li>📅 Semester</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Assessment Tools</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>❓ Quiz</li>
                  <li>📚 Question Bank</li>
                  <li>🧪 Labs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analytics</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>🏆 Results</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">System & Auth</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>⚙️ Settings (Direct access)</li>
                  <li>🌙 Theme Toggle (Fixed functionality)</li>
                  <li>🎨 Redesigned login button</li>
                  <li>👤 User profile display</li>
                  <li>🚪 Direct logout button</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
