"use client";
import { UserInfo } from "@/types/types";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import cookie from "cookie";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";
const logo = "/logotransparent.png";

export const SimpleNavbar = () => {
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-neutral-950 text-stone-200 sticky top-0 z-50">
      <div className="container mx-auto border-b-1 border-b-stone-800 relative flex justify-between items-center px-4 py-1 md:py-3">
        <Link href={"/"} onClick={closeMenu}>
          {/* for larger screens */}
          <div className="flex items-center justify-center">
            <img
              className="w-[50px] hidden md:block"
              src={logo}
              alt="Ck-Logo"
            />
          </div>
          {/* for smaller screens */}
          <img className="w-[50px] block md:hidden" src={logo} alt="Ck-Logo" />
        </Link>
        <nav className="flex space-x-4">
          <button
            onClick={toggleMenu}
            className="block md:hidden text-stone-200 rounded transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex space-x-4 justify-center items-center">
            <Link
              href="/competitions"
              className="hover:underline hover:underline-offset-2"
            >
              Competitions
            </Link>
            <Link
              href="/rankings"
              className="hover:underline hover:underline-offset-2"
            >
              Rankings
            </Link>
            <Link
              href="/members"
              className="hover:underline hover:underline-offset-2"
            >
              Members
            </Link>
            <Link
              href="/learn"
              className="hover:underline hover:underline-offset-2"
            >
              Learn
            </Link>
            <Link
              href="/contact"
              className="hover:underline hover:underline-offset-2"
            >
              Contact
            </Link>
            {userInfo?.me?.id == 6996 ? (
              <Link
                className="hover:underline hover:underline-offset-2"
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
                className="bg-neutral-800 rounded w-full text-stone-200"
                size="sm"
              >
                <p className="text-[15px] text-red-500">Logout</p>
              </Button>
            ) : (
              <Link href={"/login"}>
                <Button
                  className="bg-neutral-800 px-5 w-full rounded text-stone-200"
                  size="sm"
                >
                  <p className="text-[15px]">Login</p>
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden shadow-neutral-950 shadow-xl transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 px-6 py-6">
          <Link
            href="/competitions"
            className="hover:underline hover:underline-offset-2 transition-colors hover:text-stone-400"
            onClick={closeMenu}
          >
            Competitions
          </Link>
          <Link
            href="/rankings"
            className="hover:underline hover:underline-offset-2 transition-colors hover:text-stone-400"
            onClick={closeMenu}
          >
            Rankings
          </Link>
          <Link
            href="/members"
            className="hover:underline hover:underline-offset-2 transition-colors hover:text-stone-400"
            onClick={closeMenu}
          >
            Members
          </Link>
          <Link
            href="/learn"
            className="hover:underline hover:underline-offset-2 transition-colors hover:text-stone-400"
            onClick={closeMenu}
          >
            Learn
          </Link>
          <Link
            href="/contact"
            className="hover:underline hover:underline-offset-2 transition-colors hover:text-stone-400"
            onClick={closeMenu}
          >
            Contact
          </Link>
          {userInfo?.me?.id == 6996 ? (
            <Link
              className="hover:underline hover:underline-offset-2 transition-colors hover:text-stone-400"
              href={"/requests"}
              onClick={closeMenu}
            >
              Requests
            </Link>
          ) : null}
          {userInfo ? (
            <Button
              onPress={() => {
                handleLogout();
                closeMenu();
              }}
              className="bg-neutral-800 w-full text-stone-200"
              size="sm"
            >
              <p className="text-[15px] text-red-500">Logout</p>
            </Button>
          ) : (
            <Link href={"/login"} onClick={closeMenu}>
              <Button
                className="bg-neutral-800 w-full text-stone-200"
                size="sm"
              >
                <p className="text-[15px]">Login</p>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
