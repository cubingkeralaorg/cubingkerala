import RequestsComponent from '@/components/requests'
import db from '@/lib/db'
import React from 'react'
export const dynamic = 'force-dynamic'

const Request = async () => {

    const requests = await db.requests.findMany()
    const members = await db.members.findMany()

    return (
        <>
            <RequestsComponent requests={requests} members={members} />
        </>

    )
}

export default Request