import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/ui/provider";

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
/**
 * Root layout component that sets up global fonts, metadata, and context providers for the application.
 *
 * Wraps all pages with configured Google fonts, applies global styles, and provides application-wide context using {@link Providers}.
 *
 * @param children - The page content to be rendered within the layout.
 */

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
