"use client";

// This file is a redirect. The student results functionality has been moved to:
// src/app/(test)/student-results/page.tsx

import { redirect } from "next/navigation";

export default function ResultsDataPage() {
  redirect("/student-results");
}
