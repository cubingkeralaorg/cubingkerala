"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "@cubing/icons";
import { CompetitionCardProps } from "@/types/competition.types";

const CompetitionCard: React.FC<CompetitionCardProps> = ({
  competition,
  type,
  index,
}) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    if (startDate === endDate) {
      return new Date(startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return `${new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${new Date(endDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  };

  const getCompetitionStatus = () => {
    if (competition.cancelled_at) {
      return <span className="text-red-500">Cancelled</span>;
    }

    const today = new Date().toDateString();
    const startDate = new Date(competition.start_date).toDateString();
    const endDate = new Date(competition.end_date).toDateString();

    if (startDate === today || endDate === today) {
      return <span className="text-green-300">Ongoing</span>;
    }

    return <span className="text-red-500">Completed</span>;
  };

  return (
    <Card
      key={`${type}-${competition.id}-${index}`}
      className="bg-background relative hover:bg-secondary/50 transition-all ease-in duration-200 text-muted-foreground min-w-[320px] max-w-fit md:w-[380px] flex-shrink-0 border border-border rounded-lg"
    >
      {type === "past" && (
        <Badge className="absolute right-3 bottom-3 text-[11px] md:text-xs bg-transparent hover:bg-transparent cursor-default px-1">
          {getCompetitionStatus()}
        </Badge>
      )}

      <Link prefetch={true} href={`/competitions/${competition.id}`}>
        <CardContent className="p-4 h-[150px] cursor-pointer">
          <h3 className="text-[17px] font-bold text-foreground text-wrap line-clamp-2">
            {competition.name}
          </h3>
          <p className="text-wrap w-full text-[15px] py-2">
            {competition?.city}
          </p>
          <div className="text-xs text-wrap max-w-[300px]">
            {competition?.event_ids.map((event: string, eventIndex: number) => (
              <TooltipProvider
                key={`${competition.id}-${event}-${eventIndex}`}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <span className={`cubing-icon event-${event} pr-3`}></span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-green-500 text-foreground py-1 px-2 rounded-none">
                    <p>{event}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="pb-3 px-4 flex justify-start items-center">
        <span className="text-sm flex font-semibold items-center gap-1">
          {formatDateRange(competition.start_date, competition.end_date)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default CompetitionCard;
