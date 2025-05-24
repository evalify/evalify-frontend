import Link from "next/link";
import { ThemeToggler } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { UserNav } from "./user-nav";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/navigation/header/login-button";

const Header = async () => {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 border-b z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Evalify
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggler />
          {session?.user && (
            <>
              <Button variant="ghost" size="icon" className="mr-2">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <UserNav />
            </>
          )}
          {!session?.user && <SignInButton />}
        </div>
      </div>
    </header>
  );
};

export default Header;
