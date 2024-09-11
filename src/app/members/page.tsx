import LoadingComponent from '@/components/loading'
import MembersComponent from '@/components/members'
import db from '@/lib/db'
import { RequestInfo } from '@/types/types'
import React, { Suspense } from 'react'

const Members = async () => {

  const members = await db.members.findMany()
  

  return (
    <>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[50vh] w-full'>
            <LoadingComponent />
          </div>
        }
      ><MembersComponent membersfromdb={members as RequestInfo[]} />
      </Suspense>
    </>
  )
}

export default Members