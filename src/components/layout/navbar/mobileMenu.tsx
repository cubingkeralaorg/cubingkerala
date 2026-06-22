"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NAV_LINKS, ADMIN_USER_ID, LOGO_LIGHT, LOGO_DARK } from "@/config/navigation.config";
import { ThemeSwitcher } from "./themeSwitcher";
import { cn } from "@/lib/utils";

const PANEL_MS = 320;
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const AUTH_BUTTON_CLASS =
  "flex w-full h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-[15px] font-medium transition-all duration-200 hover:bg-secondary hover:border-foreground/20 active:scale-[0.98]";

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
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAnimateIn(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(frame);
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

  if (!isOpen) {
    return null;
  }

  const transitionStyle = {
    transitionDuration: `${PANEL_MS}ms`,
    transitionTimingFunction: EASE_OUT,
  };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100010] md:hidden bg-background",
        "transition-[opacity,transform] will-change-[opacity,transform]",
        animateIn
          ? "translate-y-0 opacity-100 visible"
          : "pointer-events-none invisible -translate-y-2 opacity-0",
      )}
      style={transitionStyle}
    >
      <nav
        id="mobile-menu-panel"
        aria-label="Mobile menu"
        aria-hidden={!animateIn}
        className="flex h-full min-h-[100dvh] flex-col"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <Link href="/" onClick={onClose} className="flex items-center">
            <Image
              src={LOGO_LIGHT}
              alt="Cubing Kerala Logo"
              width={44}
              height={44}
              className="h-11 w-11 object-contain block dark:hidden"
            />
            <Image
              src={LOGO_DARK}
              alt="Cubing Kerala Logo"
              width={44}
              height={44}
              className="h-11 w-11 object-contain hidden dark:block"
            />
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleGithubRedirect}
              tabIndex={animateIn ? 0 : -1}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:text-foreground"
              aria-label="GitHub repository"
            >
              <FaGithub size={20} />
            </button>
            <ThemeSwitcher />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-foreground transition-colors hover:bg-accent/80"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <ul className="container mx-auto flex-1 list-none overflow-y-auto px-4">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  tabIndex={animateIn ? 0 : -1}
                  className={cn(
                    "block py-5 text-[17px] font-medium tracking-[-0.01em] transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/90 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
                <div
                  aria-hidden
                  className="border-b border-dashed border-border"
                />
              </li>
            );
          })}
        </ul>

        <div className="container mx-auto border-t border-border/50 px-4 py-4">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              tabIndex={animateIn ? 0 : -1}
              className={cn(AUTH_BUTTON_CLASS, "text-red-500 hover:text-red-500/80")}
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              tabIndex={animateIn ? 0 : -1}
              className={cn(
                AUTH_BUTTON_CLASS,
                "text-green-600 dark:text-green-400",
              )}
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>,
    document.body,
  );
}
