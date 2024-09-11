import LoadingComponent from '@/components/loading'
import RankingsComponent from '@/components/rankings'
import React, { Suspense } from 'react'

const Rankings = () => {
  return (
    <>
      <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-[50vh] w-full'>
          <LoadingComponent />
        </div>
      }
      ><RankingsComponent /></Suspense>
    </>
  )
}

export default Rankings