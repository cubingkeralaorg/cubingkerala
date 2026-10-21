import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { NAV_LINKS } from "@/config/navigation";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { BuiltByLink } from "../footer";
import { NAVBAR_CONTAINER_CLASS } from "./layout";
import { cn } from "@/lib/utils";

/** Keep in sync with the navbar row's `h-16` — the sheet drops in below the navbar. */
const NAVBAR_HEIGHT_CLASS = "top-16";

/**
 * tailwindcss-animate (now tw-animate-css) scopes animate-in/out's default
 * animation-duration to the `data-[state=...]` attribute selector, which
 * out-specifies a bare `duration-*` utility. Match that scoping here so our
 * slower duration actually wins.
 */
const SHEET_ANIMATION_DURATION_CLASS =
  "data-[state=open]:duration-150 data-[state=closed]:duration-150";

const LINK_CLASS =
  "py-5 text-left text-2xl font-medium tracking-tight text-foreground transition-colors hover:text-primary";

interface MobileMenuProps {
  isOpen: boolean;
  isAdmin?: boolean;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onClose: () => void;
  currentPath?: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

// Hairline-divided list, same plain style for every row — Login/Logout are
// just another link here, not a separate highlighted bottom section.
export function MobileMenu({
  isOpen,
  isAdmin = false,
  isLoggedIn,
  onLogin,
  onLogout,
  onClose,
  currentPath = "",
  theme,
  onToggleTheme,
}: MobileMenuProps) {
  const links = isAdmin ? [...NAV_LINKS, { href: "/requests", label: "Requests" }] : NAV_LINKS;

  // modal={false} on the Sheet below skips Radix's built-in body-scroll lock
  // (deliberately, so the overlay doesn't trap focus/clicks away from the
  // navbar) — lock it here instead so the page underneath can't scroll
  // while the menu is open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent
        side="none"
        hideCloseButton
        onOpenAutoFocus={(event) => event.preventDefault()}
        overlayClassName={cn(NAVBAR_HEIGHT_CLASS, SHEET_ANIMATION_DURATION_CLASS)}
        className={cn(
          "flex flex-col gap-0 overflow-hidden bg-background p-0 shadow-lg",
          NAVBAR_HEIGHT_CLASS,
          "bottom-0 left-0 w-full max-w-none",
        )}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>

        <nav
          id="mobile-menu-panel"
          aria-label="Mobile menu"
          className={cn(
            NAVBAR_CONTAINER_CLASS,
            "flex flex-1 flex-col divide-y divide-border pt-4",
          )}
        >
          {links.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(LINK_CLASS, isActive && "text-primary")}
              >
                {link.label}
              </a>
            );
          })}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className={cn(LINK_CLASS, "text-destructive")}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onLogin();
                onClose();
              }}
              className={cn(LINK_CLASS, "text-primary underline underline-offset-4")}
            >
              Login
            </button>
          )}
        </nav>

        <div
          className={cn(
            NAVBAR_CONTAINER_CLASS,
            "flex shrink-0 items-center justify-between gap-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
          )}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Cubing Kerala</p>
          </div>
          <BuiltByLink />
        </div>
      </SheetContent>
    </Sheet>
  );
}
