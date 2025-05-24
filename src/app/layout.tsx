import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css"; // Import KaTeX CSS
import "@/components/rich-text-editor/css/latex.css"; // Import custom LaTeX CSS
import "@/components/rich-text-editor/css/preview.css"; // Import preview styles
import { Providers } from "@/lib/provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Evalify - Online Exam Platform",
  description:
    "A modern platform for creating and managing online examinations",
};

// This enables the loading.tsx to be automatically used during navigation
// export const dynamic = "force-dynamic";
// export const runtime = 'edge';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            expand={false}
            visibleToasts={9}
          />
        </Providers>
      </body>
    </html>
  );
}
