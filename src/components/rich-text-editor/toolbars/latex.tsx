"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToolbar } from "./toolbar-provider";
import { LatexDialog } from "@/components/rich-text-editor/latex-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Latex() {
  const { editor } = useToolbar();
  const [showLatexDialog, setShowLatexDialog] = useState(false);
  const [isInline, setIsInline] = useState(true);

  if (!editor) {
    return null;
  }
  // Insert LaTeX content as a proper node
  const handleLatexInsert = (latex: string) => {
    if (!editor || !latex.trim()) return;

    try {
      // Insert a LaTeX node instead of just text with dollar signs
      editor
        .chain()
        .focus()
        .insertContent({
          type: "latex",
          attrs: {
            formula: latex,
            inline: isInline,
          },
        })
        .run();
    } catch (error) {
      console.error("Error inserting LaTeX:", error);
    }
  };
  return (
    <>
      <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-7 px-1 text-xs"
              onClick={() => {
                setIsInline(true);
                setShowLatexDialog(true);
              }}
            >
              <span className="font-serif">LaTeX</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Insert Inline LaTeX</span>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-7 px-1 text-xs"
              onClick={() => {
                setIsInline(false);
                setShowLatexDialog(true);
              }}
            >
              <span className="font-serif">LaTeX Block</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Insert Block LaTeX</span>
          </TooltipContent>
        </Tooltip>
      </div>

      <LatexDialog
        open={showLatexDialog}
        onOpenChange={setShowLatexDialog}
        onInsert={handleLatexInsert}
        isInline={isInline}
      />
    </>
  );
}
