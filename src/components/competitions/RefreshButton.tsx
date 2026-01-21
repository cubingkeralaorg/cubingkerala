"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

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
      className={`px-3 py-2 bg-neutral-800 ${
        !isRefreshing ? "hover:bg-neutral-900" : ""
      } text-stone-200 rounded flex items-center gap-1.5 text-xs transition-colors`}
      disabled={isRefreshing}
    >
      <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
      <span>{isRefreshing ? "Loading..." : "Refresh"}</span>
    </button>
  );
};

export default RefreshButton;
