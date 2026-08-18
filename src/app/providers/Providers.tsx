'use client'

import {HeroUIProvider} from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({children}: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <HeroUIProvider className="mx-auto flex min-h-dvh w-full max-w-screen-xl flex-col">
          {children}
        </HeroUIProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  )
}
