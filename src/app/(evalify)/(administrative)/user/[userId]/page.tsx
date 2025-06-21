"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import userQueries from "@/repo/user-queries/user-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const params = useParams();
  const userId = params.userId as string;

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userQueries.fetchUserById(userId),
    enabled: !!session?.access_token && !!userId,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Error:
        {error instanceof Error ? error.message : "Failed to fetch user data"}
      </div>
    );
  }

  if (!user) {
    return <div className="p-8">User not found.</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              {user.phoneNumber && (
                <p className="text-muted-foreground">{user.phoneNumber}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
