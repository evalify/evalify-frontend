"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  theme?: ThemeProviderProps;
}

/**
 * Wraps application content with theme and authentication session providers.
 *
 * Renders children within {@link NextThemesProvider} for theme management and {@link SessionProvider} for authentication session context.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  );
}
