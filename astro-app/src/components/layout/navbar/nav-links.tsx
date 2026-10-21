import { NAV_LINKS } from "@/config/navigation";
import { NavLink } from "./nav-link";

interface NavLinksProps {
  isAdmin?: boolean;
  onClose?: () => void;
  className?: string;
  currentPath?: string;
}

// isAdmin is always false until Phase 2 wires up real auth — the cookie read
// that decides it lives in Layout.astro, not here, so this component doesn't
// change at all once that happens.
export function NavLinks({ isAdmin = false, onClose, className = "", currentPath = "" }: NavLinksProps) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          onClick={onClose}
          className={className}
          isActive={currentPath === link.href}
        />
      ))}
      {isAdmin && (
        <NavLink
          href="/requests"
          label="Requests"
          onClick={onClose}
          className={className}
          isActive={currentPath === "/requests"}
        />
      )}
    </>
  );
}
