"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios/axios-client";

export default function Page() {
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/course");
        console.log(response.data);
        setQuizData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Quiz Student Page</h1>
      <pre>{quizData ? JSON.stringify(quizData, null, 2) : "Loading..."}</pre>
    </div>
  );
}
