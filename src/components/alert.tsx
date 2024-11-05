'use client'

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { UserInfo } from "@/types/types"


export function AlertComponent({ userInfo }: { userInfo: UserInfo | null }) {
    return (
        <>
            {
                userInfo &&
                <div className="text-nowrap">
                    <Alert className="rounded-none absolute top-2 bg-transparent border-none flex z-50 text-stone-200">
                        <div>
                            <AlertTitle>
                                Logged in as <span className="font-bold">{userInfo?.me.name}</span>
                            </AlertTitle>
                            <AlertDescription>
                                Welcome to Cubing Kerala!
                            </AlertDescription>
                        </div>
                    </Alert>
                </div>
            }
        </>

    )
}
