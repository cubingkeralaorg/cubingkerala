'use client'

import React from 'react'
import { Lottie } from '@/components/shared'

const LoginLoadingComponent = () => {
  return (
    <div className='w-[150px]'>
      <Lottie path='/login_loading.json' />
    </div>
  )
}

export default LoginLoadingComponent