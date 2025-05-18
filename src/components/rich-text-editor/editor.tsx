"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { ToolbarProvider } from "@/components/rich-text-editor/toolbars/toolbar-provider";
import { EditorToolbar } from "@/components/rich-text-editor/editor-toolbar";
import { ImageExtension } from "@/components/rich-text-editor/toolbars/image";
import { ImagePlaceholder } from "@/components/rich-text-editor/toolbars/image-placeholder";
import {
  LaTeX,
  LatexNodeExtension,
} from "@/components/rich-text-editor/toolbars/latex-extension";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface EditorProps {
  className?: string;
  initialContent?: string;
  onUpdate?: (content: string) => void;
}

export function TiptapEditor({
  className,
  initialContent = '<h2 class="tiptap-heading" style="text-align: center">Hello world 🌍</h2>',
  onUpdate,
}: EditorProps) {
  const extensions = [
    StarterKit.configure({
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal",
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: "list-disc",
        },
      },
      code: {
        HTMLAttributes: {
          class: "bg-accent rounded-md p-1",
        },
      },
      horizontalRule: {
        HTMLAttributes: {
          class: "my-2",
        },
      },
      codeBlock: {
        HTMLAttributes: {
          class:
            "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",
        },
      },
      heading: {
        levels: [1, 2, 3, 4],
        HTMLAttributes: {
          class: "tiptap-heading",
        },
      },
    }),
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    LaTeX,
    LatexNodeExtension,
    ImageExtension,
    ImagePlaceholder.configure({
      allowedMimeTypes: {
        "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024, // 5MB
      onDrop: (files) => {
        console.log("Files dropped:", files);
      },
      onDropRejected: (files) => {
        console.log("Files rejected:", files);
      },
      onEmbed: (url) => {
        console.log("URL embedded:", url);
      },
    }),
  ];
  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        // Get HTML content and ensure it includes all images
        const html = editor.getHTML();
        onUpdate(html);
      }
    },
    immediatelyRender: false,
  });

  // Update content when initialContent changes (for switching between notes)
  useEffect(() => {
    if (editor && initialContent) {
      if (editor.getHTML() !== initialContent) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);

  return (
    <div className={cn("border rounded-md", className)}>
      {editor && (
        <ToolbarProvider editor={editor}>
          <EditorToolbar />
          <EditorContent editor={editor} className="overflow-auto" />
        </ToolbarProvider>
      )}
    </div>
  );
}
