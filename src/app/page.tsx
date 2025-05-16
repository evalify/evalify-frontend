"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useRouter } from "next/navigation";

// This simulates a data fetching function that takes time
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Data loaded");
    }, 10000);
  });
};

// Main content component that will load after data is ready
function HomeContent() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Evalify</h1>
      <p className="mb-4">Your exam platform is ready!</p>
      <Button>Get Started</Button>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    // A trick to force loading state to appear
    if (isLoading) {
      // Force router transition which will trigger the loading state
      router.refresh();

      // Actual data fetching
      fetchData().then(() => {
        console.log("Content loaded");
        setIsLoading(false);
      });
    }

    // Cleanup interval
    const interval = setInterval(() => {
      console.log("Hello");
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, router]);

  // If still loading, render nothing - the loading.tsx will be shown
  if (isLoading) {
    return <Loading />;
  }

  // Render content once loading is complete
  return <HomeContent />;
}
