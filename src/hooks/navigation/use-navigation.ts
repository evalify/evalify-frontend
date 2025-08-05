"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useEffect, useState } from "react";

export interface BreadcrumbSegment {
  label: string;
  href: string;
  isCurrentPage?: boolean;
  isDynamicSegment?: boolean; // New property to identify dynamic segments
}

export interface NavigationConfig {
  [key: string]: {
    label: string;
    parent?: string;
    dynamicSegments?: {
      [key: string]: string; // segment pattern -> label
    };
  };
}

const defaultNavigationConfig: NavigationConfig = {
  "/": { label: "Home" },
  "/dashboard": { label: "Dashboard" },
  "/course": {
    label: "Courses",
    dynamicSegments: {
      uuid: "Course",
      "[id]/quiz": "Quiz",
      "[id]/quiz/[quizId]": "Quiz Details",
      "[id]/quiz/[quizId]/manage": "Manage Quiz",
      "[id]/quiz/[quizId]/question": "Add/Edit Questions",
      "[id]/quiz/[quizId]/result": "Quiz Results",
      "[id]/quiz/[quizId]/view": "Quiz Questions",
    },
  },
  "/question-bank": {
    label: "Question Bank",
    dynamicSegments: {
      uuid: "Bank Questions",
    },
  },
  "/student-results": { label: "Results" },
  "/quiz": { label: "Quiz" },
  "/user": {
    label: "Users",
    dynamicSegments: {
      "uuid id": "User Details",
    },
  },
  "/batch": {
    label: "Batches",
    dynamicSegments: {
      uuid: "Batch Details",
    },
  },
  "/semester": {
    label: "Semester",
    dynamicSegments: {
      uuid: "Semester Details",
    },
  },
  "/department": {
    label: "Departments",
    dynamicSegments: {
      uuid: "Department Details",
    },
  },
  "/lab": {
    label: "Labs",
    dynamicSegments: {
      uuid: "Lab Details",
    },
  },
  "/settings": { label: "Settings" },
};

// Helper functions
const isUUID = (str: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
  return uuidRegex.test(str.replace(/\s/g, ""));
};

const isNumericId = (str: string): boolean => {
  return /^\d+$/.test(str);
};

export function useNavigation(customConfig?: NavigationConfig) {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward] = useState(false);

  const navigationConfig = useMemo(
    () => ({
      ...defaultNavigationConfig,
      ...customConfig,
    }),
    [customConfig],
  );

  // Check if we can go back or forward
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Simple heuristic: if we have history entries, we can probably go back
      setCanGoBack(window.history.length > 1);
      // Note: there's no reliable way to detect if we can go forward in modern browsers
      // without maintaining our own history stack
    }
  }, [pathname]);

  const goBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    }
  }, [router]);

  const goForward = useCallback(() => {
    router.forward();
  }, [router]);

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const generateBreadcrumbs = useCallback((): BreadcrumbSegment[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [];

    // Always add home/dashboard as first breadcrumb if not on root
    if (pathname !== "/" && !pathname.startsWith("/dashboard")) {
      breadcrumbs.push({
        label: "Dashboard",
        href: "/dashboard",
        isDynamicSegment: false,
      });
    }

    let currentPath = "";
    let parentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLastSegment = index === segments.length - 1;
      let isDynamicSegment = false;
      let linkHref = currentPath; // Default to current path

      // Check if we have a custom label for this exact path
      const config = navigationConfig[currentPath];
      let label = config?.label;

      // If no exact match, check if this might be a dynamic segment
      if (!label) {
        // Check if the parent path has dynamic segment configuration
        const parentConfig = navigationConfig[parentPath];

        if (parentConfig?.dynamicSegments) {
          // Check if this segment matches any dynamic pattern
          if (isUUID(segment)) {
            label = parentConfig.dynamicSegments["uuid"];
            isDynamicSegment = true;
            linkHref = parentPath || "/dashboard"; // Fallback to dashboard if no parent
          } else if (isNumericId(segment)) {
            label = parentConfig.dynamicSegments["id"];
            isDynamicSegment = true;
            linkHref = parentPath || "/dashboard"; // Fallback to dashboard if no parent
          } else if (parentConfig.dynamicSegments[segment]) {
            label = parentConfig.dynamicSegments[segment];
            isDynamicSegment = true;
            linkHref = parentPath || "/dashboard"; // Fallback to dashboard if no parent
          }
        }
      }

      // If still no label, try to generate one from the segment
      if (!label) {
        // Handle dynamic routes (e.g., [id])
        if (segment.match(/^\[.*\]$/)) {
          label = "Details";
          isDynamicSegment = true;
          linkHref = parentPath || "/dashboard"; // Fallback to dashboard if no parent
        } else if (isUUID(segment)) {
          // For UUID segments without specific config, use generic label
          label = "Details";
          isDynamicSegment = true;
          linkHref = parentPath || "/dashboard"; // Fallback to dashboard if no parent
        } else {
          // Capitalize and format the segment
          label = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }

      breadcrumbs.push({
        label,
        href: linkHref,
        isCurrentPage: isLastSegment,
        isDynamicSegment,
      });

      parentPath = currentPath;
    });

    return breadcrumbs;
  }, [pathname, navigationConfig]);

  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(),
    [generateBreadcrumbs],
  );

  return {
    goBack,
    goForward,
    navigateTo,
    breadcrumbs,
    currentPath: pathname,
    canGoBack,
    canGoForward,
  };
}
