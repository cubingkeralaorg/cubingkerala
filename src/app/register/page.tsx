import LoadingComponent from '@/components/loading'
import RegisterComponent from '@/components/register'
import React, { Suspense } from 'react'

const Register = () => {
  return (
    <>
      <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-[50vh] w-full'>
          <LoadingComponent />
        </div>
      }
      ><RegisterComponent /></Suspense>
    </>
  )
}

export default Register