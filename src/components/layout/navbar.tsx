"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
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
    <div className="bg-background/80 backdrop-blur-md text-foreground relative z-[10000]">
      <div className="container mx-auto border-b border-border relative flex justify-between items-center px-4 py-1 md:py-3">
        {/* Left Side: Logo and Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <Image
              src={LOGO_LIGHT}
              alt="Cubing Kerala Logo"
              width={50}
              height={50}
              priority
              className="w-[50px] h-auto object-contain block dark:hidden"
            />
            <Image
              src={LOGO_DARK}
              alt="Cubing Kerala Logo"
              width={50}
              height={50}
              priority
              className="w-[50px] h-auto object-contain hidden dark:block"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            <NavLinks userId={userInfo?.me?.id} />
          </div>
        </div>

        {/* Right Side: GitHub, Theme Toggle, and Auth Button */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={handleGithubRedirect}
              className="text-foreground/70 hover:text-foreground hover:bg-accent transition-all duration-200 p-2 rounded-lg"
              aria-label="GitHub repository"
            >
              <FaGithub size={22} />
            </button>
            <ThemeSwitcher />
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:block">
              <AuthButton isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            </div>
            
            <button
              onClick={toggleMenu}
              className="group relative block md:hidden h-11 w-11 rounded-xl border border-border/80 bg-background/90 backdrop-blur-sm text-foreground transition-all duration-300 hover:bg-accent/50 hover:border-border"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-panel"
            >
              <span className="sr-only">Toggle navigation menu</span>
              <Menu
                size={22}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                  isMenuOpen ? "opacity-0 scale-75 rotate-45" : "opacity-100 scale-100 rotate-0"
                }`}
              />
              <X
                size={22}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                  isMenuOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-45"
                }`}
              />
            </button>
          </div>
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
