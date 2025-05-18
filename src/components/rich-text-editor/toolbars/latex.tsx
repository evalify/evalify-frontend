"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToolbar } from "./toolbar-provider";
import { LatexDialog } from "@/components/rich-text-editor/latex-dialog";

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
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsInline(true);
          setShowLatexDialog(true);
        }}
        title="Insert Inline LaTeX"
      >
        <span className="font-serif">LaTeX</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsInline(false);
          setShowLatexDialog(true);
        }}
        title="Insert Block LaTeX"
      >
        <span className="font-serif">LaTeX Block</span>
      </Button>

      <LatexDialog
        open={showLatexDialog}
        onOpenChange={setShowLatexDialog}
        onInsert={handleLatexInsert}
        isInline={isInline}
      />
    </>
  );
}
