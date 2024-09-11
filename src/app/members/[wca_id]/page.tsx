import LoadingComponent from '@/components/loading'
import MemberInfoComponent from '@/components/memberInfo'
import db from '@/lib/db'
import { CompetitorData, RequestInfo } from '@/types/types'
import axios from 'axios'
import React, { Suspense } from 'react'

const MemberInfo = async ({ params }: { params: { wca_id: string } }) => {

  const member = await db.members.findUnique({
    where: {
      wcaid: params.wca_id
    }
  })

  if(!member){
    return <div className='flex items-center justify-center min-h-[50vh] w-full'>
      <div className='text-center'>
        <p>404</p>
        <h1 className='text-3xl font-bold'>Member Not Found</h1>
      </div>
    </div>
  }


  const memberResult = await axios.get(`https://www.worldcubeassociation.org/api/v0/persons/${params.wca_id}`)
  

  return (
    <>
      <Suspense fallback={
        <div className='flex items-center justify-center min-h-[50vh] w-full'>
          <LoadingComponent />
        </div>
      }><MemberInfoComponent member={member as RequestInfo} memberResult={memberResult.data as CompetitorData} /></Suspense>
    </>

  )
}

export default MemberInfo