"use client";

import React from "react";
import { Loader } from "lucide-react";

interface RefreshButtonProps {
  isRefreshing: boolean;
  onClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  isRefreshing,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 bg-card border border-border min-w-[80px] h-[30px] flex items-center justify-center gap-1.5 text-sm md:text-[15px] text-foreground rounded-md transition-colors ${
        !isRefreshing ? "hover:bg-accent hover:text-foreground cursor-pointer" : "opacity-50 cursor-not-allowed"
      }`}
      disabled={isRefreshing}
    >
      <span>{isRefreshing ? <Loader size={13} className="animate-spin" /> : "Refresh"}</span>
    </button>
  );
};

export default RefreshButton;
