"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
export interface NavigationConfig {
  [key: string]: {
    label: string;
    parent?: string;
    dynamicSegments?: {
      [key: string]: string; // segment pattern -> label
    };
  };
}

interface NavigationContextType {
  config: NavigationConfig;
  updateConfig: (newConfig: Partial<NavigationConfig>) => void;
  resetConfig: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

const defaultConfig: NavigationConfig = {
  "/": { label: "Home" },
  "/dashboard": { label: "Dashboard" },
  "/course": {
    label: "Courses",
    dynamicSegments: {
      uuid: "Course",
      id: "Course Details",
    },
  },
  "/question-bank": {
    label: "Question Bank",
    dynamicSegments: {
      uuid: "Bank",
      id: "Details",
    },
  },
  "/quiz": {
    label: "Quiz",
    dynamicSegments: {
      uuid: "Quiz",
      id: "Quiz Details",
    },
  },
  "/user": {
    label: "Users",
    dynamicSegments: {
      uuid: "User",
      id: "User Details",
    },
  },
  "/batch": {
    label: "Batches",
    dynamicSegments: {
      uuid: "Batch",
      id: "Batch Details",
    },
  },
  "/semester": {
    label: "Semester",
    dynamicSegments: {
      uuid: "Semester",
      id: "Semester Details",
    },
  },
  "/department": {
    label: "Departments",
    dynamicSegments: {
      uuid: "Department",
      id: "Department Details",
    },
  },
  "/lab": {
    label: "Labs",
    dynamicSegments: {
      uuid: "Lab",
      id: "Lab Details",
    },
  },
  "/settings": { label: "Settings" },
};

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<NavigationConfig>(defaultConfig);

  const updateConfig = useCallback((newConfig: Partial<NavigationConfig>) => {
    setConfig((prev) => {
      const merged = { ...prev };
      Object.entries(newConfig).forEach(([key, value]) => {
        if (value) {
          merged[key] = value;
        }
      });
      return merged;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  return (
    <NavigationContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationConfig() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationConfig must be used within a NavigationProvider",
    );
  }
  return context;
}
