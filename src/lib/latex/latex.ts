import katex from "katex";

/**
 * Decode LaTeX content for rendering
 * This function handles any necessary decoding or processing for LaTeX strings
 */
export function decodeLatex(latex: string): string {
  // Replace HTML entities and other characters as needed
  return latex
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * Render LaTeX content in a DOM element
 * This function processes any LaTeX elements in the preview content
 */
export function renderLatexContent(element: HTMLElement): void {
  // Find all LaTeX elements (both inline and block)
  const latexElements = element.querySelectorAll(
    "span[data-latex], .inline-latex, .block-latex",
  );

  latexElements.forEach((latexElement) => {
    try {
      // Get formula from attributes or from content
      let formula = latexElement.getAttribute("data-formula") || "";
      const inline = latexElement.getAttribute("data-inline") === "true";

      // If no formula attribute, try to extract from text content
      if (!formula && latexElement.textContent) {
        formula = latexElement.textContent;
        // Remove enclosing $ or $$ if present
        if (formula.startsWith("$") && formula.endsWith("$")) {
          formula = formula.slice(1, -1);
        } else if (formula.startsWith("$$") && formula.endsWith("$$")) {
          formula = formula.slice(2, -2);
        }
      }

      const decodedFormula = decodeLatex(formula);

      // Skip if formula is empty
      if (!decodedFormula.trim()) return;

      // Create a wrapper to render the formula
      const wrapper = document.createElement("span");
      wrapper.className = inline ? "latex-inline" : "latex-block";

      // Use KaTeX to render the formula
      katex.render(decodedFormula, wrapper, {
        throwOnError: false,
        displayMode: !inline,
      });

      // Replace the original content with the rendered formula
      latexElement.innerHTML = "";
      latexElement.appendChild(wrapper);
    } catch (error: unknown) {
      console.error("Error rendering LaTeX:", error);
      // Show error indication
      const errorSpan = document.createElement("span");
      errorSpan.className = "latex-error";
      errorSpan.textContent = "Invalid LaTeX";
      latexElement.innerHTML = "";
      latexElement.appendChild(errorSpan);
    }
  });
}
