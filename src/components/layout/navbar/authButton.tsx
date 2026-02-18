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
        className={`bg-secondary hover:bg-secondary/80 rounded-lg w-full text-foreground ${className}`}
        size="sm"
      >
        <p className="text-[15px] text-red-500 font-medium">Logout</p>
      </Button>
    );
  }

  return (
    <Link href="/login" onClick={onClose} className="w-full">
      <Button
        className={`bg-secondary hover:bg-secondary/80 px-5 w-full rounded-lg text-green-500 font-medium ${className}`}
        size="sm"
      >
        <p className="text-[15px]">Login</p>
      </Button>
    </Link>
  );
}
