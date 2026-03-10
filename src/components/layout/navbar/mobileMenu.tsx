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
        className={`fixed inset-0 z-[9998] bg-background/60 backdrop-blur-md md:hidden transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu panel */}
      <nav
        id="mobile-menu-panel"
        aria-label="Mobile menu"
        className={`fixed inset-0 z-[9999] flex flex-col pt-[64px] md:hidden overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <div className="mx-3 mt-2 mb-3 flex-1 rounded-2xl border border-border/70 bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-full flex-col gap-4 px-5 pt-4">
          <div className={`flex flex-col gap-1 transition-all duration-500 delay-75 ease-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <NavLinks
              userId={userId}
              onClose={onClose}
              className="w-full rounded-xl px-2 py-2 text-base"
            />
          </div>

          <div className={`flex items-center gap-3 pt-2 transition-all duration-500 delay-100 ease-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <button
              onClick={() => window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank")}
              className="text-foreground/80 hover:text-foreground hover:bg-accent p-2 rounded-xl border border-border/70 transition-all"
              aria-label="GitHub repository"
            >
              <FaGithub size={22} />
            </button>
            <ThemeSwitcher />
          </div>

          <div className={`mt-auto pt-3 pb-6 border-t border-border transition-all duration-500 delay-150 ease-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <AuthButton
              isLoggedIn={isLoggedIn}
              onLogout={onLogout}
              onClose={onClose}
            />
          </div>
        </div>
        </div>

        <div className={`mt-auto mb-3 px-3 transition-all duration-500 delay-200 ease-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <CubingKeralaFooter compact />
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
