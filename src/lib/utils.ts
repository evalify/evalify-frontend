import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Editor } from "@tiptap/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME =
  "node-handles-selected-style";

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export const duplicateContent = (editor: Editor) => {
  const { view } = editor;
  const { state } = view;
  const { selection } = state;

  editor
    .chain()
    .insertContentAt(
      selection.to,
      selection.content().content.firstChild
        ? selection.content().content.firstChild?.toJSON() || {}
        : {},
      {
        updateSelection: true,
      }
    )
    .focus(selection.to)
    .run();
};

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) {
    return str;
  }
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    return null;
  }
}

export function processImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";

  if (isValidUrl(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads/")) {
    return imageUrl;
  }
  if (imageUrl.startsWith("data:")) {
    console.warn("Data URL detected, should be processed via upload API");
  }

  return imageUrl;
}
