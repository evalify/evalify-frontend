import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css"; // Import KaTeX CSS
import "@/components/rich-text-editor/css/latex.css"; // Import custom LaTeX CSS
import "@/components/rich-text-editor/css/preview.css"; // Import preview styles
import { Providers } from "@/lib/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evalify - Online Exam Platform",
  description:
    "A modern platform for creating and managing online examinations",
};

// This enables the loading.tsx to be automatically used during navigation
export const dynamic = "force-dynamic";
// export const runtime = 'edge';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
