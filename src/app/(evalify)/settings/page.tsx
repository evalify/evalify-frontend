"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { User, Bell, Palette, Monitor, Smartphone, Eye } from "lucide-react";

function capitalizeWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("account");
  const [fontSize, setFontSize] = useState([16]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const applyFontSize = (size: number[]) => {
    setFontSize(size);
    document.documentElement.style.setProperty(
      "--base-font-size",
      `${size[0]}px`,
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - User Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 pt-10 pb-10">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="h-28 w-28 mx-auto ring-4 ring-primary/20">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-white">
                        {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="absolute -bottom-1 -right-1 bg-primary border-0">
                      {session?.user.groups[0].toUpperCase() || "User"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                      {capitalizeWord(session?.user?.name || "User Name")}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {session?.user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              {/* Tab Navigation */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-2">
                <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2">
                  <TabsTrigger
                    value="account"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          disabled={true}
                          placeholder="Enter your full name"
                          defaultValue={capitalizeWord(
                            session?.user?.name || "",
                          )}
                          className="bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          disabled={true}
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          defaultValue={session?.user?.email || ""}
                          className="bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mt-6">User Roles</h3>
                      <ul className="list-disc pl-6">
                        {session?.user.roles && (
                          <div className="flex flex-wrap gap-2">
                            {session.user.roles.map((role, index) => (
                              <Badge key={index}>{role}</Badge>
                            ))}
                          </div>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Theme & Display
                    </CardTitle>
                    <CardDescription>
                      Customize your interface appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Theme Mode</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["light", "dark", "system"].map((themeOption) => (
                          <div
                            key={themeOption}
                            className={`relative cursor-pointer rounded-lg border-2 p-3 ${
                              theme === themeOption
                                ? "border-primary bg-primary/5"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                            onClick={() => handleThemeChange(themeOption)}
                          >
                            <div className="flex items-center gap-2">
                              {themeOption === "light" && (
                                <Monitor className="h-4 w-4" />
                              )}
                              {themeOption === "dark" && (
                                <Smartphone className="h-4 w-4" />
                              )}
                              {themeOption === "system" && (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="capitalize text-sm font-medium">
                                {themeOption}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Font Size: {fontSize[0]}px</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={applyFontSize}
                        max={24}
                        min={12}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Small (12px)</span>
                        <span>Large (24px)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      {
                        title: "Exam Reminders",
                        desc: "Get notified about upcoming exams",
                        default: true,
                      },
                      {
                        title: "Score Updates",
                        desc: "Receive notifications when results are available",
                        default: true,
                      },
                      {
                        title: "Assignment Deadlines",
                        desc: "Reminders for assignment due dates",
                        default: true,
                      },
                      {
                        title: "System Announcements",
                        desc: "Important platform updates and news",
                        default: false,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <Label>{item.title}</Label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {item.desc}
                          </p>
                        </div>
                        <Switch defaultChecked={item.default} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
