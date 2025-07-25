import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/side-navbar/side-navbar";
import AuthGuard from "@/components/auth/auth-guard";
import { UserType } from "@/lib/auth/utils";
import { NavigationControls } from "@/components/navigation/controls/navigation-controls";
import { DynamicBreadcrumb } from "@/components/navigation/breadcrumb/dynamic-breadcrumb";

export const metadata: Metadata = {
  title: "Evalify - Online Exam Platform",
  description:
    "A modern platform for creating and managing online examinations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard
      requiredGroups={[
        UserType.STAFF,
        UserType.MANAGER,
        UserType.ADMIN,
        UserType.STUDENT,
      ]}
    >
      <SidebarProvider>
        <div className="flex h-screen w-full">
          {/* Left sidebar */}
          <AppSidebar />
          {/* Main content area */}
          <SidebarInset className="flex-1 overflow-hidden">
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4 flex-row w-full">
                <NavigationControls className="hidden sm:flex" />
                <DynamicBreadcrumb className="flex-1 min-w-0" />
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              <div className="flex flex-col gap-4 p-4">{children}</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
