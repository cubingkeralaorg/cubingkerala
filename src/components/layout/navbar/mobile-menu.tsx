"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { NAV_LINKS } from "@/config/navigation.config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "./theme-switcher";
import { NAVBAR_CONTAINER_CLASS, NAVBAR_ICON_BUTTON_CLASS } from "./layout";
import { cn } from "@/lib/utils";

/** Keep in sync with NAVBAR_ROW_CLASS's `h-16` — the sheet drops in below the navbar. */
const NAVBAR_HEIGHT_CLASS = "top-16";

/**
 * tailwindcss-animate scopes animate-in/out's default animation-duration to the
 * `data-[state=...]` attribute selector, which out-specifies a bare `duration-*`
 * utility. Match that scoping here so our slower duration actually wins.
 */
const SHEET_ANIMATION_DURATION_CLASS =
  "data-[state=open]:duration-300 data-[state=closed]:duration-300";

interface MobileMenuProps {
  isOpen: boolean;
  isAdmin?: boolean;
  isLoggedIn: boolean;
  onLogout: () => void;
  onClose: () => void;
}

const GITHUB_HREF = "https://github.com/cubingkeralaorg/cubingkerala";

const MENU_LINK_CLASS =
  "flex items-center border-b border-border py-4 text-[15px] font-medium text-foreground transition-colors hover:text-muted-foreground";

export function MobileMenu({
  isOpen,
  isAdmin = false,
  isLoggedIn,
  onLogout,
  onClose,
}: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const links = useMemo(() => {
    const items = [...NAV_LINKS];
    if (isAdmin) {
      items.push({ href: "/requests", label: "Requests" });
    }
    return items;
  }, [isAdmin]);

  useEffect(() => {
    if (!isOpen) return;
    links.forEach((link) => router.prefetch(link.href));
    router.prefetch("/login");
  }, [isOpen, router, links]);

  useEffect(() => {
    onClose();
    // Close after client-side navigation; onClose is a setState wrapper.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent
        side="right"
        hideCloseButton
        onOpenAutoFocus={(event) => event.preventDefault()}
        overlayClassName={cn(NAVBAR_HEIGHT_CLASS, SHEET_ANIMATION_DURATION_CLASS)}
        className={cn(
          "ck-landing flex flex-col gap-0 overflow-hidden border-l-0 p-0 shadow-lg",
          SHEET_ANIMATION_DURATION_CLASS,
          NAVBAR_HEIGHT_CLASS,
          "bottom-0 left-0 w-full max-w-none sm:max-w-none",
        )}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Site navigation
        </SheetDescription>

        <nav
          id="mobile-menu-panel"
          aria-label="Mobile menu"
          className={cn(
            NAVBAR_CONTAINER_CLASS,
            "flex min-h-0 flex-1 flex-col overflow-y-auto pt-2",
          )}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={MENU_LINK_CLASS}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div
          className={cn(
            NAVBAR_CONTAINER_CLASS,
            "flex flex-col gap-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
          )}
        >
          <div className="flex items-center justify-end gap-1">
            <a
              href={GITHUB_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className={NAVBAR_ICON_BUTTON_CLASS}
            >
              <FaGithub className="size-4" />
            </a>
            <ThemeSwitcher />
          </div>
          {isLoggedIn ? (
            <Button
              type="button"
              variant="destructive"
              className="h-11 w-full rounded-md text-sm font-medium shadow-none"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              className="h-11 w-full rounded-md text-sm font-medium shadow-none"
              asChild
            >
              <Link href="/login" onClick={onClose}>
                Login
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
