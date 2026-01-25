"use client";

import { AuthButton } from "./authButton";
import { NavLinks } from "./navLinks";


interface MobileMenuProps {
  isOpen: boolean;
  userId?: number;
  isLoggedIn: boolean;
  onLogout: () => void;
  onClose: () => void;
}

export function MobileMenu({
  isOpen,
  userId,
  isLoggedIn,
  onLogout,
  onClose,
}: MobileMenuProps) {
  return (
    <div
      className={`md:hidden overflow-hidden shadow-neutral-950 shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex flex-col space-y-4 px-6 py-6">
        <NavLinks
          userId={userId}
          onClose={onClose}
        />
        <AuthButton
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
