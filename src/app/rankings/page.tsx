import RankingsComponent from '@/components/rankings'
import db from '@/lib/db'
import { RequestInfo } from '@/types/types'
import React from 'react'

const Rankings = async () => {

  const members = await db.members.findMany()

  return (
    <>
      <RankingsComponent members={members as RequestInfo[]} />
    </>
  )
}

export default Rankings