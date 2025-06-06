// app/providers.tsx
'use client'

import {HeroUIProvider} from '@heroui/react'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider className='max-w-screen-xl bg-neutral-950 mx-auto flex flex-col min-h-screen justify-between'>
      {children}
    </HeroUIProvider>
  )
}