"use client";

import React, { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import "@cubing/icons";

interface Filter {
  event: string;
  round: string;
}

interface FilterComponentProps {
  onFilterChange: (filter: Filter) => void;
}

export function FilterComponent({ onFilterChange }: FilterComponentProps) {
  const [selectedFilter, setSelectedFilter] = useState<Filter>({ event: "333", round: "single" });

  const handleEventSelect = (event: string) => {
    const newFilter = { ...selectedFilter, event };
    setSelectedFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleRoundSelect = (round: string) => {
    const newFilter = { ...selectedFilter, round };
    setSelectedFilter(newFilter);
    onFilterChange(newFilter);
  };


  return (
    <div className="flex items-center justify-center gap-3">
      <Menubar className="rounded-md bg-neutral-900 border-none text-sm md:text-[15px]">
        <MenubarMenu>
          <MenubarTrigger className="hover:bg-neutral-800 hover:text-neutral-100 cursor-pointer">
            {selectedFilter.event || "Select Event"}
          </MenubarTrigger>
          <MenubarContent className="max-h-60 w-[220px] overflow-y-auto bg-neutral-900 text-stone-200 border-none rounded-none">
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("222")}>
              2x2x2
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-222`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("333")}>
              3x3x3
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-333`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("444")}>
              4x4x4
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-444`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("555")}>
              5x5x5
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-555`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("666")}>
              6x6x6
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-666`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("777")}>
              7x7x7
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-777`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("333bf")}>
              3x3x3 Blindfolded
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-333bf`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("333fm")}>
              3x3x3 Fewest Moves
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-333fm`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("333oh")}>
              3x3x3 One-Handed
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-333oh`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("skewb")}>
              Skewb
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-skewb`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("pyram")}>
              Pyraminx
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-pyram`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("minx")}>
              Megaminx
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-minx`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("clock")}>
              Clock
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-clock`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("sq1")}>
              Square-1
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-sq1`}></span>
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleEventSelect("333mbf")}>
              3x3x3 Multi-Blind
              <MenubarShortcut className="text-stone-200">
                <span className={`cubing-icon event-333mbf`}></span>
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <span>|</span>
        <MenubarMenu>
          <MenubarTrigger className="hover:bg-neutral-800 hover:text-neutral-100 cursor-pointer">{selectedFilter.round || "Select Round"}</MenubarTrigger>
          <MenubarContent className="max-h-60 overflow-y-auto bg-neutral-900 text-stone-200 border-none rounded-none">
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleRoundSelect("single")}>
              Single
            </MenubarItem>
            <MenubarItem className="hover:bg-neutral-800 cursor-pointer" onClick={() => handleRoundSelect("average")}>
              Average
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
