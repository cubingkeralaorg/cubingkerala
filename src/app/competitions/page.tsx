import CompetitionsComponent from '@/components/competitions'
import LoadingComponent from '@/components/loading'
import React, { Suspense } from 'react'

const Competitions = () => {
  return (
    <>
      <Suspense
        fallback={
        <div className='flex items-center justify-center min-h-[50vh] w-full'>
          <LoadingComponent />
        </div>
      }>
        <CompetitionsComponent />
      </Suspense>
    </>
  )
}

export default Competitions