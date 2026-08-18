"use client";

import { NAV_LINKS } from "@/config/navigation.config";
import { NavLink } from "./nav-link";

interface NavLinksProps {
  isAdmin?: boolean;
  onClose?: () => void;
  className?: string;
}

export function NavLinks({
  isAdmin = false,
  onClose,
  className = "",
}: NavLinksProps) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          onClick={onClose}
          className={className}
        />
      ))}
      {isAdmin && (
        <NavLink
          href="/requests"
          label="Requests"
          onClick={onClose}
          className={className}
        />
      )}
    </>
  );
}
