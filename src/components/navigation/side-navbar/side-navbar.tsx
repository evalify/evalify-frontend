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
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  BookOpen,
  Calendar,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Trophy,
  Users,
  Moon,
  Sun,
  LogOut,
  LogIn,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ConfirmationDialog } from "@/components/ui/custom-alert-dialog";
import AuthGuard from "@/components/auth/auth-guard";
import { UserType } from "@/lib/auth/utils";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];

const academicsItems = [
  {
    title: "Courses",
    url: "/course",
    icon: HelpCircle,
  },
  {
    title: "Question Bank",
    url: "/question-bank",
    icon: BookOpen,
  },
  {
    title: "Results",
    url: "/student-results",
    icon: Trophy,
  },
];

const administrationItems = [
  {
    title: "Users",
    url: "/user",
    icon: Users,
  },
  {
    title: "Teacher Results",
    url: "/teacher-results",
    icon: BarChart3,
  },
  {
    title: "Batches",
    url: "/batch",
    icon: GraduationCap,
  },
  {
    title: "Semester",
    url: "/semester",
    icon: Calendar,
  },
  {
    title: "Departments",
    url: "/department",
    icon: GraduationCap,
  },
  {
    title: "Labs",
    url: "/lab",
    icon: FlaskConical,
  },
];

function capitalizeWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
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

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { open } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-4 w-4" />
            </div>
            {open && (
              <span className="font-semibold text-2xl text-center">
                Evalify
              </span>
            )}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <AuthGuard
          requiredGroups={[UserType.STAFF, UserType.MANAGER]}
          fallbackComponent={null}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Academics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {academicsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
        </AuthGuard>

        <AuthGuard
          requiredGroups={[UserType.ADMIN, UserType.MANAGER]}
          fallbackComponent={null}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {administrationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
        </AuthGuard>

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

      <SidebarFooter>
        <SidebarMenu>
          {mounted && session?.user ? (
            <>
              <SidebarMenuItem className="border-t border-sidebar-border pt-2">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-1 items-center overflow-hidden pr-2">
                    <Avatar className="h-8 w-8 flex-shrink-0 rounded-lg">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session.user.name?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {open && (
                      <>
                        <div className="ml-2 grid flex-1 overflow-hidden text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {capitalizeWord(session.user.name || "")}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {session.user.email}
                          </span>
                        </div>
                        <SidebarMenuButton
                          tooltip="Sign out"
                          size="sm"
                          className="text-red-600 w-auto hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950" // ml-auto to push it right, flex-shrink-0
                        >
                          <ConfirmationDialog
                            title="Logout Confirmation"
                            message="Are you sure you want to logout?"
                            onAccept={() => signOut({ callbackUrl: "/" })}
                            confirmButtonText="Yes, Logout"
                          >
                            <LogOut className="h-4 w-4" />
                          </ConfirmationDialog>
                        </SidebarMenuButton>
                      </>
                    )}
                  </div>
                </div>
              </SidebarMenuItem>
            </>
          ) : mounted ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => signIn("keycloak")}
                tooltip="Sign in to access all features"
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
