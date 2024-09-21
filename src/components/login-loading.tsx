'use client'

import React from 'react'
import LottieComponent from './lottie'

const LoginLoadingComponent = () => {
  return (
    <div className='w-[150px]'>
      <LottieComponent path='/login_loading.json' />
    </div>
  )
}

export default LoginLoadingComponent