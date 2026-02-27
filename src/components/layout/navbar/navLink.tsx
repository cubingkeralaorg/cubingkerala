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
      className={`text-[15px] font-medium text-foreground/70 hover:text-foreground hover:bg-accent px-1 md:px-3 py-2 rounded-lg transition-all duration-200 w-fit ${className}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
