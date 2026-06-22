"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, ADMIN_USER_ID, LOGO_LIGHT, LOGO_DARK } from "@/config/navigation.config";
import { X } from "lucide-react";
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
  const isAdmin = userId === ADMIN_USER_ID;

  const links = [...NAV_LINKS];
  if (isAdmin) {
    links.push({ href: "/requests", label: "Requests" });
  }

  const menuContent = (
    <nav
      id="mobile-menu-panel"
      aria-label="Mobile menu"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[100000] flex flex-col bg-background/95 backdrop-blur-3xl md:hidden transition-transform duration-200 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Top Header — match navbar row height (py-2, h-10 controls) */}
      <div className="container mx-auto flex items-center justify-between border-b border-border/40 px-4 py-2">
        <Link href="/" onClick={onClose} className="flex items-center">
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
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent transition-colors"
          aria-label="Close"
        >
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Links Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="container mx-auto px-4 flex flex-col">
          {links.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block py-4 text-[26px] font-normal tracking-wide text-muted-foreground border-b border-border/40 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </div>
          ))}

          {/* Auth Button */}
          <div className="mt-2 mb-4">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full text-left block py-4 text-[26px] font-normal tracking-wide text-red-500 border-b border-border/40 hover:text-red-500/70 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="block py-4 text-[26px] font-normal tracking-wide text-green-500 border-b border-border/40 hover:text-green-500/70 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="w-full mt-auto">
        <div className="container mx-auto px-4">
          <CubingKeralaFooter compact />
        </div>
      </div>
    </nav>
  );

  return createPortal(menuContent, document.body);
}
