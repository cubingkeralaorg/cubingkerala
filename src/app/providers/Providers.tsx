'use client'

import {HeroUIProvider} from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <HeroUIProvider className='max-w-screen-xl mx-auto flex flex-col min-h-screen justify-between'>
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
  )
}
