"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { LOGO_LIGHT, LOGO_DARK } from "@/config/navigation.config";
import { NavLinks } from "./navbar/navLinks";
import { AuthButton } from "./navbar/authButton";
import { MobileMenu } from "./navbar/mobileMenu";
import { ThemeSwitcher } from "./navbar/themeSwitcher";
import { FaGithub } from "react-icons/fa";

export const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollYRef = useRef(0);
  const { userInfo, isLoggedIn } = useAuth();
  const { handleLogout } = useLogout();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Lock body scroll without shifting layout when the mobile menu is open.
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const body = document.body;

    if (isMenuOpen) {
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
  }, [isMenuOpen]);

  const handleGithubRedirect = () => {
    window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank");
  };

  return (
    <div className="sticky top-0 bg-background/80 backdrop-blur-lg text-foreground z-[10000]">
      <div className="container mx-auto border-b border-border/40 flex justify-between items-center px-4 py-2 md:py-2.5">
        {/* Left Side: Logo and Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <Image
              src={LOGO_LIGHT}
              alt="Cubing Kerala Logo"
              width={44}
              height={44}
              priority
              className="w-[44px] h-auto object-contain block dark:hidden"
            />
            <Image
              src={LOGO_DARK}
              alt="Cubing Kerala Logo"
              width={44}
              height={44}
              priority
              className="w-[44px] h-auto object-contain hidden dark:block"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavLinks userId={userInfo?.me?.id} />
          </nav>
        </div>

        {/* Right Side: GitHub, Theme Toggle, and Auth Button */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={handleGithubRedirect}
              className="text-foreground/50 hover:text-foreground p-2 rounded-lg transition-colors duration-200"
              aria-label="GitHub repository"
            >
              <FaGithub size={20} />
            </button>
            <ThemeSwitcher />
          </div>

          <div className="hidden md:block">
            <AuthButton isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          </div>

          {/* Animated two-bar hamburger — no hover bg */}
          <button
            onClick={toggleMenu}
            className="relative flex md:hidden h-10 w-10 items-center justify-center text-foreground"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-panel"
          >
            <span className="sr-only">Toggle navigation menu</span>
            <div className="relative w-[18px] h-[10px]">
              <span
                className={`absolute left-0 h-[2px] w-full rounded-full bg-current transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen
                    ? "top-[4px] rotate-45"
                    : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-[2px] w-full rounded-full bg-current transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen
                    ? "top-[4px] -rotate-45"
                    : "top-[8px]"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        userId={userInfo?.me?.id}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onClose={closeMenu}
      />
    </div>
  );
};
