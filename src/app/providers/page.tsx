// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider className='max-w-screen-xl bg-neutral-950 mx-auto flex flex-col min-h-screen justify-between'>
      {children}
    </NextUIProvider>
  )
}