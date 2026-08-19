"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { NAV_LINKS } from "@/config/navigation.config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "./theme-switcher";
import { NAVBAR_ICON_BUTTON_CLASS, NAVBAR_LOGO_LINK_CLASS } from "./layout";
import { cn } from "@/lib/utils";

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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="inset"
        hideCloseButton
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="ck-landing flex flex-col gap-0 overflow-hidden"
      >
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-5 py-4 text-left">
          <SheetTitle asChild>
            <Link
              href="/"
              onClick={onClose}
              className={cn(NAVBAR_LOGO_LINK_CLASS, "text-base")}
            >
              Cubing Kerala
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
          <SheetClose className="rounded-md p-1 text-foreground outline-none transition-opacity hover:opacity-70">
            <X className="h-5 w-5" strokeWidth={1.75} />
            <span className="sr-only">Close menu</span>
          </SheetClose>
        </SheetHeader>

        <nav
          id="mobile-menu-panel"
          aria-label="Mobile menu"
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5"
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

        <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
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
