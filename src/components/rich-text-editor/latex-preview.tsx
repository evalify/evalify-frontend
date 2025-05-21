"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { decodeLatex } from "@/lib/latex";

interface LatexPreviewProps {
  content: string;
  variant?: "inline" | "block";
  className?: string;
}

export function LatexPreview({
  content,
  variant = "inline",
  className = "",
}: LatexPreviewProps) {
  const renderLatexPart = (latex: string) => {
    try {
      const decodedLatex = decodeLatex(latex.slice(1, -1));
      if (variant === "block") {
        return <BlockMath math={decodedLatex} />;
      }
      return <InlineMath math={decodedLatex} />;
    } catch (error) {
      console.error("Error rendering LaTeX:", error);
      return <span className="text-destructive">Invalid LaTeX</span>;
    }
  };

  // Using a more compatible regex pattern without 's' flag
  const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^\$]*?\$)/);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          return (
            <span key={index} className="block my-2">
              {renderLatexPart(part.slice(1, -1))}
            </span>
          );
        }
        if (part.startsWith("$") && part.endsWith("$")) {
          return (
            <span key={index} className="mx-1">
              {renderLatexPart(part)}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
