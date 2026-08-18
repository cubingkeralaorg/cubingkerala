"use client";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RefreshButtonProps {
  isRefreshing: boolean;
  onClick: () => void;
}

export default function RefreshButton({
  isRefreshing,
  onClick,
}: RefreshButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isRefreshing}
    >
      {isRefreshing ? <Loader className="animate-spin" /> : "Refresh"}
    </Button>
  );
}
