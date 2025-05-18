"use client";

import { Code } from "lucide-react";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/rich-text-editor/toolbars/toolbar-provider";

type ButtonProps = React.ComponentPropsWithRef<typeof Button>;

const CodeBlockToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();

    useEffect(() => {
      if (!editor) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab" && editor.isActive("codeBlock")) {
          e.preventDefault();
          // Insert 4 spaces at cursor position
          editor.commands.insertContent("    ");
        }
      };
      const editorElement = editor.view.dom;
      editorElement.addEventListener("keydown", handleKeyDown);
      return () => {
        editorElement.removeEventListener("keydown", handleKeyDown);
      };
    }, [editor]);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              editor?.isActive("codeBlock") && "bg-muted",
              className
            )}
            onClick={(e) => {
              editor
                ?.chain()
                .focus()
                .toggleNode("codeBlock", "paragraph")
                .run();
              onClick?.(e);
            }}
            disabled={
              !editor
                ?.can()
                .chain()
                .focus()
                .toggleNode("codeBlock", "paragraph")
                .run()
            }
            ref={ref}
            {...props}
          >
            {children || <Code className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Code Block</span>
        </TooltipContent>
      </Tooltip>
    );
  }
);

CodeBlockToolbar.displayName = "CodeBlockToolbar";

export { CodeBlockToolbar };
