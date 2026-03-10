"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ApprovePopover = ({
  handleApprove,
  index,
}: {
  handleApprove: (index: number) => Promise<void> | void;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    try {
      await handleApprove(index);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm">
          Approve
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-2">
        <p className="text-sm">Are you sure you want to approve this request?</p>
        <Button
          onClick={onClick}
          size="sm"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ApprovePopover;
