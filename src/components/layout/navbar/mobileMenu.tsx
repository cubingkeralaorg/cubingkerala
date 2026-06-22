"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { NAV_LINKS, ADMIN_USER_ID } from "@/config/navigation.config";
import { ThemeSwitcher } from "./themeSwitcher";
import { AuthButton } from "./authButton";
import { cn } from "@/lib/utils";

/** Matches mobile navbar row: py-2 (16px) + 44px logo */
const NAVBAR_OFFSET_PX = 60;
const PANEL_MS = 150;

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
  const pathname = usePathname();
  const [mounted, setMounted] = useState(isOpen);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }

    setActive(false);
    const timer = window.setTimeout(() => setMounted(false), PANEL_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleGithubRedirect = useCallback(() => {
    window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank");
  }, []);

  const links = [...NAV_LINKS];
  if (userId === ADMIN_USER_ID) {
    links.push({ href: "/requests", label: "Requests" });
  }

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={active ? 0 : -1}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[99990] md:hidden bg-black/20 transition-opacity duration-150",
          active ? "opacity-100" : "opacity-0",
        )}
      />

      <nav
        id="mobile-menu-panel"
        aria-label="Mobile menu"
        aria-hidden={!active}
        style={{ top: NAVBAR_OFFSET_PX }}
        className={cn(
          "fixed left-0 right-0 z-[99999] md:hidden border-b border-border bg-background/98 backdrop-blur-sm shadow-sm",
          "transition-[opacity,transform] duration-150 ease-out",
          active
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0 pointer-events-none",
        )}
      >
        <ul className="container mx-auto flex flex-col px-2 py-1.5">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="container mx-auto flex items-center justify-between border-t border-border/50 px-3 py-2">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleGithubRedirect}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/50 hover:text-foreground transition-colors"
              aria-label="GitHub repository"
            >
              <FaGithub size={18} />
            </button>
            <ThemeSwitcher />
          </div>

          <AuthButton
            isLoggedIn={isLoggedIn}
            onLogout={onLogout}
            onClose={onClose}
            className="px-2 py-1"
          />
        </div>
      </nav>
    </>,
    document.body,
  );
}
