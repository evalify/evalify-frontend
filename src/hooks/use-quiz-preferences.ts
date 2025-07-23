"use client";

import { useState, useEffect } from "react";

interface QuizPreferences {
  viewMode: "grid" | "table";
  selectedTab: "all" | "live" | "upcoming" | "completed" | "missed";
}

const defaultPreferences: QuizPreferences = {
  viewMode: "grid",
  selectedTab: "all",
};

const STORAGE_KEY = "quiz-preferences";

export const useQuizPreferences = () => {
  const [preferences, setPreferences] =
    useState<QuizPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedPreferences = JSON.parse(stored);
          setPreferences({ ...defaultPreferences, ...parsedPreferences });
        }
      } catch (error) {
        console.error("Failed to load quiz preferences:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = (updates: Partial<QuizPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    } catch (error) {
      console.error("Failed to save quiz preferences:", error);
    }
  };

  const setViewMode = (viewMode: QuizPreferences["viewMode"]) => {
    updatePreferences({ viewMode });
  };

  const setSelectedTab = (selectedTab: QuizPreferences["selectedTab"]) => {
    updatePreferences({ selectedTab });
  };

  return {
    preferences,
    isLoaded,
    setViewMode,
    setSelectedTab,
    updatePreferences,
  };
};
