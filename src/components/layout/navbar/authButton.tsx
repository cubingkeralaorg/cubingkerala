"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

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
        onPress={() => {
          onLogout();
          onClose?.();
        }}
        variant="bordered"
        className={`rounded-lg border-border/70 bg-transparent hover:bg-accent/50 w-full text-foreground transition-colors ${className}`}
        size="sm"
      >
        <p className="text-[14px] text-red-500 font-medium">Logout</p>
      </Button>
    );
  }

  return (
    <Link href="/login" onClick={onClose} className="w-full">
      <Button
        variant="bordered"
        className={`rounded-lg border-border/70 bg-transparent hover:bg-accent/50 px-5 w-full text-foreground transition-colors ${className}`}
        size="sm"
      >
        <p className="text-[14px] text-green-500 font-medium">Login</p>
      </Button>
    </Link>
  );
}
