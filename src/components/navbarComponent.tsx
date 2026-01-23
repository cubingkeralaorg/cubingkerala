"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { LOGO_PATH } from "@/constants/navigation";
import { NavLinks } from "./navbar/navLinks";
import { AuthButton } from "./navbar/authButton";
import { MobileMenu } from "./navbar/mobileMenu";

export const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userInfo, isLoggedIn } = useAuth();
  const { handleLogout } = useLogout();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="bg-neutral-950 text-stone-200 sticky top-0 z-50">
      <div className="container mx-auto border-b-1 border-b-stone-800 relative flex justify-between items-center px-4 py-1 md:py-3">
        <Link href="/" onClick={closeMenu}>
          <div className="flex items-center justify-center">
            <img
              className="w-[50px] hidden md:block"
              src={LOGO_PATH}
              alt="Cubing Kerala Logo"
            />
          </div>
          <img
            className="w-[50px] block md:hidden"
            src={LOGO_PATH}
            alt="Cubing Kerala Logo"
          />
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
            <NavLinks userId={userInfo?.me?.id} />
            <AuthButton isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          </div>
        </nav>
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
