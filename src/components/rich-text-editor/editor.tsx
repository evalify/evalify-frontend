"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
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
import { useEffect, forwardRef, useImperativeHandle } from "react";
import DOMPurify from "isomorphic-dompurify";

interface EditorProps {
  className?: string;
  initialContent?: string;
  onUpdate?: (content: string) => void;
  readOnly?: boolean;
  height?: string;
}

export interface TiptapEditorRef {
  editor: Editor | null;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, EditorProps>(
  (
    { className, initialContent = "", onUpdate, readOnly = false, height },
    ref,
  ) => {
    // Use the sanitize method properly
    const sanitizedContent = initialContent
      ? DOMPurify.sanitize(initialContent)
      : "";
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
          console.log(`Successfully uploaded ${files.length} image(s)`);
        },
        onDropRejected: (files) => {
          const reasons = [];
          for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
              reasons.push(`File "${file.name}" exceeds the 5MB size limit`);
            } else {
              reasons.push(`File "${file.name}" has an unsupported format`);
            }
          }
          console.error("Image upload failed:", reasons.join(", "));
        },
        onEmbed: (url) => {
          console.log(`Image embedded from URL: ${url}`);
        },
      }),
    ];
    const editor = useEditor({
      extensions,
      content: sanitizedContent,
      editable: !readOnly,
      editorProps: {
        attributes: {
          class: `prose dark:prose-invert max-w-none focus:outline-none p-4`,
          style: height ? `min-height: ${height}` : "min-height: 100px",
        },
      },
      onUpdate: ({ editor }) => {
        if (onUpdate && !readOnly) {
          const html = editor.getHTML();
          onUpdate(html);
        }
      },
      immediatelyRender: false,
    });

    // Expose the editor instance through the ref
    useImperativeHandle(
      ref,
      () => ({
        editor,
      }),
      [editor],
    );

    useEffect(() => {
      if (editor && initialContent) {
        const clean = initialContent ? DOMPurify.sanitize(initialContent) : "";
        if (editor.getHTML() !== clean) {
          editor.commands.setContent(clean);
        }
      }
    }, [editor, initialContent]);
    return (
      <div className={cn("border rounded-md", className)}>
        {editor && (
          <ToolbarProvider editor={editor}>
            {!readOnly && <EditorToolbar />}
            <EditorContent editor={editor} className="overflow-auto" />
          </ToolbarProvider>
        )}
      </div>
    );
  },
);

TiptapEditor.displayName = "TiptapEditor";
