"use client";

import { NavigationConfig } from "@/hooks/navigation/use-navigation";

/**
 * Utility function to create navigation configuration with better type safety
 */
export function createNavigationConfig(
  config: NavigationConfig,
): NavigationConfig {
  return config;
}

/**
 * Helper to create dynamic segment configurations
 */
export function createDynamicSegments(segments: { [key: string]: string }) {
  return segments;
}

/**
 * Common patterns for dynamic segments
 */
export const commonDynamicSegments = {
  // For routes with UUIDs that represent a single item
  singleItem: (itemName: string) => ({
    uuid: itemName,
    id: `${itemName} Details`,
  }),

  // For routes with UUIDs and common actions
  withActions: (itemName: string) => ({
    uuid: itemName,
    id: `${itemName} Details`,
    edit: `Edit ${itemName}`,
    delete: `Delete ${itemName}`,
    view: `View ${itemName}`,
    settings: `${itemName} Settings`,
  }),

  // For collection routes
  collection: (collectionName: string, itemName: string) => ({
    uuid: itemName,
    id: `${itemName} Details`,
    create: `Create ${itemName}`,
    import: `Import ${collectionName}`,
    export: `Export ${collectionName}`,
  }),
};

/**
 * Predefined configurations for common app sections
 */
export const presetConfigs = {
  questionBank: createNavigationConfig({
    "/question-bank": {
      label: "Question Bank",
      dynamicSegments: commonDynamicSegments.withActions("Bank"),
    },
  }),

  userManagement: createNavigationConfig({
    "/user": {
      label: "User Management",
      dynamicSegments: commonDynamicSegments.withActions("User"),
    },
  }),

  courses: createNavigationConfig({
    "/course": {
      label: "Course Management",
      dynamicSegments: commonDynamicSegments.collection("Courses", "Course"),
    },
  }),
};
