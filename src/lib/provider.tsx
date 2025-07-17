"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface ProvidersProps {
  children: React.ReactNode;
  theme?: ThemeProviderProps;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3, // Retry failed queries three times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
      staleTime: 1000 * 60 * 1, // 1 minute fresh
    },
    mutations: {
      retry: false, // still no retry for POST/PUT/DELETE unless needed
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
