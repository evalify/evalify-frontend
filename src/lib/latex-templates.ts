export interface LatexTemplate {
  name: string;
  description: string;
  template: string;
  example?: string;
}

export interface LatexTemplateCategory {
  category: string;
  templates: LatexTemplate[];
}

export const latexTemplates: LatexTemplateCategory[] = [
  {
    category: "Basic Math",
    templates: [
      {
        name: "Fraction",
        description: "Create a fraction",
        template: "\\frac{numerator}{denominator}",
        example: "\\frac{a}{b}",
      },
      {
        name: "Square Root",
        description: "Square root function",
        template: "\\sqrt{expression}",
        example: "\\sqrt{x}",
      },
      {
        name: "Nth Root",
        description: "Nth root function",
        template: "\\sqrt[n]{expression}",
        example: "\\sqrt[3]{x}",
      },
      {
        name: "Superscript",
        description: "Exponent or power",
        template: "{base}^{exponent}",
        example: "x^2",
      },
      {
        name: "Subscript",
        description: "Subscript notation",
        template: "{base}_{subscript}",
        example: "x_i",
      },
    ],
  },
  {
    category: "Matrices",
    templates: [
      {
        name: "Matrix 2×2",
        description: "2×2 matrix",
        template: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
        example: "\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}",
      },
      {
        name: "Matrix 3×3",
        description: "3×3 matrix",
        template:
          "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}",
        example:
          "\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}",
      },
      {
        name: "Matrix with Brackets",
        description: "Matrix with square brackets",
        template: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}",
        example: "\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}",
      },
      {
        name: "Determinant",
        description: "Matrix determinant",
        template: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}",
        example: "\\begin{vmatrix} 1 & 2 \\\\ 3 & 4 \\end{vmatrix}",
      },
    ],
  },
  {
    category: "Greek Letters",
    templates: [
      {
        name: "Alpha",
        description: "Greek letter alpha",
        template: "\\alpha",
      },
      {
        name: "Beta",
        description: "Greek letter beta",
        template: "\\beta",
      },
      {
        name: "Gamma",
        description: "Greek letter gamma",
        template: "\\gamma",
      },
      {
        name: "Delta",
        description: "Greek letter delta",
        template: "\\delta",
      },
      {
        name: "Epsilon",
        description: "Greek letter epsilon",
        template: "\\epsilon",
      },
      {
        name: "Theta",
        description: "Greek letter theta",
        template: "\\theta",
      },
      {
        name: "Pi",
        description: "Greek letter pi",
        template: "\\pi",
      },
      {
        name: "Sigma",
        description: "Greek letter sigma",
        template: "\\sigma",
      },
      {
        name: "Omega",
        description: "Greek letter omega",
        template: "\\omega",
      },
    ],
  },
  {
    category: "Calculus",
    templates: [
      {
        name: "Integral",
        description: "Indefinite integral",
        template: "\\int {expression} \\, d{variable}",
        example: "\\int x^2 \\, dx",
      },
      {
        name: "Definite Integral",
        description: "Definite integral with limits",
        template: "\\int_{lower}^{upper} {expression} \\, d{variable}",
        example: "\\int_{0}^{1} x^2 \\, dx",
      },
      {
        name: "Double Integral",
        description: "Double integral",
        template: "\\iint {expression} \\, d{var1}d{var2}",
        example: "\\iint x y \\, dx dy",
      },
      {
        name: "Limit",
        description: "Limit expression",
        template: "\\lim_{{variable} \\to {value}} {expression}",
        example: "\\lim_{x \\to 0} \\frac{\\sin x}{x}",
      },
      {
        name: "Derivative",
        description: "First derivative",
        template: "\\frac{d}{d{variable}} {expression}",
        example: "\\frac{d}{dx} x^2",
      },
      {
        name: "Partial Derivative",
        description: "Partial derivative",
        template: "\\frac{\\partial}{\\partial {variable}} {expression}",
        example: "\\frac{\\partial}{\\partial x} f(x,y)",
      },
    ],
  },
  {
    category: "Sets & Logic",
    templates: [
      {
        name: "Union",
        description: "Set union",
        template: "A \\cup B",
      },
      {
        name: "Intersection",
        description: "Set intersection",
        template: "A \\cap B",
      },
      {
        name: "Set difference",
        description: "Set difference",
        template: "A \\setminus B",
      },
      {
        name: "Element of",
        description: "Element of set",
        template: "x \\in A",
      },
      {
        name: "Subset",
        description: "Subset relation",
        template: "A \\subset B",
      },
      {
        name: "For all",
        description: "Universal quantifier",
        template: "\\forall x",
      },
      {
        name: "Exists",
        description: "Existential quantifier",
        template: "\\exists x",
      },
    ],
  },
  {
    category: "Equations",
    templates: [
      {
        name: "Equation System",
        description: "System of equations",
        template:
          "\\begin{cases} equation1 \\\\ equation2 \\\\ equation3 \\end{cases}",
        example: "\\begin{cases} x + y = 10 \\\\ 2x - y = 5 \\end{cases}",
      },
      {
        name: "Aligned Equations",
        description: "Aligned multi-line equations",
        template: "\\begin{align} equation1 \\\\ equation2 \\end{align}",
        example:
          "\\begin{align} f(x) &= x^2 \\\\ g(x) &= \\frac{1}{x} \\end{align}",
      },
    ],
  },
];
