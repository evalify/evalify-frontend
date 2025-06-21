"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LatexPreview } from "@/components/rich-text-editor/latex-preview";
import { latexTemplates } from "@/components/rich-text-editor/latex-templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface LatexDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (latex: string) => void;
  isInline?: boolean;
  initialValue?: string;
}

export function LatexDialog({
  open,
  onOpenChange,
  onInsert,
  isInline = true,
  initialValue = "",
}: LatexDialogProps) {
  const [latex, setLatex] = useState(initialValue);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState("editor");
  const [history, setHistory] = useState<string[]>([initialValue]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  useEffect(() => {
    if (open) {
      if (initialValue) {
        setLatex(initialValue);
      }

      // Reset history when dialog opens
      setHistory([initialValue || ""]);
      setHistoryIndex(0);

      // Focus the textarea when dialog opens
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, [initialValue, open]);

  const handleInsert = () => {
    if (latex.trim()) {
      onInsert(latex);
      setLatex("");
      onOpenChange(false);
    }
  };
  const insertTemplate = (template: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart || 0;
      const end = textareaRef.current.selectionEnd || 0;
      const newValue =
        latex.substring(0, start) + template + latex.substring(end);

      // Update the state immediately
      setLatex(newValue);

      // Add to history
      addToHistory(newValue);

      // Focus and set cursor position after React updates the DOM
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + template.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);

          // Trigger a click event to ensure the textarea has focus
          textareaRef.current.click();
        }
      }, 10);
    } else {
      // If textarea ref is not available, just append the template
      const newValue = latex + template;
      setLatex(newValue);
      addToHistory(newValue);
    }
  };

  // Add a state change to the history
  const addToHistory = (newValue: string) => {
    // Remove any forward history if we're in the middle of undo/redo chain
    const newHistory = history.slice(0, historyIndex + 1);

    // Add the new state to history
    setHistory([...newHistory, newValue]);
    setHistoryIndex(newHistory.length);
  };
  const handleTextareaClick = () => {
    if (textareaRef.current) {
      // Store focus in the textarea when clicked
      textareaRef.current.focus();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle undo/redo keyboard shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
      return;
    }

    // Handle redo with Ctrl+Y as well
    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      handleRedo();
      return;
    }

    // Ensure tab behavior works as expected in the editor
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;

      // Insert 2 spaces for tab
      const newValue = latex.substring(0, start) + "  " + latex.substring(end);
      setLatex(newValue);
      addToHistory(newValue);

      // Move cursor after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + 2;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedoAction(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLatex(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedoAction(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLatex(history[newIndex]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Insert LaTeX Equation</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="editor"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="editor">Editor & Preview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Equation</label>
                <Textarea
                  ref={textareaRef}
                  value={latex}
                  onChange={(e) => {
                    setLatex(e.target.value);
                    // Only add to history if not already an undo/redo action
                    if (!isUndoRedoAction) {
                      addToHistory(e.target.value);
                    }
                    setIsUndoRedoAction(false);
                  }}
                  onClick={handleTextareaClick}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter LaTeX equation..."
                  className="font-mono min-h-[250px]"
                />
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("\\dfrac{}{}")}
                    title="Insert display fraction"
                  >
                    ∕
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("\\sqrt{}")}
                    title="Insert square root"
                  >
                    √
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("\\sqrt[]{}")}
                    title="Insert nth root"
                  >
                    ⁿ√
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("^{}")}
                    title="Superscript"
                  >
                    xⁿ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("_{}")}
                    title="Subscript"
                  >
                    xₙ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("\\sum_{i=0}^{n}")}
                    title="Sum"
                  >
                    Σ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("\\int_{a}^{b}")}
                    title="Integral"
                  >
                    ∫
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("\\space ")}
                    title="Space"
                  >
                    ␣
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate("\\\\")}
                    title="New Line"
                  >
                    ↵
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      insertTemplate(
                        "\\begin{pmatrix} a & b & c \\end{pmatrix}",
                      )
                    }
                    title="Row Matrix (1×3)"
                  >
                    [1×3]
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      insertTemplate(
                        "\\begin{pmatrix} a \\\\ b \\\\ c \\end{pmatrix}",
                      )
                    }
                    title="Column Matrix (3×1)"
                  >
                    [3×1]
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      insertTemplate(
                        "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
                      )
                    }
                    title="Matrix 2×2"
                  >
                    [2×2]
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      insertTemplate(
                        "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}",
                      )
                    }
                    title="Matrix 3×3"
                  >
                    [3×3]
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div className="border rounded-md p-4 min-h-[250px] bg-muted/20 overflow-auto">
                  <LatexPreview
                    content={
                      isInline
                        ? latex.startsWith("$") && latex.endsWith("$")
                          ? latex
                          : `$${latex}$`
                        : latex.startsWith("$$") && latex.endsWith("$$")
                          ? latex
                          : `$$${latex}$$`
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {latexTemplates.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h3 className="font-medium text-md">{category.category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {category.templates.map((template) => (
                        <div
                          key={template.name}
                          className="border rounded p-3 hover:border-primary cursor-pointer transition-colors"
                          onClick={() => {
                            // First insert the template
                            insertTemplate(template.template);

                            // Then switch to editor tab after a small delay
                            setTimeout(() => {
                              setActiveTab("editor");
                            }, 50);
                          }}
                        >
                          <div className="font-medium text-sm mb-1">
                            {template.name}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </div>
                          <div className="bg-muted/20 rounded p-2 text-center">
                            <LatexPreview
                              content={`$${
                                template.example || template.template
                              }$`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
