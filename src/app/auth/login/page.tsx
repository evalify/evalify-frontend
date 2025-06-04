"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, User, Lock, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Here you would typically make an API call to your backend
      // For now, this is a placeholder
      if (!formData.username || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Example: Replace this with your actual authentication logic
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      // Handle successful login
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
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
          {/* Username/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10 py-3 rounded-xl transition-all duration-300 border bg-white/70 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:bg-white dark:bg-white/5 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:bg-white/10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 py-3 rounded-xl transition-all duration-300 border bg-white/70 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:bg-white dark:bg-white/5 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:bg-white/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-500 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center text-gray-400 dark:text-gray-600">
              <div className="w-full border-t border-current opacity-30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-medium">
              <span className="px-3 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Keycloak Sign In Button */}
          <Button
            onClick={() => signIn("keycloak")}
            variant="outline"
            className="w-full py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-gray-300/50 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:border-white/30 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Shield size={18} />
              Sign in with Keycloak
            </span>
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
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="w-full py-3 text-sm rounded-xl transition-all duration-300 border-gray-300/50 text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/10"
            >
              Sign Out
            </Button>
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
