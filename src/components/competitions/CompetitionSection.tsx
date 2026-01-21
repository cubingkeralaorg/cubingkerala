"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CompetitionCard from "./CompetitionCard";
import { CompetitionSectionProps } from "@/types/competition";

const CompetitionSection: React.FC<CompetitionSectionProps> = ({
  title,
  competitions,
  type,
  emptyMessage,
}) => {
  const titleColor = type === "upcoming" ? "text-green-500" : "text-red-500";

  return (
    <section>
      <h2
        style={{ zIndex: "10000" }}
        className={`text-xl md:text-2xl font-bold ${titleColor} py-3 md:py-5 bg-neutral-950 text-start`}
      >
        {title}
      </h2>

      {competitions && competitions.length > 0 ? (
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex space-x-4 pb-4">
            {competitions.map((competition, index) => (
              <CompetitionCard
                key={`${type}-${competition.id}-${index}`}
                competition={competition}
                type={type}
                index={index}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <Card className="bg-neutral-950 w-full md:w-[380px] h-[150px] border border-neutral-800 rounded-md">
          <CardContent className="p-4 h-fit flex flex-col justify-center">
            <h3 className="text-[17px] font-bold text-stone-200">
              {emptyMessage.title}
            </h3>
            <h1 className="text-md md:text-lg text-neutral-400 font-normal">
              {emptyMessage.subtitle}
            </h1>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default CompetitionSection;
