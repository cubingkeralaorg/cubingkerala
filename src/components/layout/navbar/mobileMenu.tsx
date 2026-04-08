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
        className={`fixed inset-0 z-[9998] bg-background/60 backdrop-blur-md md:hidden transition-opacity duration-400 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu panel — slides down from navbar */}
      <nav
        id="mobile-menu-panel"
        aria-label="Mobile menu"
        className={`fixed inset-x-0 top-0 bottom-0 z-[9999] flex flex-col pt-[60px] md:hidden overflow-y-auto transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="mx-3 mt-2 flex-1 rounded-2xl border border-border/50 bg-background/95 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
          <div className="flex h-full flex-col gap-2 px-4 py-4">
            {/* Navigation links */}
            <div
              className={`flex flex-col gap-0.5 transition-all duration-400 delay-50 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <NavLinks
                userId={userId}
                onClose={onClose}
                className="w-full rounded-xl px-3 py-2.5 text-[15px]"
              />
            </div>

            {/* Utility row: GitHub + Theme */}
            <div
              className={`flex items-center gap-2 px-1 transition-all duration-400 delay-100 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <button
                onClick={() =>
                  window.open(
                    "https://github.com/cubingkeralaorg/cubingkerala",
                    "_blank"
                  )
                }
                className="text-foreground/50 hover:text-foreground p-2 rounded-lg transition-colors"
                aria-label="GitHub repository"
              >
                <FaGithub size={20} />
              </button>
              <ThemeSwitcher />
            </div>

            {/* Auth button */}
            <div
              className={`transition-all duration-400 delay-150 py-2.5 ease-out ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <AuthButton
                isLoggedIn={isLoggedIn}
                onLogout={onLogout}
                onClose={onClose}
              />
            </div>
          </div>
        </div>

        {/* Compact footer pinned at screen bottom */}
        <div
          className={`mt-2 mb-3 px-3 transition-all duration-400 delay-200 ease-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
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
