"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface Violation {
  id: string;
  type: "fullscreen-exit" | "copy-attempt" | "context-menu";
  timestamp: Date;
  description: string;
}

export interface FullScreenEnforcementResult {
  isFullScreen: boolean;
  violations: Violation[];
  violationCount: number;
  requestFullScreen: () => Promise<void>;
  showFullScreenModal: boolean;
  dismissModal: () => void;
  isFullScreenSupported: boolean;
}

export function useFullScreenEnforcement(
  enabled: boolean = false,
): FullScreenEnforcementResult {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [showFullScreenModal, setShowFullScreenModal] = useState(false);
  const [isFullScreenSupported, setIsFullScreenSupported] = useState(false);

  const violationIdRef = useRef(0);
  // Check if full-screen API is supported
  useEffect(() => {
    const doc = document as Document & {
      webkitFullscreenEnabled?: boolean;
      mozFullScreenEnabled?: boolean;
      msFullscreenEnabled?: boolean;
    };

    const isSupported = !!(
      document.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled
    );
    setIsFullScreenSupported(isSupported);
  }, []);

  const addViolation = useCallback(
    (type: Violation["type"], description: string) => {
      const violation: Violation = {
        id: `violation-${++violationIdRef.current}`,
        type,
        timestamp: new Date(),
        description,
      };

      setViolations((prev) => [...prev, violation]);

      // Log to console for debugging
      console.warn(`[VIOLATION] ${type}: ${description}`, violation);
    },
    [],
  );
  const requestFullScreen = useCallback(async () => {
    try {
      const element = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }

      // Hide modal after successful full-screen request
      setShowFullScreenModal(false);
    } catch (error) {
      console.error("Failed to request full screen:", error);
      addViolation("fullscreen-exit", "Failed to enter full-screen mode");
    }
  }, [addViolation]);
  const handleFullScreenChange = useCallback(() => {
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
    };

    const isCurrentlyFullScreen = !!(
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    setIsFullScreen(isCurrentlyFullScreen);

    // If full-screen is required and user exits, record violation
    if (enabled && !isCurrentlyFullScreen && isFullScreen) {
      addViolation("fullscreen-exit", "User exited full-screen mode");
    }

    // Show/hide modal based on full-screen state
    if (enabled) {
      if (isCurrentlyFullScreen) {
        setShowFullScreenModal(false); // Hide modal when entering full-screen
      } else {
        setShowFullScreenModal(true); // Show modal when not in full-screen
      }
    }
  }, [enabled, isFullScreen, addViolation]);

  const handleCopyAttempt = useCallback(
    (e: KeyboardEvent) => {
      if (enabled) {
        // Detect Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+V
        if (e.ctrlKey && ["c", "a", "x", "v"].includes(e.key.toLowerCase())) {
          e.preventDefault();
          addViolation(
            "copy-attempt",
            `Blocked copy/paste attempt: Ctrl+${e.key.toUpperCase()}`,
          );
        }
      }
    },
    [enabled, addViolation],
  );

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (enabled) {
        e.preventDefault();
        addViolation("context-menu", "Blocked right-click context menu");
      }
    },
    [enabled, addViolation],
  );
  const handleTextSelection = useCallback(() => {
    if (enabled) {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        // Allow selection but prevent copying
        addViolation(
          "copy-attempt",
          "Text selection detected (copying blocked)",
        );
      }
    }
  }, [enabled, addViolation]);

  const dismissModal = useCallback(() => {
    setShowFullScreenModal(false);
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;

    // Full-screen change listeners
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    // Copy/paste prevention
    document.addEventListener("keydown", handleCopyAttempt);

    // Context menu prevention
    document.addEventListener("contextmenu", handleContextMenu);

    // Text selection monitoring
    document.addEventListener("selectstart", handleTextSelection);

    // Check initial full-screen state
    handleFullScreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange,
      );
      document.removeEventListener("keydown", handleCopyAttempt);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleTextSelection);
    };
  }, [
    enabled,
    handleFullScreenChange,
    handleCopyAttempt,
    handleContextMenu,
    handleTextSelection,
  ]);

  // Initial modal display check
  useEffect(() => {
    if (enabled && !isFullScreen && isFullScreenSupported) {
      setShowFullScreenModal(true);
    }
  }, [enabled, isFullScreen, isFullScreenSupported]);

  return {
    isFullScreen,
    violations,
    violationCount: violations.length,
    requestFullScreen,
    showFullScreenModal,
    dismissModal,
    isFullScreenSupported,
  };
}
