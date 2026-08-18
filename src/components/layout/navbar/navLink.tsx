"use client";

import Link from "next/link";
import { NAVBAR_LINK_CLASS } from "./layout";
import { cn } from "@/lib/utils";

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
      className={cn(NAVBAR_LINK_CLASS, className)}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
