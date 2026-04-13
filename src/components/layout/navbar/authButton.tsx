"use client";

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
      <button
        onClick={() => {
          onLogout();
          onClose?.();
        }}
        className={`text-[15px] font-[500] tracking-wide text-red-500 hover:text-red-500/70 px-3 py-2 transition-colors duration-200 ${className}`}
      >
        Logout
      </button>
    );
  }

  return (
    <Link 
      href="/login" 
      onClick={onClose}
      className={`text-[15px] font-[500] tracking-wide text-green-500 hover:text-green-500/70 px-3 py-2 transition-colors duration-200 ${className}`}
    >
      Login
    </Link>
  );
}
