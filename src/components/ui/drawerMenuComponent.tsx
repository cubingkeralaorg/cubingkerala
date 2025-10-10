"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import { Menu} from "lucide-react"

import { Button } from "@heroui/react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { toast } from "sonner";
import cookie from "cookie";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/types/types";
import Link from "next/link";
import CubingKeralaFooter from "../ck-footer";

export function DrawerMenuComponent() {
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
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      toast.success("Logged out successfully");
      setTimeout(() => {
        window.localStorage.clear();
        window.location.reload();
      }, 2000);
      router.replace("/");
    } else {
      console.error("Logout failed");
      toast.error("Logout failed. Please try again.");
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Menu/>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col text-stone-200 space-y-4 px-6 pt-4">
          <Link
            href="/competitions"
            className="hover:underline w-fit hover:underline-offset-2"
          >
            <DrawerClose>Competitions</DrawerClose>
          </Link>
          <Link
            href="/rankings"
            className="hover:underline w-fit hover:underline-offset-2"
          >
            <DrawerClose>Rankings</DrawerClose>
          </Link>
          <Link
            href="/members"
            className="hover:underline w-fit hover:underline-offset-2"
          >
            <DrawerClose>Members</DrawerClose>
          </Link>
          <Link
            href="/learn"
            className="hover:underline w-fit hover:underline-offset-2"
          >
            <DrawerClose>Learn</DrawerClose>
          </Link>
          <Link
            href="/contact"
            className="hover:underline w-fit hover:underline-offset-2"
          >
            <DrawerClose>Contact</DrawerClose>
          </Link>
          {userInfo?.me?.id == 6996 ? (
            <Link

              className="hover:underline w-fit hover:underline-offset-2"
              href={"/requests"}
            >
              <DrawerClose>Requests</DrawerClose>
            </Link>
          ) : null}
          {userInfo ? (
            <Button
              onPress={() => {
                handleLogout();
              }}
              className="bg-neutral-800 w-full text-stone-200"
              size="sm"
            >
              <DrawerClose><p className="text-[15px] text-red-500">Logout</p></DrawerClose>
            </Button>
          ) : (
            <Link href={"/login"}>
              <Button
                className="bg-neutral-800 w-full text-stone-200"
                size="sm"
              >
                <DrawerClose><p className="text-[15px]">Login</p></DrawerClose>
              </Button>
            </Link>
          )}
        </div>
        <CubingKeralaFooter/>
      </DrawerContent>
    </Drawer>
  )
}
