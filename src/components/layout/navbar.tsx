"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { useDesktopNav } from "@/hooks/useDesktopNav";
import { LOGO_LIGHT, LOGO_DARK } from "@/config/navigation.config";
import { NavLinks } from "./navbar/navLinks";
import { AuthButton } from "./navbar/authButton";
import { ThemeSwitcher } from "./navbar/themeSwitcher";
import { MobileMenu } from "./navbar/mobileMenu";
import {
  NAVBAR_CONTAINER_CLASS,
  NAVBAR_LOGO_LINK_CLASS,
  NAVBAR_ROW_CLASS,
} from "./navbar/layout";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

export const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollYRef = useRef(0);
  const isDesktopNav = useDesktopNav();
  const { userInfo, isLoggedIn } = useAuth();
  const { handleLogout } = useLogout();

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);
  const showMobileMenu = isMenuOpen && !isDesktopNav;

  useEffect(() => {
    if (isDesktopNav && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isDesktopNav, isMenuOpen]);

  // Lock body scroll without shifting layout when the mobile menu is open.
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const body = document.body;

    if (showMobileMenu) {
      scrollYRef.current = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
    } else {
      const restoreY = scrollYRef.current;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      if (restoreY > 0) {
        window.scrollTo(0, restoreY);
      }
    }

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const handleGithubRedirect = () => {
    window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank");
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-[10000] text-foreground",
        isMenuOpen
          ? "bg-background"
          : "bg-background/80 backdrop-blur-lg",
      )}
    >
      <div className={NAVBAR_CONTAINER_CLASS}>
        <div className="border-b border-border/40">
          <div className={NAVBAR_ROW_CLASS}>
        {/* Left Side: Logo and Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" onClick={closeMenu} className={NAVBAR_LOGO_LINK_CLASS}>
            <Image
              src={LOGO_LIGHT}
              alt="Cubing Kerala Logo"
              width={44}
              height={44}
              priority
              className="h-[44px] w-[44px] object-contain block dark:hidden"
            />
            <Image
              src={LOGO_DARK}
              alt="Cubing Kerala Logo"
              width={44}
              height={44}
              priority
              className="h-[44px] w-[44px] object-contain hidden dark:block"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            <NavLinks userId={userInfo?.me?.id} />
          </nav>
        </div>

        {/* Right Side: GitHub, Theme Toggle, and Auth Button */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={handleGithubRedirect}
              className="text-foreground/50 hover:text-foreground p-2 rounded-lg transition-colors duration-200"
              aria-label="GitHub repository"
            >
              <FaGithub size={20} />
            </button>
            <ThemeSwitcher />
          </div>

          <div className="hidden lg:block">
            <AuthButton isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          </div>

          <button
            type="button"
            onClick={toggleMenu}
            className={cn(
              "relative flex lg:hidden h-10 w-10 items-center justify-center text-foreground transition-opacity duration-200",
              isMenuOpen && "pointer-events-none opacity-0",
            )}
            aria-label="Open menu"
            aria-expanded={showMobileMenu}
            aria-controls="mobile-menu-panel"
          >
            <span className="sr-only">Open navigation menu</span>
            <div className="relative h-[14px] w-[18px]">
              <span className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-current" />
              <span className="absolute left-0 top-[6px] h-[2px] w-full rounded-full bg-current" />
              <span className="absolute left-0 top-[12px] h-[2px] w-full rounded-full bg-current" />
            </div>
          </button>
        </div>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={showMobileMenu}
        userId={userInfo?.me?.id}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onClose={closeMenu}
      />
    </div>
  );
};
