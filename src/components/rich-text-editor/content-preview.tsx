"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { renderLatexContent } from "@/lib/latex";
import {
  enhancePreviewImages,
  applyTiptapStyling,
} from "@/lib/preview-helpers";

interface ContentPreviewProps {
  content: string;
  className?: string;
}

export function ContentPreview({ content, className }: ContentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (previewRef.current && content) {
      // Set the HTML content
      previewRef.current.innerHTML = content;

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
    <div className={cn("border rounded-md", className)}>
      <div
        ref={previewRef}
        className={cn(
          "prose dark:prose-invert max-w-none min-h-[300px] p-4 overflow-auto",
          className
        )}
      />
    </div>
  );
}
