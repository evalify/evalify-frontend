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
      selection.content().content.firstChild?.toJSON(),
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

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function isLocalImage(src: string): boolean {
  return src.startsWith("/uploads/") || src.startsWith("data:image/");
}

/**
 * Processes an image URL to ensure it's properly formatted for storage and retrieval
 * @param imageUrl The URL of the image to process
 * @returns A properly formatted image URL
 */
export function processImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";

  // If it's already a valid URL, return as is
  if (isValidUrl(imageUrl)) {
    return imageUrl;
  }

  // If it's a local path starting with /uploads/, it's already processed
  if (imageUrl.startsWith("/uploads/")) {
    return imageUrl;
  }

  // If it's a data URL, it should already be processed by the upload API
  if (imageUrl.startsWith("data:")) {
    console.warn("Data URL detected, should be processed via upload API");
  }

  return imageUrl;
}
