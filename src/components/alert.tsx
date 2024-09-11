'use client'

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { UserInfo } from "@/types/types"
import { IoMdClose } from "react-icons/io";


export function AlertComponent({ userInfo, show, handleClick }: { userInfo: UserInfo | null, show: boolean, handleClick: () => void }) {
    return (
        <>
            {
                show && userInfo != null ? <Alert className="rounded-none bg-black text-stone-200 border-green-500 h-max">
                    <div className="absolute right-5">
                        <IoMdClose onClick={handleClick} className="cursor-pointer text-stone-200 hover:text-gray-500 hover:scale-105 transition-all" />
                    </div>
                    <AlertTitle>
                        Logged in as <span className="font-bold">{userInfo?.me.name}</span>
                    </AlertTitle>
                    <AlertDescription>
                        Welcome to Cubing Kerala!
                    </AlertDescription>
                </Alert>
                    : null
            }
        </>

    )
}
