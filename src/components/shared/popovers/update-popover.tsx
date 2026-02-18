"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const UpdatePopover = ({
  handleUpdate,
  index,
}: {
  handleUpdate: (index: number) => void;
  index: number;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-foreground rounded-sm"
          size="sm"
        >
          Update
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        Are you sure you want to update this member?
        <Button
          onClick={() => handleUpdate(index)}
          size="sm"
          className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-foreground rounded-sm block"
        >
          Update
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default UpdatePopover;
