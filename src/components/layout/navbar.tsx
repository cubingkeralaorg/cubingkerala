"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { useDesktopNav } from "@/hooks/useDesktopNav";
import { NavLinks } from "./navbar/navLinks";
import { AuthButton } from "./navbar/authButton";
import { MobileMenu } from "./navbar/mobileMenu";
import {
  NAVBAR_BRAND_GAP_CLASS,
  NAVBAR_CONTAINER_CLASS,
  NAVBAR_ICON_BUTTON_CLASS,
  NAVBAR_LINKS_GAP_CLASS,
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

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined")
      return;

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

  const wordmark = (
    <Link href="/" onClick={closeMenu} className={NAVBAR_LOGO_LINK_CLASS}>
      Cubing Kerala
    </Link>
  );

  return (
    <div
      className={cn(
        "ck-landing sticky top-0 z-[10000] border-b border-border/60 text-foreground",
        isMenuOpen ? "bg-background" : "bg-background/80 backdrop-blur-lg",
      )}
    >
      <div className={NAVBAR_CONTAINER_CLASS}>
        <div className={NAVBAR_ROW_CLASS}>
          <div className={cn("flex items-center", NAVBAR_BRAND_GAP_CLASS)}>
            {wordmark}
            <nav className={cn("hidden items-center lg:flex", NAVBAR_LINKS_GAP_CLASS)}>
              <NavLinks userId={userInfo?.me?.id} />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn("hidden items-center lg:flex", NAVBAR_LINKS_GAP_CLASS)}>
              <a
                href="https://github.com/cubingkeralaorg/cubingkerala"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className={NAVBAR_ICON_BUTTON_CLASS}
              >
                <FaGithub className="size-4" />
              </a>
              <AuthButton isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            </div>

            <button
              type="button"
              onClick={toggleMenu}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center text-foreground transition-opacity duration-200 lg:hidden",
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
