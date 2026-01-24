"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

const DeleteMemberPopover = ({
  handleMemberDelete,
  index,
}: {
  handleMemberDelete: (index: number) => void;
  index: number;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"destructive"} size="sm" className="mr-2 rounded-sm">
          Delete
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        Are you sure you want to delete this member?
        <Button
          onClick={() => handleMemberDelete(index)}
          variant={"destructive"}
          size="sm"
          className="mt-2 rounded-sm block"
        >
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteMemberPopover;
