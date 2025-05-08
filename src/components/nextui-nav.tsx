"use client";

import React, { useState, useEffect } from "react";
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
import { AlignRight } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function NextUiNavbar() {

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

    const handleRedirectToPage = (page: string) => {
        router.push(`/${page}`)
    }


    return (
        <div className="w-full bg-neutral-950 z-50 flex sticky top-0 justify-between items-center px-5 md:px-10 md:py-3 p-2 pb-3">
            <div className="flex justify-between w-full">
                {/* larger screen */}
                <Link href={"/"} className="flex items-center">
                    <Image className="h-12 w-12" width={100} priority height={100} src="/logotransparent.png" alt="Cubing Kerala" />
                    <p className="font-bold text-stone-200 text-inherit mt-1 hidden lg:block">Cubing Kerala</p>
                    <Badge className="bg-neutral-800 hidden lg:block cursor-default h-5 mt-1 hover:bg-neutral-800 ml-2">
                        Beta
                    </Badge>
                </Link>
                <div className="hidden md:flex items-center text-stone-200 gap-5">
                    <Link className="hover:text-green-400 hover:scale-105 transition-all ease-in-out" href={"/competitions"}>Competitions</Link>
                    <Link className="hover:text-green-400 hover:scale-105 transition-all ease-in-out" href={"/members"}>Members</Link>
                    <Link className="hover:text-green-400 hover:scale-105 transition-all ease-in-out" href={"/rankings"}>Rankings</Link>
                    <Link className="hover:text-green-400 hover:scale-105 transition-all ease-in-out" href={"/learn"}>Learn</Link>
                    <Link className="hover:text-green-400 hover:scale-105 transition-all ease-in-out" href={"/contact"}>Contact</Link>
                    <div>
                        {
                            userInfo ? (
                                <Profile profileInfo={userInfo} handleLogout={handleLogout} />
                            ) : (
                                <Link href={"/login"}>
                                    <ShinyButton className="rounded-md text-sm px-3 py-[4px] bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 ease-in">
                                        <span className="text-green-400">Login</span>
                                    </ShinyButton>
                                </Link>
                            )
                        }
                    </div>
                </div>
                {/* Smaller screen */}
                <div className="md:hidden flex items-center gap-2">
                    <div>
                        {
                            userInfo ? (
                                <Profile profileInfo={userInfo} handleLogout={handleLogout} />
                            ) : (
                                <Link href={"/login"}>
                                    <ShinyButton className="rounded-md text-sm px-3 py-[4px] bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 ease-in">
                                        <span className="text-green-400">Login</span>
                                    </ShinyButton>
                                </Link>
                            )
                        }
                    </div>
                    <div style={{ zIndex: '1000' }} className="w-fit h-fit">
                        <Sheet>
                            <SheetTrigger className="flex items-center border border-neutral-800 p-1 px-3 rounded-md">
                                <AlignRight className="w-5 h-5 text-stone-200" />
                            </SheetTrigger>
                            <SheetContent className="w-full h-screen bg-neutral-950 border-none">
                                <div style={{zIndex: '1000'}} className="w-full relative">
                                    {
                                        userInfo ? (
                                                <SheetClose onClick={() => handleLogout()}>
                                                    <ShinyButton className="rounded-md absolute -top-1 right-[52px] text-sm px-3 py-[4px] bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 ease-in">
                                                        <span className="text-red-500">Logout</span>
                                                    </ShinyButton>
                                                </SheetClose>
                                        ) : (
                                            <Link href={"/login"}>
                                                <SheetClose>
                                                    <ShinyButton className="rounded-md absolute -top-1 right-[52px] text-sm px-3 py-[4px] bg-neutral-800 hover:bg-neutral-700 transition-all duration-200 ease-in">
                                                        <span className="text-green-400">Login</span>
                                                    </ShinyButton>
                                                </SheetClose>
                                            </Link>
                                        )
                                    }
                                    <SheetClose>
                                        <div className="p-1 px-3 border flex items-center border-neutral-800 rounded-md text-stone-200 absolute -top-1 right-0">
                                        <Cross2Icon className="h-5 w-5 " />
                                        </div>
                                    </SheetClose>

                                </div>
                                <SheetHeader className="absolute top-2">
                                    <SheetTrigger onClick={() => handleRedirectToPage('')}>
                                        <SheetTitle>
                                            <div className="flex items-center">
                                                <Image className="h-12 w-12" width={100} priority height={100} src="/logotransparent.png" alt="Cubing Kerala" />
                                                <Badge className="bg-neutral-900 hidden md:block cursor-default h-5 mt-1 hover:bg-neutral-900 ml-2">
                                                    Beta
                                                </Badge>
                                            </div>
                                        </SheetTitle>
                                    </SheetTrigger>
                                    <SheetDescription className="py-5">
                                        <div className="text-stone-200 flex flex-col space-y-6">
                                            <SheetTrigger onClick={() => handleRedirectToPage('competitions')}><p className="text-[20px] text-start hover:text-green-400 hover:scale-105 transition-all ease-in-out">Competitions</p>
                                            </SheetTrigger>                                          
                                            <SheetTrigger onClick={() => handleRedirectToPage('members')}><p className="text-[20px] text-start hover:text-green-400 hover:scale-105 transition-all ease-in-out">Members</p></SheetTrigger>                                           
                                            <SheetTrigger onClick={() => handleRedirectToPage('rankings')}><p className="text-[20px] text-start hover:text-green-400 hover:scale-105 transition-all ease-in-out">Rankings</p></SheetTrigger>                      
                                            <SheetTrigger onClick={() => handleRedirectToPage('learn')}><p className="text-[20px] text-start hover:text-green-400 hover:scale-105 transition-all ease-in-out">Learn</p></SheetTrigger>                                           
                                            <SheetTrigger onClick={() => handleRedirectToPage('contact')}><p className="text-[20px] text-start hover:text-green-400 hover:scale-105 transition-all ease-in-out">Contact</p></SheetTrigger> 
                                        </div>
                                    </SheetDescription>
                                </SheetHeader>
                                <SheetFooter className="absolute bottom-2 left-0 w-full px-2">
                                    <CubingKeralaFooter />
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>
    );
}

