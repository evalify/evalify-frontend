"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Phone, Mail, Calendar, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import userQueries from "@/repo/user-queries/user-queries";

enum Role {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  FACULTY = "FACULTY",
  MANAGER = "MANAGER",
}

interface UserDetails {
  id?: string;
  name: string;
  email: string;
  profileId?: string;
  image?: string;
  password?: string;
  role: Role;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
  lastPasswordChange?: Date;
}

export default function UserDetailsPage() {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const { data: session } = useSession();

  // Get user ID from session (will be undefined if no session)
  const userId = session?.user?.id;

  const {
    data: fetchedUser,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userQueries.fetchUserById(userId!),
    enabled: !!session?.access_token && !!userId,
    retry: 1, // Only retry once on failure
  });

  // User state
  const [user, setUser] = useState<UserDetails>({
    name: "",
    email: "",
    profileId: "",
    password: "********",
    role: Role.STUDENT,
    phoneNumber: "",
    isActive: true,
    createdAt: new Date(),
    lastPasswordChange: new Date(),
  });

  // Add debug logging
  useEffect(() => {
    if (fetchedUser) {
      console.log("Successfully fetched user data:", fetchedUser);
    }
    if (error) {
      console.error("Error fetching user data:", error);
    }
  }, [fetchedUser, error]);

  // Update user data from fetched API data
  useEffect(() => {
    if (fetchedUser) {
      setUser({
        id: fetchedUser.id,
        name: fetchedUser.name,
        email: fetchedUser.email,
        profileId: fetchedUser.profileId,
        role: fetchedUser.role as Role,
        phoneNumber: fetchedUser.phoneNumber,
        isActive: fetchedUser.isActive,
        createdAt: new Date(fetchedUser.createdAt),
        lastPasswordChange: new Date(), // API doesn't provide this, so use current date as fallback
      });
    }
  }, [fetchedUser]);

  // Fallback: Update user data from session if API data isn't available
  useEffect(() => {
    if (session?.user && !fetchedUser) {
      setUser((prevUser) => ({
        ...prevUser,
        name: session.user.name || "",
        email: session.user.email || "",
        profileId: session.user.id || "",
        role: session.user.roles?.includes("admin")
          ? Role.ADMIN
          : session.user.roles?.includes("faculty")
            ? Role.FACULTY
            : Role.STUDENT,
        // Keep other fields as they might come from different sources
        phoneNumber: prevUser.phoneNumber || "",
        isActive: true, // Assume active if they have a session
      }));
    }
  }, [session, fetchedUser]);

  // Early return after all hooks are called
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="text-gray-100 text-lg">Loading user data...</div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-600 hover:bg-red-700 text-white";
      case Role.FACULTY:
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case Role.MANAGER:
        return "bg-purple-600 hover:bg-purple-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Show error if there's an API error
  if (isError && error) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">
            Error loading user data
          </div>
          <div className="text-gray-300 text-sm">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg bg-gray-800 border-gray-700">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Profile Picture and Basic Info */}
            <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-gray-700">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage
                      src={`/blob/profile_${userId}`}
                      alt={user.name}
                    />
                    <AvatarFallback className="text-2xl font-semibold bg-gray-700 text-gray-200">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h1 className="text-2xl font-bold text-gray-100 mb-3">
                  {user.name}
                </h1>
                <div className="space-y-2">
                  <Badge className={`${getRoleColor(user.role)} border-0`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                  <div>
                    <Badge
                      variant={user.isActive ? "default" : "secondary"}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* Right Side - Detailed Information */}
            <div className="lg:w-2/3 p-6">
              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-100 border-b border-gray-600 pb-2">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <div className="p-3 bg-gray-700 rounded-md border border-gray-600">
                      <p className="text-sm text-gray-100">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <div className="p-3 bg-gray-700 rounded-md border border-gray-600">
                      <p className="text-sm text-gray-100">
                        {user.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {" "}
                    <div className="space-y-2">
                      {" "}
                      <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        User Name
                      </Label>
                      <div className="p-3 bg-gray-700 rounded-md border border-gray-600">
                        <p className="text-xs font-mono text-gray-100">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Account Created
                      </Label>
                      <div className="p-3 bg-gray-700 rounded-md border border-gray-600">
                        {" "}
                        <p className="text-sm text-gray-100">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-600">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Create User
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
