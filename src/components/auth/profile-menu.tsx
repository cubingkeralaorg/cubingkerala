'use client'

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import Link from "next/link"
import { AnimatedContactLink } from "@/components/contact"
import { UserInfo } from "@/types/api"

export function Profile({ profileInfo, handleLogout }: {
    profileInfo: UserInfo | null,
    handleLogout: () => void
}) {

    return (
        <Menubar className="bg-transparent -mx-4 shadow-none border-none">
            <MenubarMenu>
                <MenubarTrigger>
                    <AnimatedContactLink userInfo={profileInfo?.me.wca_id} text="Logout" />
                </MenubarTrigger>
                <MenubarContent style={{zIndex: '10000'}} className="bg-background border-border rounded-md text-foreground">
                    <MenubarItem className="text-muted-foreground hover:bg-none cursor-default">{profileInfo?.me.name}</MenubarItem>
                    {
                        profileInfo?.me.wca_id == "2017JOHN14" ? <Link href={"/requests"}><MenubarItem className="hover:bg-accent cursor-pointer">Requsets</MenubarItem></Link> : null
                    }
                    <MenubarItem onClick={handleLogout} className="hover-bg-red-500/10 hover:text-red-500 hover:bg-red-600/10 rounded-none cursor-pointer">Logout</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
