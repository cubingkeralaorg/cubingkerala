"use client";

import { NAV_LINKS, ADMIN_USER_ID } from "@/constants/navigation";
import { NavLink } from "./navLink";

interface NavLinksProps {
  userId?: number;
  onClose?: () => void;
  className?: string;
}

export function NavLinks({ userId, onClose, className = "" }: NavLinksProps) {
  const isAdmin = userId === ADMIN_USER_ID;

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
