'use client'

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { UserInfo } from "@/types/api"


export function AlertComponent({ userInfo }: { userInfo: UserInfo | null }) {
    return (
        <>
            {
                userInfo &&
                <div className="relative">
                    <Alert className="rounded-full absolute top-2 left-3 md:left-0 md:top-4 w-fit bg-black/55 border-none flex z-50 text-neutral-300">
                        <div>
                            <AlertTitle className="text-nowrap">
                                Logged in as <span className="font-bold">{userInfo?.me.name}</span>
                            </AlertTitle>
                            <AlertDescription className="text-nowrap">
                                Welcome to Cubing Kerala!
                            </AlertDescription>
                        </div>
                    </Alert>
                </div>
            }
        </>

    )
}
