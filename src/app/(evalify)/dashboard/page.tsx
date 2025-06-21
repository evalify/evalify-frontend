"use client";

import { useSession } from "next-auth/react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  HelpCircle,
  BookOpen,
  FlaskConical,
  Trophy,
  TrendingUp,
  Activity,
} from "lucide-react";

function capitalizeWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const Dashboardpage = () => {
  const { data: session } = useSession();

  const quickStats = [
    {
      label: "Total Users",
      value: "1,234",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Active Courses",
      value: "45",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      label: "Quizzes Created",
      value: "89",
      icon: HelpCircle,
      color: "text-purple-600",
    },
    {
      label: "Questions Bank",
      value: "2,156",
      icon: BookOpen,
      color: "text-orange-600",
    },
  ];

  const recentActivity = [
    {
      action: "New quiz created",
      item: "Advanced React Concepts",
      time: "2 hours ago",
      icon: HelpCircle,
    },
    {
      action: "Course published",
      item: "Introduction to TypeScript",
      time: "4 hours ago",
      icon: GraduationCap,
    },
    {
      action: "Lab completed",
      item: "Database Design Lab #3",
      time: "1 day ago",
      icon: FlaskConical,
    },
    {
      action: "Results analyzed",
      item: "Midterm Exam Results",
      time: "2 days ago",
      icon: Trophy,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {session?.user?.name && (
            <p className="text-muted-foreground">
              Welcome back, {capitalizeWord(session.user.name)}!
              {"Here's what's happening with your platform."}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Activity className="h-3 w-3" />
            System Online
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.item}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <HelpCircle className="h-4 w-4 mr-2" />
              Create New Quiz
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <GraduationCap className="h-4 w-4 mr-2" />
              Add Course
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FlaskConical className="h-4 w-4 mr-2" />
              Create Lab
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Trophy className="h-4 w-4 mr-2" />
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Platform Features Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evalify Platform Features
          </CardTitle>
          <CardDescription>
            Navigate through the platform using the integrated sidebar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Navigation Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Collapsible sidebar design</li>
                <li>• Icon-only mode for more space</li>
                <li>• Active page highlighting</li>
                <li>• Organized section groups</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Authentication</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Integrated user profile</li>
                <li>• Session-based authentication</li>
                <li>• Quick login/logout access</li>
                <li>• Profile management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Customization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Built-in theme toggle</li>
                <li>• Light and dark modes</li>
                <li>• System preference detection</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboardpage;
