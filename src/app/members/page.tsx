import MembersComponent from '@/components/members'
import db from '@/lib/db'
import { RequestInfo } from '@/types/types'
import React from 'react'
export const dynamic = 'force-dynamic'

const Members = async () => {

  const members = await db.members.findMany()


  return (
    <>
      <MembersComponent membersfromdb={members as RequestInfo[]} />
    </>
  )
}

export default Members