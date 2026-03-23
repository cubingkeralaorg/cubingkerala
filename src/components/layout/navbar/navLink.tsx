"use client";

import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function NavLink({
  href,
  label,
  onClick,
  className = "",
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-[15px] text-foreground/60 hover:text-foreground px-3 py-2 rounded-md transition-colors duration-200 ${className}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
