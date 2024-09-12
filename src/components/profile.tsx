'use client'

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { UserInfo } from "@/types/types"
import Link from "next/link"

export function Profile({ profileInfo, handleLogout }: {
    profileInfo: UserInfo | null,
    handleLogout: () => void
}) {

    return (
        <Menubar className="bg-black shadow-none border-none">
            <MenubarMenu>
                <MenubarTrigger className="p-0 cursor-pointer hover:underline hover:underline-offset-4 rounded-none text-red-500">Logout</MenubarTrigger>
                <MenubarContent style={{zIndex: '10000'}} className="bg-black border-stone-800 rounded-none text-stone-200">
                    <MenubarItem className="text-stone-400 hover:bg-none cursor-default">{profileInfo?.me.name}</MenubarItem>
                    {
                        profileInfo?.me.wca_id == "2017JOHN14" ? <Link href={"/requests"}><MenubarItem className="hover:bg-neutral-900 cursor-pointer">Requsets</MenubarItem></Link> : null
                    }
                    <MenubarItem onClick={handleLogout} className="hover-bg-red-500/10 hover:text-red-500 hover:bg-red-500/10 rounded-none cursor-pointer">Logout</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
