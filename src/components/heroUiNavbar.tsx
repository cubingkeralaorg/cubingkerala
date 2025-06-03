import React, { useEffect, useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import HeroDrawer from "./heroDrawer";
import { Menu } from "lucide-react";
import Link from "next/link";
import logo from "../../public/logotransparent.png";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { usePathname, useRouter } from "next/navigation";
import { UserInfo } from "@/types/types";
import cookie from "cookie";
import { toast } from "sonner";
export const dynamic = "force-dynamic";

export default function HeroUiNavbar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
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
    <>
      <div className="flex justify-between items-center px-5 py-3 md:p-5 bg-neutral-950 text-stone-200">
        <Link href={"/"}>
          <div className="flex items-center gap-1 font-semibold">
            <Image width={40} height={40} src={logo} alt="logo"></Image>
            <p className="mt-[2.5px]">Cubing Kerala</p>
            <Badge className="bg-neutral-800 ml-1 text-stone-200 mt-[2.5px] hover:bg-neutral-800 hidden md:flex">
              Beta
            </Badge>
          </div>
        </Link>
        <div className="space-x-4 hidden md:flex md:items-center">
          <Link
            className={
              pathname == "/competitions"
                ? "text-green-400"
                : "text-stone-200 hover:text-green-400 transition-all ease-in duration-200text-stone-200"
            }
            href={"/competitions"}
          >
            Competitions
          </Link>
          <Link
            className={
              pathname == "/rankings"
                ? "text-green-400"
                : "text-stone-200 hover:text-green-400 transition-all ease-in duration-200text-stone-200"
            }
            href={"/rankings"}
          >
            Rankings
          </Link>
          <Link
            className={
              pathname == "/members"
                ? "text-green-400"
                : "text-stone-200 hover:text-green-400 transition-all ease-in duration-200text-stone-200"
            }
            href={"/members"}
          >
            Members
          </Link>
          <Link
            className={
              pathname == "/learn"
                ? "text-green-400"
                : "text-stone-200 hover:text-green-400 transition-all ease-in duration-200text-stone-200"
            }
            href={"/learn"}
          >
            Learn
          </Link>
          <Link
            className={
              pathname == "/contact"
                ? "text-green-400"
                : "text-stone-200 hover:text-green-400 transition-all ease-in duration-200text-stone-200"
            }
            href={"/contact"}
          >
            Contact
          </Link>
          {userInfo?.me?.id == 6996 ? (
            <Link
              className={
                pathname == "/contact"
                  ? "text-green-400"
                  : "text-stone-200 hover:text-green-400 transition-all ease-in duration-200text-stone-200"
              }
              href={"/requests"}
            >
              Requests
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
              <p className="text-[15px] text-red-500">Logout</p>
            </Button>
          ) : (
            <Link href={"/login"}>
              <Button
                className="bg-neutral-800 w-full text-stone-200"
                size="sm"
              >
                <p className="text-[15px]">Login</p>
              </Button>
            </Link>
          )}
        </div>
        <div className="md:hidden">
          <Menu className="text-stone-200" onClick={onOpen} />
        </div>
      </div>
      <HeroDrawer
        userInfo={userInfo}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleLogout={handleLogout}
      />
    </>
  );
}
