import { NAVBAR_LINK_CLASS } from "./layout";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

export function NavLink({ href, label, onClick, className = "", isActive = false }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(NAVBAR_LINK_CLASS, isActive && "text-primary", className)}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </a>
  );
}
