"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";

// Main landing page component
function HomeContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-black">
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-16 h-16 rounded-full bg-blue-500/10 dark:bg-blue-500/20 animate-float"
          style={{ top: "10%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-12 h-12 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 animate-float"
          style={{ top: "20%", right: "15%", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute w-20 h-20 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 animate-float"
          style={{ bottom: "20%", left: "15%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-14 h-14 rounded-lg rotate-45 bg-pink-500/10 dark:bg-pink-500/20 animate-float"
          style={{ bottom: "30%", right: "20%", animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute w-10 h-10 rounded-full bg-green-500/10 dark:bg-green-500/20 animate-float"
          style={{ top: "50%", left: "5%", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-18 h-18 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 animate-float"
          style={{ top: "30%", right: "8%", animationDelay: "2.5s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-4xl mx-auto px-6">
        {/* Animated Evalify Title */}
        <div className="relative mb-16">
          <h1 className="text-8xl md:text-9xl font-bold mb-6 tracking-tight transition-all duration-1000 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Evalify
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 font-light">
            Modern exam platform for educators and institutions
          </p>

          {/* Floating accent elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping"
              style={{
                top: "15%",
                left: "5%",
                animationDelay: "0s",
                animationDuration: "3s",
              }}
            ></div>
            <div
              className="absolute w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-ping"
              style={{
                top: "25%",
                right: "10%",
                animationDelay: "0.5s",
                animationDuration: "3s",
              }}
            ></div>
            <div
              className="absolute w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-ping"
              style={{
                bottom: "15%",
                left: "15%",
                animationDelay: "1s",
                animationDuration: "3s",
              }}
            ></div>
            <div
              className="absolute w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping"
              style={{
                bottom: "25%",
                right: "5%",
                animationDelay: "1.5s",
                animationDuration: "3s",
              }}
            ></div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="relative inline-block">
          <Button
            size="lg"
            className="px-12 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group"
            onClick={() => router.push("/auth/login")}
          >
            <span className="flex items-center gap-3">
              Get Started
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
          </Button>
        </div>
      </div>

      {/* Background geometric shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl bg-blue-500/5 dark:bg-blue-500/10 animate-pulse"
          style={{ top: "10%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl bg-purple-500/5 dark:bg-purple-500/10 animate-pulse"
          style={{ bottom: "10%", right: "10%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl bg-cyan-500/5 dark:bg-cyan-500/10 animate-pulse"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animationDelay: "2s",
          }}
        ></div>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
