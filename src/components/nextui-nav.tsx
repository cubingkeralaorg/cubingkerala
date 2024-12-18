"use client";

import React, { useState, useEffect } from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    NavbarContent,
    NavbarItem,
} from "@nextui-org/react";
import cookie from 'cookie';
import { UserInfo } from '@/types/types';
import { Profile } from './profile';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CubingKeralaFooter from "./ck-footer";
import { Badge } from "./ui/badge";
import ShinyButton from "./ui/shiny-button";
import Link from "next/link";
import Image from "next/image";

export default function NextUiNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const cookies = cookie.parse(document.cookie);
        const userInfoFromCookie = cookies.userInfo;

        if (userInfoFromCookie) {
            setUserInfo(JSON.parse(userInfoFromCookie));
        }
    }, []);

    async function handleLogout() {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            toast.success('Logged out successfully');
            setTimeout(() => {
                window.localStorage.clear();
                window.location.reload();
            }, 2000);
            router.replace('/')
        } else {
            console.error('Logout failed');
            toast.error('Logout failed. Please try again.');
        }
    }

    // to close the menu when a menu item is clicked
    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <Navbar
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            disableAnimation
            isBordered
            className="bg-neutral-950/80 rounded-3xl text-stone-200"
        >
            <div className="hidden md:flex items-center lg:-ml-[7vw]">
                <Link href={"/"}>
                    <NavbarBrand className="gap-1">
                        <Image className="h-12 w-12" width={100} height={100} src="/logotransparent.png" alt="Cubing Kerala" />
                        <p className="font-bold text-inherit mt-1">Cubing Kerala</p>
                    </NavbarBrand>
                </Link>
                <Badge className="bg-neutral-900 cursor-default h-5 mt-1 hover:bg-neutral-900 ml-2">
                    Beta
                </Badge>
            </div>

            <div className="hidden md:flex items-center gap-5 lg:-mr-[8vw]">
                <NavbarItem>
                    <Link href={"/competitions"} className="text-stone-200 text-[15px] hover:underline hover:underline-offset-4">
                        Competitions
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href={"/members"} className="text-stone-200 text-[15px] hover:underline hover:underline-offset-4">
                        Members
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href={"/rankings"} className="text-stone-200 text-[15px] hover:underline hover:underline-offset-4">
                        Rankings
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href={"/classes"} className="text-stone-200 text-[15px] hover:underline hover:underline-offset-4">
                        Classes
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href={"/contact"} className="text-stone-200 text-[15px] hover:underline hover:underline-offset-4">
                        Contact
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    {
                        userInfo ? (
                            <Profile profileInfo={userInfo} handleLogout={handleLogout} />
                        ) : (
                            <Link href={"/login"}>
                                <ShinyButton className="rounded-md px-4 py-[2px] bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 ease-in">
                                    <span className="text-stone-200 text-[15px]">Login</span>
                                </ShinyButton>
                            </Link>
                        )
                    }
                </NavbarItem >
            </div >

            <div className="md:hidden">
                <Link href={"/"}>
                    <NavbarBrand>
                        <Image className="h-12 w-12" width={100} height={100} src="/logotransparent.png" alt="Cubing Kerala" />
                        {/* <p className="font-semibold text-inherit mt-1">Cubing Kerala</p> */}
                    </NavbarBrand>
                </Link>
            </div>

            <NavbarContent justify="end" className="md:hidden">
                <NavbarItem>
                {
                        userInfo ? (
                            <Profile profileInfo={userInfo} handleLogout={handleLogout} />
                        ) : (
                            <Link href={"/login"}>
                                <ShinyButton className="rounded-md text-sm px-3 py-[4px] bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 ease-in">
                                    <span className="text-stone-200">Login</span>
                                </ShinyButton>
                            </Link>
                        )
                    }
                </NavbarItem>
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarMenu className="bg-neutral-950/80 pt-2">
                <NavbarMenuItem>
                    <Link
                        href={"/competitions"}
                        className="text-stone-200 hover:underline hover:underline-offset-4"
                        onClick={handleMenuItemClick}
                    >
                        Competitions
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        href={"/members"}
                        className="text-stone-200 hover:underline hover:underline-offset-4"
                        onClick={handleMenuItemClick}
                    >
                        Members
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        href={"/rankings"}
                        className="text-stone-200 hover:underline hover:underline-offset-4"
                        onClick={handleMenuItemClick}
                    >
                        Rankings
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        href={"/classes"}
                        className="text-stone-200 hover:underline hover:underline-offset-4"
                        onClick={handleMenuItemClick}
                    >
                        Classes
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        href={"/contact"}
                        className="text-stone-200 hover:underline hover:underline-offset-4"
                        onClick={handleMenuItemClick}
                    >
                        Contact
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem className="-m-4 absolute bottom-5 w-[95vw]">
                    <div>
                        <CubingKeralaFooter />
                    </div>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar >
    );
}

