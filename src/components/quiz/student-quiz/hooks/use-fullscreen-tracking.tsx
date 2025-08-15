"use client";

import { useEffect, useState, useCallback } from "react";

export interface ViolationLog {
  id: string;
  type:
    | "TAB_SWITCH"
    | "FULLSCREEN_EXIT"
    | "KEYBOARD_SHORTCUT"
    | "COPY_PASTE"
    | "RIGHT_CLICK";
  timestamp: Date;
  details: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

interface FullScreenTrackingState {
  isFullScreen: boolean;
  violations: ViolationLog[];
  isTabVisible: boolean;
  violationCount: number;
}

export const useFullScreenTracking = (
  enableFullScreen: boolean = false,
  quizId?: string,
) => {
  const [state, setState] = useState<FullScreenTrackingState>(() => {
    // Load violations from localStorage on initialization
    const stored = quizId ? localStorage.getItem(`${quizId}_violations`) : null;
    const storedViolations = stored ? JSON.parse(stored) : [];

    return {
      isFullScreen: false,
      violations: storedViolations.map((v: ViolationLog) => ({
        ...v,
        timestamp: new Date(v.timestamp),
      })),
      isTabVisible: true,
      violationCount: storedViolations.length,
    };
  });

  const addViolation = useCallback(
    (
      type: ViolationLog["type"],
      details: string,
      severity: ViolationLog["severity"] = "MEDIUM",
    ) => {
      const violation: ViolationLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        timestamp: new Date(),
        details,
        severity,
      };

      setState((prev) => {
        const newViolations = [...prev.violations, violation];

        // Store in localStorage if quizId is provided
        if (quizId) {
          localStorage.setItem(
            `${quizId}_violations`,
            JSON.stringify(newViolations),
          );
        }

        return {
          ...prev,
          violations: newViolations,
          violationCount: prev.violationCount + 1,
        };
      });
    },
    [quizId],
  );

  const checkFullScreen = useCallback(() => {
    const isFullScreen = !!(
      document.fullscreenElement ||
      (document as Document & { webkitFullscreenElement?: Element })
        .webkitFullscreenElement ||
      (document as Document & { mozFullScreenElement?: Element })
        .mozFullScreenElement ||
      (document as Document & { msFullscreenElement?: Element })
        .msFullscreenElement
    );

    setState((prev) => {
      if (prev.isFullScreen && !isFullScreen && enableFullScreen) {
        addViolation("FULLSCREEN_EXIT", "User exited fullscreen mode", "HIGH");
      }
      return { ...prev, isFullScreen };
    });
  }, [enableFullScreen, addViolation]);

