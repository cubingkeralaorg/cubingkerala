"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AuthButton } from "./authButton";
import { NavLinks } from "./navLinks";
import { ThemeSwitcher } from "./themeSwitcher";
import { FaGithub } from "react-icons/fa";
import CubingKeralaFooter from "../footer";

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
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const menuContent = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-background/50 backdrop-blur-sm md:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu panel */}
      <nav
        aria-label="Mobile menu"
        className={`fixed inset-0 z-[9999] bg-background flex flex-col pt-[58px] md:hidden overflow-y-auto transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex-1 flex flex-col gap-4 px-6 pt-4 pb-10">
          <div className="flex flex-col gap-1">
            <NavLinks
              userId={userId}
              onClose={onClose}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank")}
              className="text-foreground/70 hover:text-foreground hover:bg-accent p-2 rounded-lg transition-all"
              aria-label="GitHub repository"
            >
              <FaGithub size={22} />
            </button>
            <ThemeSwitcher />
          </div>

          <div className="pt-3 border-t border-border">
            <AuthButton
              isLoggedIn={isLoggedIn}
              onLogout={onLogout}
              onClose={onClose}
            />
          </div>
        </div>

        <div className="mt-auto">
          <CubingKeralaFooter />
        </div>
      </nav>
    </>
  );

  // Portal to document.body to escape the navbar's stacking context
  if (portalRoot) {
    return createPortal(menuContent, portalRoot);
  }

  // SSR fallback
  return menuContent;
}
