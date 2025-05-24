"use client";

import { processImageUrl } from "@/lib/utils";

export function enhancePreviewImages(element: HTMLElement): void {
  const images = element.querySelectorAll("img");

  images.forEach((img) => {
    const src = img.getAttribute("src");
    if (src) {
      const processedSrc = processImageUrl(src);
      img.setAttribute("src", processedSrc);
    }

    const parent = img.parentElement;
    if (!parent) return;

    let alignment = "center";
    if (parent.hasAttribute("data-align")) {
      alignment = parent.getAttribute("data-align") || "center";
    } else if (parent.style && parent.style.textAlign) {
      const textAlign = parent.style.textAlign;
      if (
        textAlign === "left" ||
        textAlign === "right" ||
        textAlign === "center"
      ) {
        alignment = textAlign;
      }
    } else if (
      parent.hasAttribute("style") &&
      parent.getAttribute("style")?.includes("text-align")
    ) {
      const styleAttr = parent.getAttribute("style") || "";
      if (styleAttr.includes("text-align: left")) alignment = "left";
      else if (styleAttr.includes("text-align: right")) alignment = "right";
      else if (styleAttr.includes("text-align: center")) alignment = "center";
    }

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper";
    imageWrapper.setAttribute("data-align", alignment);

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.borderRadius = "4px";

    imageContainer.appendChild(img.cloneNode(true));
    imageWrapper.appendChild(imageContainer);

    const title = img.getAttribute("title") || img.getAttribute("alt");
    if (title) {
      const caption = document.createElement("figcaption");
      caption.textContent = title;
      caption.className = "text-center";
      imageWrapper.appendChild(caption);
    }

    parent.replaceChild(imageWrapper, img);

    const breakElement = document.createElement("div");
    breakElement.className = "image-break";
    breakElement.style.clear = "both";
    breakElement.style.display = "block";
    parent.insertBefore(breakElement, imageWrapper.nextSibling);
  });

  const clearfix = document.createElement("div");
  clearfix.style.clear = "both";
  element.appendChild(clearfix);
}

export function applyTiptapStyling(element: HTMLElement): void {
  const headings = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((heading) => {
    heading.classList.add("tiptap-heading");
  });

  const bulletLists = element.querySelectorAll("ul");
  bulletLists.forEach((list) => {
    list.classList.add("list-disc");
  });

  const orderedLists = element.querySelectorAll("ol");
  orderedLists.forEach((list) => {
    list.classList.add("list-decimal");
  });

  const codeBlocks = element.querySelectorAll("pre");
  codeBlocks.forEach((block) => {
    block.classList.add(
      "bg-primary",
      "text-primary-foreground",
      "p-2",
      "text-sm",
      "rounded-md",
      "p-1",
    );
  });

  const inlineCodes = element.querySelectorAll("code:not(pre code)");
  inlineCodes.forEach((code) => {
    code.classList.add("bg-accent", "rounded-md", "p-1");
  });

  const hrs = element.querySelectorAll("hr");
  hrs.forEach((hr) => {
    hr.classList.add("my-2");
  });

  const paragraphs = element.querySelectorAll("p");
  paragraphs.forEach((paragraph) => {
    const prevEl = paragraph.previousElementSibling;
    if (
      prevEl &&
      (prevEl.classList.contains("image-wrapper") ||
        prevEl.classList.contains("image-break"))
    ) {
      paragraph.style.clear = "both";
      paragraph.style.display = "block";
    }
  });
}
