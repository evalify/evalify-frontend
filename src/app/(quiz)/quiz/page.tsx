"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This is a redirect page that will send users to the first question of quiz ID 1
export default function RedirectToQuiz() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to quiz 1, question 1
    router.replace("/quiz/1?questionId=1");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redirecting to quiz...</p>
    </div>
  );
}
