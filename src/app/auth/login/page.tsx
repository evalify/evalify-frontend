"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { ArrowLeft, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user && !isRedirecting) {
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }, [session, status, router, isRedirecting]);

  if (status === "loading" || isRedirecting) {
    return <Loading />;
  }

  if (session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-black">
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-8 left-8 z-20 p-3 rounded-xl transition-all duration-300 hover:scale-110 bg-black/10 text-black border border-black/20 backdrop-blur-sm hover:bg-black/20 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20 shadow-lg flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline font-medium">Home</span>
      </button>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-16 h-16 rounded-full bg-blue-500/5 dark:bg-blue-500/10 animate-float"
          style={{ top: "15%", left: "15%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-12 h-12 rounded-lg bg-purple-500/5 dark:bg-purple-500/10 animate-float"
          style={{ top: "25%", right: "20%", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute w-20 h-20 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 animate-float"
          style={{ bottom: "25%", left: "10%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-14 h-14 rounded-lg rotate-45 bg-pink-500/5 dark:bg-pink-500/10 animate-float"
          style={{ bottom: "35%", right: "15%", animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl shadow-2xl backdrop-blur-sm border transition-all duration-300 bg-white/80 border-gray-200/50 dark:bg-white/5 dark:border-white/10">
        {/* Evalify Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 transition-all duration-1000 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Evalify
          </h1>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Keycloak Sign In Button */}
          <Button
            onClick={() => signIn("keycloak")}
            className="w-full py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Shield size={18} />
              Sign in with Keycloak
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl text-center transition-all duration-300 bg-gray-50/80 hover:bg-gray-100/80 dark:bg-white/5 dark:hover:bg-white/10">
              <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Secure
              </p>
            </div>
            <div className="p-4 rounded-xl text-center transition-all duration-300 bg-gray-50/80 hover:bg-gray-100/80 dark:bg-white/5 dark:hover:bg-white/10">
              <Zap className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Fast
              </p>
            </div>
          </div>
          {/* Debug: Sign Out Button (only show if session exists) */}
          {session && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Already logged in as {session.user.email}
            </div>
          )}
        </div>

        {/* Subtle accent dots */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-1 h-1 rounded-full bg-blue-600/30 dark:bg-blue-400/50 animate-ping"
            style={{
              top: "20px",
              left: "20px",
              animationDelay: "0s",
              animationDuration: "4s",
            }}
          ></div>
          <div
            className="absolute w-1 h-1 rounded-full bg-purple-600/30 dark:bg-purple-400/50 animate-ping"
            style={{
              top: "20px",
              right: "20px",
              animationDelay: "1s",
              animationDuration: "4s",
            }}
          ></div>
          <div
            className="absolute w-1 h-1 rounded-full bg-cyan-600/30 dark:bg-cyan-400/50 animate-ping"
            style={{
              bottom: "20px",
              left: "20px",
              animationDelay: "2s",
              animationDuration: "4s",
            }}
          ></div>
          <div
            className="absolute w-1 h-1 rounded-full bg-blue-600/30 dark:bg-blue-400/50 animate-ping"
            style={{
              bottom: "20px",
              right: "20px",
              animationDelay: "3s",
              animationDuration: "4s",
            }}
          ></div>
        </div>
      </div>

      {/* Background geometric shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl bg-blue-500/3 dark:bg-blue-500/5 animate-pulse"
          style={{ top: "10%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl bg-purple-500/3 dark:bg-purple-500/5 animate-pulse"
          style={{ bottom: "10%", right: "10%", animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
}
