"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NAV_LINKS, ADMIN_USER_ID, LOGO_LIGHT, LOGO_DARK } from "@/config/navigation.config";
import { ThemeSwitcher } from "./themeSwitcher";
import {
  NAVBAR_CONTAINER_CLASS,
  NAVBAR_LOGO_LINK_CLASS,
  NAVBAR_ROW_CLASS,
} from "./layout";
import { cn } from "@/lib/utils";

const PANEL_MS = 380;
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
  const router = useRouter();
  const prevPathnameRef = useRef(pathname);
  const [animateIn, setAnimateIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    setAnimateIn(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const routes = [...NAV_LINKS];
    if (userId === ADMIN_USER_ID) {
      routes.push({ href: "/requests", label: "Requests" });
    }
    routes.forEach((link) => router.prefetch(link.href));
    router.prefetch("/login");
  }, [isOpen, router, userId]);

  useEffect(() => {
    if (isOpen && prevPathnameRef.current !== pathname) {
      onClose();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isOpen, onClose]);

  const handleGithubRedirect = useCallback(() => {
    window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank");
  }, []);

  const links = [...NAV_LINKS];
  if (userId === ADMIN_USER_ID) {
    links.push({ href: "/requests", label: "Requests" });
  }

  if (!isOpen || !isMounted) {
    return null;
  }

  const transitionStyle = {
    transitionDuration: `${PANEL_MS}ms`,
    transitionTimingFunction: EASE_OUT,
  };

  return createPortal(
    <div className="fixed inset-0 z-[100010] flex flex-col bg-background">
      <div className={NAVBAR_CONTAINER_CLASS}>
        <div className={cn(NAVBAR_ROW_CLASS, "shrink-0 border-b border-border/40")}>
        <Link
          href="/"
          onClick={() => {
            if (pathname === "/") onClose();
          }}
          aria-label="Cubing Kerala home"
          className={NAVBAR_LOGO_LINK_CLASS}
        >
          <Image
            src={LOGO_LIGHT}
            alt="Cubing Kerala Logo"
            width={44}
            height={44}
            priority
            className="h-[44px] w-[44px] object-contain block dark:hidden"
          />
          <Image
            src={LOGO_DARK}
            alt="Cubing Kerala Logo"
            width={44}
            height={44}
            priority
            className="h-[44px] w-[44px] object-contain hidden dark:block"
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
      </div>

      <nav
        id="mobile-menu-panel"
        aria-label="Mobile menu"
        aria-hidden={!animateIn}
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          "transition-[opacity,transform] will-change-[opacity,transform]",
          animateIn
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
        style={transitionStyle}
      >
        <ul className={cn(NAVBAR_CONTAINER_CLASS, "flex-1 list-none overflow-y-auto")}>
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <li key={link.href} className="border-b border-border/40 last:border-b-0">
                <Link
                  href={link.href}
                  onClick={() => {
                    if (isActive) onClose();
                  }}
                  tabIndex={animateIn ? 0 : -1}
                  className={cn(
                    "flex min-h-[56px] items-center justify-between gap-2 py-3 text-[17px] font-medium tracking-[-0.01em] transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/90 hover:text-foreground",
                  )}
                >
                  <span className="flex min-h-10 flex-1 items-center">
                    {link.label}
                  </span>
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center text-foreground/60"
                  >
                    <ArrowRight
                      className="h-[18px] w-[18px]"
                      strokeWidth={2.25}
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={cn(NAVBAR_CONTAINER_CLASS, "border-t border-border/50 py-4")}>
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
              onClick={() => {
                if (pathname === "/login") onClose();
              }}
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
