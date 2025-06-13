"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { renderLatexContent } from "@/lib/latex/latex";
import {
  enhancePreviewImages,
  applyTiptapStyling,
} from "@/lib/latex/preview-helpers";
import DOMPurify from "dompurify";

interface ContentPreviewProps {
  content: string;
  className?: string;
  noProse?: boolean; // Disable prose styling (useful for options to avoid navigation arrows)
}

export function ContentPreview({
  content,
  className,
  noProse = false,
}: ContentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (previewRef.current && content) {
      // Set the HTML content
      previewRef.current.innerHTML = DOMPurify.sanitize(content);

      // Process any LaTeX elements
      renderLatexContent(previewRef.current);

      // Apply Tiptap-specific styling
      applyTiptapStyling(previewRef.current);

      // Process images to match editor styling
      enhancePreviewImages(previewRef.current);

      // Make links open in new tab
      const links = previewRef.current.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });

      // Add a clearfix div at the end to ensure floated elements are contained properly
      const clearfix = document.createElement("div");
      clearfix.className = "clearfix";
      clearfix.style.clear = "both";
      previewRef.current.appendChild(clearfix);
    }
  }, [content]);
  return (
    <div className={cn(!noProse && "border rounded-md", className)}>
      <div
        ref={previewRef}
        className={cn(
          noProse
            ? "max-w-none overflow-auto min-h-0 [&]:before:hidden [&]:after:hidden [&_*]:before:hidden [&_*]:after:hidden" // Aggressively hide pseudo-elements
            : "prose dark:prose-invert max-w-none p-4 overflow-auto min-h-0",
          className,
        )}
        style={
          noProse
            ? {
                fontSize: "14px",
                lineHeight: "1.5",
                // Explicitly disable any navigation-related CSS
              }
            : undefined
        }
      />
    </div>
  );
}
