import LoadingComponent from '@/components/loading'
import LoginComponent from '@/components/login'
import React, { Suspense } from 'react'

const Login = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[50vh] w-full'>
            <LoadingComponent />
          </div>
        }
      ><LoginComponent />
      </Suspense>
    </>
  )
}

export default Login