"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcher } from "./themeSwitcher";
import { FaGithub } from "react-icons/fa";
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
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const isAdmin = userId === ADMIN_USER_ID;

  const links = [...NAV_LINKS];
  if (isAdmin) {
    links.push({ href: "/requests", label: "Requests" });
  }

  const menuContent = (
    <nav
      id="mobile-menu-panel"
      aria-label="Mobile menu"
      className={`fixed inset-0 z-[100000] flex flex-col bg-background/95 backdrop-blur-3xl md:hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Top Header with Logo and Close Button */}
      <div className="container mx-auto flex items-center justify-between px-4 py-4 h-[72px]">
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
          className="p-1.5 rounded-full text-foreground hover:bg-accent transition-colors"
          aria-label="Close"
        >
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Links Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="container mx-auto px-4 flex flex-col">
          <div>
            <div className="w-full h-[1px] bg-border/40" />
          </div>
          
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
            <div className="w-full h-[1px] bg-border/40 mb-4" />
            <div className="flex items-center gap-2 px-1 mb-4">
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
            
            <CubingKeralaFooter compact />
        </div>
      </div>
    </nav>
  );

  if (portalRoot) {
    return createPortal(menuContent, portalRoot);
  }

  return menuContent;
}
