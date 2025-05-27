import React from "react";
import { Button, useDisclosure } from "@heroui/react";
import HeroDrawer from "./heroDrawer";
import { Menu } from "lucide-react";
import Link from "next/link";
import logo from "../../public/logotransparent.png";
import Image from "next/image";
import { Badge } from "./ui/badge";

export default function HeroUiNavbar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="flex justify-between items-center px-5 py-3 md:p-5 bg-neutral-950 text-stone-200">
        <Link href={"/"}>
          <div className="flex items-center gap-1 font-semibold">
            <Image width={40} height={40} src={logo} alt="logo"></Image>
            <p className="mt-[2.5px]">Cubing Kerala</p>
            <Badge className="bg-neutral-800 ml-1 text-stone-200 mt-[2.5px] hover:bg-neutral-800 hidden md:flex">Beta</Badge>
          </div>
        </Link>
        <div className="space-x-4 hidden md:flex md:items-center">
          <Link href={"/competitions"}>Competitions</Link>
          <Link href={"/rankings"}>Rankings</Link>
          <Link href={"/members"}>Members</Link>
          <Link href={"/learn"}>Learn</Link>
          <Link href={"/contact"}>Contact</Link>
          <Link href={"/login"}>
            <Button className="bg-neutral-800 text-stone-200" size="sm">
              <p className="text-[15px]">Login</p>
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Menu className="text-stone-200" onClick={onOpen} />
        </div>
      </div>
      <HeroDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
