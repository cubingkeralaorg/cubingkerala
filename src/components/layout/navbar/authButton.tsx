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
        className={`bg-neutral-800 rounded w-full text-stone-200 ${className}`}
        size="sm"
      >
        <p className="text-[15px] text-red-500">Logout</p>
      </Button>
    );
  }

  return (
    <Link href="/login" onClick={onClose}>
      <Button
        className={`bg-neutral-800 px-5 w-full rounded text-green-500 ${className}`}
        size="sm"
      >
        <p className="text-[15px]">Login</p>
      </Button>
    </Link>
  );
}
