import MembersComponent from '@/components/members'
import db from '@/lib/db'
import { RequestInfo } from '@/types/types'
import { Metadata } from 'next'
import React from 'react'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Members | Cubing Kerala",
  description: "Members of Rubik's Cube community in Kerala",
};

const Members = async () => {

  const members = await db.members.findMany()


  return (
    <>
      <MembersComponent membersfromdb={members as RequestInfo[]} />
    </>
  )
}

export default Members