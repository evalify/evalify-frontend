"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { renderLatexContent } from "@/lib/latex/latex";
import DOMPurify from "dompurify";

interface SimpleContentPreviewProps {
  content: string;
  className?: string;
}

export function SimpleContentPreview({
  content,
  className,
}: SimpleContentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && content) {
      // Set the HTML content
      previewRef.current.innerHTML = DOMPurify.sanitize(content);

      // Process any LaTeX elements
      renderLatexContent(previewRef.current);

      // Make links open in new tab
      const links = previewRef.current.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }
  }, [content]);

  return (
    <div
      ref={previewRef}
      className={cn(
        "text-sm leading-relaxed", // Simple text styling without prose
        "[&_img]:max-w-full [&_img]:h-auto", // Basic image responsiveness
        "[&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800", // Link styling
        "[&_strong]:font-semibold [&_em]:italic", // Basic text formatting
        "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono", // Code styling
        "dark:[&_a]:text-blue-400 dark:hover:[&_a]:text-blue-300", // Dark mode link colors
        "dark:[&_code]:bg-gray-800 dark:[&_code]:text-gray-200", // Dark mode code colors
        className,
      )}
    />
  );
}
