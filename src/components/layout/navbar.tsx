"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  const { userInfo, isLoggedIn } = useAuth();
  const { handleLogout } = useLogout();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleGithubRedirect = () => {
    window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank");
  };

  return (
    <div className={`bg-background/80 backdrop-blur-md text-foreground sticky top-0 ${isMenuOpen ? 'z-[10000]' : 'z-50'}`}>
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
              className="block md:hidden text-foreground p-2 rounded-lg transition-colors z-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
