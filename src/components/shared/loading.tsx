'use client'

import React from 'react'
import LoginLoadingComponent from '../auth/login-loading'

const LoadingComponent = ({ width }: { width?: number }) => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <LoginLoadingComponent />
    </div>
  )
}

export default LoadingComponent