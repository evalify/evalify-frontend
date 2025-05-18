"use client";

import { Extension, Node, NodeViewProps } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { InlineMath, BlockMath } from "react-katex";
import React, { useCallback, useState } from "react";
import { decodeLatex } from "@/lib/latex";

// Simple LatexComponent that properly wraps with NodeViewWrapper
const LatexComponent = (props: NodeViewProps) => {
  const { node } = props;
  const { inline, formula } = node.attrs;
  const [showSource, setShowSource] = useState(false);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setShowSource(!showSource);
    },
    [showSource]
  );

  React.useEffect(() => {
    const handleClickOutside = () => {
      if (showSource) {
        setShowSource(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showSource]);

  try {
    if (showSource) {
      return (
        <NodeViewWrapper
          as={inline ? "span" : "div"}
          className={inline ? "inline-node" : "block-node"}
        >
          <span
            className="inline-block bg-muted/40 p-1 rounded-md mx-1 font-mono text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {inline ? "$" : "$$"}
            {formula}
            {inline ? "$" : "$$"}
          </span>
        </NodeViewWrapper>
      );
    }

    const decodedFormula = decodeLatex(formula);
    return (
      <NodeViewWrapper
        as={inline ? "span" : "div"}
        className={inline ? "inline-node" : "block-node"}
      >
        <span
          className={`latex-rendered ${
            inline ? "inline-latex" : "block-latex"
          }`}
          onDoubleClick={handleDoubleClick}
        >
          {inline ? (
            <InlineMath math={decodedFormula} />
          ) : (
            <BlockMath math={decodedFormula} />
          )}
        </span>
      </NodeViewWrapper>
    );
  } catch (err) {
    console.error("Error rendering LaTeX:", err);
    return (
      <NodeViewWrapper
        as={inline ? "span" : "div"}
        className={inline ? "inline-node" : "block-node"}
      >
        <span className="text-destructive" onDoubleClick={handleDoubleClick}>
          Invalid LaTeX
        </span>
      </NodeViewWrapper>
    );
  }
};

// Revised LaTeX Node extension
export const LatexNodeExtension = Node.create({
  name: "latex",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      formula: {
        default: "",
      },
      inline: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-latex]",
        getAttrs: (node) => {
          if (typeof node === "string" || !(node instanceof HTMLElement))
            return {};
          return {
            formula: node.getAttribute("data-formula") || "",
            inline: node.getAttribute("data-inline") === "true",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      {
        "data-latex": "",
        "data-formula": HTMLAttributes.formula,
        "data-inline": HTMLAttributes.inline,
        class: HTMLAttributes.inline ? "inline-latex" : "block-latex",
      },
      `${HTMLAttributes.inline ? "$" : "$$"}${HTMLAttributes.formula}${
        HTMLAttributes.inline ? "$" : "$$"
      }`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LatexComponent);
  },
});

// Basic LaTeX extension
export const LaTeX = Extension.create({
  name: "latex-attr",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          latex: {
            default: false,
            parseHTML: (element) => element.hasAttribute("data-latex"),
            renderHTML: (attributes) => {
              if (!attributes.latex) return {};
              return { "data-latex": "" };
            },
          },
        },
      },
    ];
  },
});
