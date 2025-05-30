"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  DrawerFooter,
} from "@heroui/react";
import { X } from "lucide-react";
import Image from "next/image";
import logo from "../../public/logotransparent.png";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { UserInfo } from "@/types/types";

export default function HeroDrawer({
  isOpen,
  onOpenChange,
  userInfo,
  handleLogout
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  userInfo: UserInfo | null;
  handleLogout: () => void;
}) {

  return (
    <>
      <Drawer
        hideCloseButton={true}
        size="full"
        placement="top"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent className="bg-neutral-950 text-stone-200">
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-between items-center">
                <Link href={"/"}>
                  <div
                    onClick={onClose}
                    className="flex items-center gap-1 font-semibold"
                  >
                    <Image width={40} height={40} src={logo} alt="logo"></Image>
                    <p className="mt-[2.5px] text-[17px]">Cubing Kerala</p>
                  </div>
                </Link>
                <X onClick={onClose} />
              </DrawerHeader>
              <DrawerBody className="flex flex-col gap-4">
                <Link onClick={onClose} href={"/competitions"}>
                  Competitions
                </Link>
                <Link onClick={onClose} href={"/rankings"}>
                  Rankings
                </Link>
                <Link onClick={onClose} href={"/members"}>
                  Members
                </Link>
                <Link onClick={onClose} href={"/learn"}>
                  Learn
                </Link>
                <Link onClick={onClose} href={"/contact"}>
                  Contact
                </Link>
                {userInfo ? (
                  <Button
                    onPress={() => {
                      handleLogout();
                      onClose();
                    }}
                    className="bg-neutral-800 w-full text-stone-200"
                    size="sm"
                  >
                    <p className="text-[15px] text-red-500">Logout</p>
                  </Button>
                ) : (
                  <Link onClick={onClose} href={"/login"}>
                    <Button
                      className="bg-neutral-800 w-full text-stone-200"
                      size="sm"
                    >
                      <p className="text-[15px]">Login</p>
                    </Button>
                  </Link>
                )}
              </DrawerBody>
              <DrawerFooter className="flex flex-col gap-1 pb-6 text-stone-400">
                <p className="text-xs text-stone-600">
                  Created by{" "}
                  <span className="cursor-pointer hover:text-blue-400 transition-all duration-200 ease-in">
                    allenjohn
                  </span>
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs">
                    &copy; {new Date().getFullYear()} Cubing Kerala. All rights
                    reserved.
                  </p>
                  <div className="text-stone-400 transition-all duration-200 ease-in hover:text-blue-400 cursor-pointer text-xs hidden md:flex gap-1 items-center">
                    <FaGithub className="text-xs" />
                    <span>github</span>
                  </div>
                  <FaGithub className="text-stone-400 hover:text-blue-500 cursor-pointer text-xs md:hidden mr-1" />
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
