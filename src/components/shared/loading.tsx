'use client'

import React from 'react'
import LoginLoadingComponent from '../auth/login-loading'

const LoadingComponent = ({ width }: { width?: number }) => {
  return (
    <div className="flex-1 flex w-full min-h-[100dvh] md:min-h-screen justify-center items-center pb-32 md:pb-0">
      <LoginLoadingComponent />
    </div>
  )
}

export default LoadingComponent