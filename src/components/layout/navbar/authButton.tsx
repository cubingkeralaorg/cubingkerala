"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onClose?: () => void;
  className?: string;
}

export function AuthButton({
  isLoggedIn,
  onLogout,
  onClose,
  className = "",
}: AuthButtonProps) {
  if (isLoggedIn) {
    return (
      <Button
        size="sm"
        className={cn(
          "h-7 border-0 bg-red-700 px-2.5 text-white shadow-none hover:bg-red-800",
          className,
        )}
        onClick={() => {
          onLogout();
          onClose?.();
        }}
      >
        Logout
      </Button>
    );
  }

  return (
    <Button size="sm" className={cn("h-7 px-2.5", className)} asChild>
      <Link href="/login" onClick={onClose}>
        Login
      </Link>
    </Button>
  );
}
