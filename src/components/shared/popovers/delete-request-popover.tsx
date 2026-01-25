"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const DeleteRequestPopover = ({
  handleRequestDelete,
  index,
}: {
  handleRequestDelete: (index: number) => void;
  index: number;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"destructive"} size="sm" className="mr-2 rounded-md">
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        Are you sure you want to delete this member?
        <Button
          onClick={() => handleRequestDelete(index)}
          variant={"destructive"}
          size="sm"
          className="mt-2 rounded-md block"
        >
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteRequestPopover;
