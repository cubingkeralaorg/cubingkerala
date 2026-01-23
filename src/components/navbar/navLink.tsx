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
      className={`hover:text-green-500 w-fit transition-colors ${className}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
