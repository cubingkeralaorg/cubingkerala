"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";

const ApprovePopover = ({
  handleApprove,
  index,
}: {
  handleApprove: (index: number) => void;
  index: number;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="bg-green-400 hover:bg-green-500 text-black rounded-md"
          size="sm"
        >
          Approve
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        Are you sure you want to approve this request?
        <Button
          onClick={() => handleApprove(index)}
          size="sm"
          className="mt-2 bg-green-400 hover:bg-green-500 text-black rounded-md block"
        >
          Approve
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ApprovePopover;
