import LoadingComponent from '@/components/loading'
import RequestsComponent from '@/components/requests'
import db from '@/lib/db'
import React, { Suspense } from 'react'

const Request = async () => {

    const requests = await db.requests.findMany()
    const members = await db.members.findMany()
    
    return (
        <>
            <Suspense
                fallback={
                    <div className='flex items-center justify-center min-h-[50vh] w-full'>
                        <LoadingComponent />
                    </div>
                }
            ><RequestsComponent requests={requests} members={members} />
            </Suspense>
        </>

    )
}

export default Request