  const requestFullScreen = useCallback(async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (
        (
          element as HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void>;
          }
        ).webkitRequestFullscreen
      ) {
        await (
          element as HTMLElement & {
            webkitRequestFullscreen: () => Promise<void>;
          }
        ).webkitRequestFullscreen();
      } else if (
        (
          element as HTMLElement & {
            mozRequestFullScreen?: () => Promise<void>;
          }
        ).mozRequestFullScreen
      ) {
        await (
          element as HTMLElement & { mozRequestFullScreen: () => Promise<void> }
        ).mozRequestFullScreen();
      } else if (
        (element as HTMLElement & { msRequestFullscreen?: () => Promise<void> })
          .msRequestFullscreen
      ) {
        await (
          element as HTMLElement & { msRequestFullscreen: () => Promise<void> }
        ).msRequestFullscreen();
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      addViolation(
        "FULLSCREEN_EXIT",
        "Failed to enter fullscreen mode",
        "HIGH",
      );
    }
  }, [addViolation]);

  // Track visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setState((prev) => {
        if (prev.isTabVisible && !isVisible) {
          addViolation(
            "TAB_SWITCH",
            "User switched away from the quiz tab",
            "HIGH",
          );
        }
        return { ...prev, isTabVisible: isVisible };
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [addViolation]);

  // Track fullscreen changes
  useEffect(() => {
    checkFullScreen();

    document.addEventListener("fullscreenchange", checkFullScreen);
    document.addEventListener("webkitfullscreenchange", checkFullScreen);
    document.addEventListener("mozfullscreenchange", checkFullScreen);
    document.addEventListener("msfullscreenchange", checkFullScreen);

    return () => {
      document.removeEventListener("fullscreenchange", checkFullScreen);
      document.removeEventListener("webkitfullscreenchange", checkFullScreen);
      document.removeEventListener("mozfullscreenchange", checkFullScreen);
      document.removeEventListener("msfullscreenchange", checkFullScreen);
    };
  }, [checkFullScreen]);

  // Disable keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common shortcuts
      const forbiddenShortcuts = [
        { key: "F12" }, // Developer tools
        { key: "F5" }, // Refresh
        { ctrl: true, key: "r" }, // Refresh
        { ctrl: true, key: "R" }, // Refresh
        { ctrl: true, key: "u" }, // View source
        { ctrl: true, key: "U" }, // View source
        { ctrl: true, key: "i" }, // Developer tools
        { ctrl: true, key: "I" }, // Developer tools
        { ctrl: true, key: "j" }, // Console
        { ctrl: true, key: "J" }, // Console
        { ctrl: true, key: "w" }, // Close tab
        { ctrl: true, key: "W" }, // Close tab
        { ctrl: true, key: "t" }, // New tab
        { ctrl: true, key: "T" }, // New tab
        { ctrl: true, key: "n" }, // New window
        { ctrl: true, key: "N" }, // New window
        { ctrl: true, shift: true, key: "i" }, // Developer tools
        { ctrl: true, shift: true, key: "I" }, // Developer tools
        { ctrl: true, shift: true, key: "j" }, // Console
        { ctrl: true, shift: true, key: "J" }, // Console
        { ctrl: true, shift: true, key: "c" }, // Console
        { ctrl: true, shift: true, key: "C" }, // Console
        { alt: true, key: "Tab" }, // Alt+Tab
        { alt: true, key: "F4" }, // Close window
        { ctrl: true, key: "c" }, // Copy
        { ctrl: true, key: "C" }, // Copy
        { ctrl: true, key: "v" }, // Paste
        { ctrl: true, key: "V" }, // Paste
        { ctrl: true, key: "a" }, // Select all
        { ctrl: true, key: "A" }, // Select all
      ];

      const isShortcut = forbiddenShortcuts.some((shortcut) => {
        return (
          (!shortcut.ctrl || e.ctrlKey || e.metaKey) &&
          (!shortcut.alt || e.altKey) &&
          (!shortcut.shift || e.shiftKey) &&
          (shortcut.key === e.key || shortcut.key === e.code)
        );
      });

      if (isShortcut) {
        e.preventDefault();
        e.stopPropagation();
        addViolation(
          "KEYBOARD_SHORTCUT",
          `Attempted to use forbidden shortcut: ${e.key}`,
          "MEDIUM",
        );
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [addViolation]);

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation("RIGHT_CLICK", "Attempted to access context menu", "LOW");
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [addViolation]);

  // Disable text selection in certain areas
  useEffect(() => {
    const handleSelectStart = (e: Event) => {
      // Allow text selection in input fields and textareas
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") {
        return;
      }

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      if (target.closest(".question-content")) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("selectstart", handleSelectStart);
    return () => document.removeEventListener("selectstart", handleSelectStart);
  }, []);

  const clearViolations = useCallback(() => {
    setState((prev) => ({ ...prev, violations: [], violationCount: 0 }));

    // Remove from localStorage if quizId is provided
    if (quizId) {
      localStorage.removeItem(`${quizId}_violations`);
    }
  }, [quizId]);

  return {
    ...state,
    addViolation,
    requestFullScreen,
    clearViolations,
  };
};

export default useFullScreenTracking;
