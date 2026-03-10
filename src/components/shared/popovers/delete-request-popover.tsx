"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const DeleteRequestPopover = ({
  handleRequestDelete,
  index,
}: {
  handleRequestDelete: (index: number) => Promise<void> | void;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    try {
      await handleRequestDelete(index);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={"destructive"} size="sm" className="mr-2">
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-2">
        <p className="text-sm">Are you sure you want to delete this request?</p>
        <Button
          onClick={onClick}
          variant={"destructive"}
          size="sm"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteRequestPopover;
