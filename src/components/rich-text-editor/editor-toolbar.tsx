"use client";

import { BoldToolbar } from "@/components/rich-text-editor/toolbars/bold";
import { ItalicToolbar } from "@/components/rich-text-editor/toolbars/italic";
import { CodeToolbar } from "@/components/rich-text-editor/toolbars/code";
import { StrikeThroughToolbar } from "@/components/rich-text-editor/toolbars/strikethrough";
import { HardBreakToolbar } from "@/components/rich-text-editor/toolbars/hard-break";
import { HorizontalRuleToolbar } from "@/components/rich-text-editor/toolbars/horizontal-rule";
import { OrderedListToolbar } from "@/components/rich-text-editor/toolbars/ordered-list";
import { BulletListToolbar } from "@/components/rich-text-editor/toolbars/bullet-list";
import { CodeBlockToolbar } from "@/components/rich-text-editor/toolbars/code-block";
import { BlockquoteToolbar } from "@/components/rich-text-editor/toolbars/blockquote";
import { RedoToolbar } from "@/components/rich-text-editor/toolbars/redo";
import { UndoToolbar } from "@/components/rich-text-editor/toolbars/undo";
import { ImagePlaceholderToolbar } from "@/components/rich-text-editor/toolbars/image-placeholder-toolbar";
import { ColorHighlightToolbar } from "@/components/rich-text-editor/toolbars/color-and-highlight";

import { Latex } from "@/components/rich-text-editor/toolbars/latex";
import { Separator } from "@/components/ui/separator";

export function EditorToolbar() {
  return (
    <div className="flex flex-wrap w-full p-3 h-full [&>button]:shrink-0 items-center gap-2">
      <UndoToolbar />
      <RedoToolbar />
      <Separator orientation="vertical" className="h-7" />
      <BoldToolbar />
      <ItalicToolbar />
      <StrikeThroughToolbar />
      <BulletListToolbar />
      <OrderedListToolbar />
      <CodeToolbar />
      <CodeBlockToolbar />
      <HorizontalRuleToolbar />
      <ImagePlaceholderToolbar />
      <BlockquoteToolbar />
      <HardBreakToolbar />
      <ColorHighlightToolbar />
      <Separator orientation="vertical" className="h-7" />
      <Latex />
    </div>
  );
}
