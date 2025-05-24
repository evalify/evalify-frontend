"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Trophy,
  User,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  BookMarked,
  Beaker,
  Moon,
  Sun,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession, signOut, signIn } from "next-auth/react";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    badge: "12",
    subItems: [
      { title: "All Users", url: "/users", icon: Users },
      { title: "Students", url: "/users/students", icon: GraduationCap },
      { title: "Instructors", url: "/users/instructors", icon: User },
      { title: "Add User", url: "/users/add", icon: Plus },
    ],
  },
  {
    title: "Courses",
    url: "/courses",
    icon: GraduationCap,
    badge: null,
    subItems: [
      { title: "All Courses", url: "/courses", icon: BookMarked },
      { title: "Active Courses", url: "/courses/active", icon: CheckCircle },
      { title: "Draft Courses", url: "/courses/draft", icon: FileText },
      { title: "Create Course", url: "/courses/create", icon: Plus },
    ],
  },
  {
    title: "Semester",
    url: "/semester",
    icon: Calendar,
    badge: "Current",
    subItems: [
      { title: "Current Semester", url: "/semester/current", icon: Clock },
      { title: "Past Semesters", url: "/semester/past", icon: Calendar },
      { title: "Upcoming", url: "/semester/upcoming", icon: TrendingUp },
    ],
  },
];

const assessmentItems = [
  {
    title: "Quiz",
    url: "/quiz",
    icon: HelpCircle,
    badge: "5",
    subItems: [
      { title: "Active Quizzes", url: "/quiz/active", icon: CheckCircle },
      { title: "Draft Quizzes", url: "/quiz/draft", icon: FileText },
      { title: "Completed", url: "/quiz/completed", icon: Trophy },
      { title: "Create Quiz", url: "/quiz/create", icon: Plus },
    ],
  },
  {
    title: "Question Bank",
    url: "/question-bank",
    icon: BookOpen,
    badge: "156",
    subItems: [
      { title: "All Questions", url: "/question-bank", icon: BookOpen },
      {
        title: "Multiple Choice",
        url: "/question-bank/mcq",
        icon: CheckCircle,
      },
      { title: "True/False", url: "/question-bank/boolean", icon: XCircle },
      {
        title: "Short Answer",
        url: "/question-bank/short",
        icon: MessageSquare,
      },
      { title: "Add Question", url: "/question-bank/add", icon: Plus },
    ],
  },
  {
    title: "Labs",
    url: "/labs",
    icon: FlaskConical,
    badge: "8",
    subItems: [
      { title: "All Labs", url: "/labs", icon: Beaker },
      { title: "Active Labs", url: "/labs/active", icon: Activity },
      { title: "Completed Labs", url: "/labs/completed", icon: CheckCircle },
      { title: "Create Lab", url: "/labs/create", icon: Plus },
    ],
  },
];

const analyticsItems = [
  {
    title: "Results",
    url: "/results",
    icon: Trophy,
    badge: null,
    subItems: [
      { title: "Quiz Results", url: "/results/quiz", icon: HelpCircle },
      { title: "Lab Results", url: "/results/lab", icon: FlaskConical },
      { title: "Course Progress", url: "/results/course", icon: TrendingUp },
      { title: "Reports", url: "/results/reports", icon: BarChart3 },
    ],
  },
];

interface NavItemProps {
  item: {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | null;
    subItems?: Array<{
      title: string;
      url: string;
      icon: React.ComponentType<{ className?: string }>;
    }>;
  };
  pathname: string;
}

function ThemeToggle({ mounted }: { mounted: boolean }) {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setTheme(isDark ? "light" : "dark")}
        tooltip={
          mounted
            ? `Switch to ${isDark ? "light" : "dark"} mode`
            : "Toggle theme"
        }
        disabled={!mounted}
      >
        {mounted && isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        <span>{mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Theme"}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavItem({ item, pathname }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isActive =
    pathname === item.url ||
    (hasSubItems && item.subItems?.some((sub) => pathname === sub.url));

  if (!hasSubItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
          <Link href={item.url}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto h-5 text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => setIsOpen(!isOpen)}
        tooltip={item.title}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto h-5 text-xs">
            {item.badge}
          </Badge>
        )}
        <ChevronRight
          className={`ml-auto h-4 w-4 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </SidebarMenuButton>
      {isOpen && (
        <SidebarMenuSub>
          {item.subItems?.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                <Link href={subItem.url}>
                  <subItem.icon className="h-4 w-4" />
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

export function EnhancedSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Evalify</span>
            <span className="text-xs text-muted-foreground">
              Education Platform
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <NavItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Assessment Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assessmentItems.map((item) => (
                <NavItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Analytics & Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <NavItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Settings"
                  isActive={pathname === "/settings"}
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <ThemeToggle mounted={mounted} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {mounted && session?.user ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="mb-2">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {session.user.name?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session.user.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => signOut({ callbackUrl: "/" })}
                  tooltip="Sign out"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : mounted ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => signIn("keycloak")}
                tooltip="Sign in to access all features"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Loading...">
                <LogIn className="h-4 w-4" />
                <span>Loading...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
