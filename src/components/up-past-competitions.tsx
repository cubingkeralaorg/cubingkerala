"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import "@cubing/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Competition } from "@/types/types";
import Link from "next/link";
import BlurIn from "./ui/blur-in";
import { Badge } from "./ui/badge";
import LoadingComponent from "./loading";
import axios from "axios";

const UpPastCompetitions = () => {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<
    Competition[]
  >([]);
  const [pastCompetitions, setPastCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  const CACHE_KEY = "competitions";
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour

  useEffect(() => {
    window.scrollTo(0, 0);

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL ) {
        setUpcomingCompetitions(data.upcomingCompetitions);
        setPastCompetitions(data.pastCompetitions);
        setLoading(false);
        return;
      }
    }

    const fetchCompetitions = async () => {
      try {
        const res = await axios.get("/api/get-competitions");
        if (res.data) {
          setUpcomingCompetitions(res.data.upcomingCompetitions);
          setPastCompetitions(res.data.pastCompetitions);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: res.data, timestamp: Date.now() })
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching competitions:", error);
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="animate-fade-in w-full">
        <BlurIn
          word="Competitions"
          className="text-4xl text-center font-bold tracking-tighter md:text-6xl mb-0 md:mb-6"
        />
        <div className="flex flex-wrap justify-around">
          <section>
            <h2
              style={{ zIndex: "10000" }}
              className="text-xl md:text-2xl font-bold text-green-500 py-5 sticky top-[60px] bg-neutral-950 text-center"
            >
              Upcoming Competitions
            </h2>
            {!upcomingCompetitions && (
              <div className="w-[90vw] md:w-[600px] h-[400px] flex items-center justify-center">
                <span className="text-xl text-stone-400">Loading...</span>
              </div>
            )}
            {upcomingCompetitions && upcomingCompetitions.length > 0 ? (
              <ScrollArea
                className={`whitespace-nowrap rounded-md h-[70vh] md:h-[50vh] overflow-auto ${
                  upcomingCompetitions.length > 5 ? "h-[70vh]" : "h-fit"
                }`}
              >
                <div className="flex flex-col space-y-2">
                  {upcomingCompetitions.map((competition, index) => (
                    <Card
                      key={index}
                      className="bg-neutral-950 hover:bg-neutral-900 transition-all ease-in duration-200 text-stone-400 w-[90vw] md:w-[600px] border border-neutral-800 rounded-md"
                    >
                      <Link
                        prefetch={true}
                        key={index}
                        href={`/competitions/${competition.id}`}
                      >
                        <CardContent className="p-2 md:p-4 h-fit max-w-[90vw] md:max-w-full cursor-pointer">
                          <h3 className="text-[17px] font-bold text-stone-200 text-wrap">
                            {competition.name}
                          </h3>
                          <p className="text-wrap w-full text-[15px] py-2">
                            {" "}
                            {competition?.city}
                          </p>
                          <div className="text-xs text-wrap">
                            {competition?.event_ids.map(
                              (event: any, index: number) => (
                                <TooltipProvider key={index}>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <span
                                        className={`cubing-icon event-${event} pr-3`}
                                      ></span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-green-400 text-black py-1 px-2 rounded-none">
                                      <p>{event}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Link>
                      <CardFooter className="pb-3 px-2 md:px-4 flex justify-start items-center">
                        <span className="text-sm flex font-semibold items-center gap-1">
                          {competition.end_date === competition.end_date
                            ? new Date(competition.end_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : `${new Date(
                                competition.start_date
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })} - ${new Date(
                                competition.end_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}`}
                        </span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            ) : (
              <div className="bg-neutral-950 w-[90vw] md:w-[600px] border border-neutral-800 rounded-md h-[125px] md:h-[138px] flex flex-col items-center justify-center cursor-default">
                <h3 className="text-[17px] font-bold text-stone-200">
                  Stay tuned!
                </h3>
                <h1 className="text-md md:text-lg text-neutral-400 font-normal">
                  New competitions are on the way...
                </h1>
              </div>
            )}
          </section>
          <section>
            <h2
              style={{ zIndex: "10000" }}
              className="text-xl md:text-2xl text-center text-red-500 font-bold py-5 sticky top-[60px] bg-neutral-950"
            >
              Past Competitions
            </h2>
            {pastCompetitions.length > 0 ? (
              <ScrollArea className="whitespace-nowrap rounded-md h-[70vh] md:h-[50vh] overflow-auto">
                <div className="flex flex-col space-y-2">
                  {pastCompetitions.map((competition, index) => (
                    <Card
                      key={index}
                      className="bg-neutral-950 relative hover:bg-neutral-900 transition-all ease-in duration-200 text-stone-400 w-[90vw] md:w-[600px] border border-neutral-800 rounded-md"
                    >
                      <div className="w-full">
                        <Badge className="absolute right-3 bottom-3 text-[11px] md:text-xs bg-transparent hover:bg-transparent cursor-default px-1">
                          {competition.cancelled_at ? (
                            <span className="text-red-400">Cancelled</span>
                          ) : new Date(
                              competition.start_date
                            ).toDateString() === new Date().toDateString() ||
                            new Date(competition.end_date).toDateString() ===
                              new Date().toDateString() ? (
                            <span className="text-green-300">Ongoing</span>
                          ) : (
                            <span className="text-red-400">Completed</span>
                          )}
                        </Badge>
                      </div>
                      <Link
                        prefetch={true}
                        key={index}
                        href={`/competitions/${competition.id}`}
                      >
                        <CardContent className="p-2 md:p-4 h-fit max-w-[90vw] md:max-w-full cursor-pointer">
                          <h3 className="text-[17px] font-bold text-stone-200">
                            {competition.name}
                          </h3>
                          <p className="text-wrap w-full text-[15px] py-2">
                            {" "}
                            {competition?.city}
                          </p>
                          <div className="text-xs text-wrap">
                            {competition?.event_ids.map(
                              (event: any, index: number) => (
                                <TooltipProvider key={index}>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <span
                                        className={`cubing-icon event-${event} pr-3`}
                                      ></span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-green-400 text-black py-1 px-2 rounded-none">
                                      <p>{event}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Link>
                      <CardFooter className="pb-3 px-2 md:px-4 flex justify-between items-center">
                        <span className="text-sm lex font-semibold items-center gap-1">
                          {competition.start_date === competition.end_date
                            ? new Date(competition.end_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : `${new Date(
                                competition.start_date
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })} - ${new Date(
                                competition.end_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}`}
                        </span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            ) : (
              <div className="w-[90vw] md:w-[600px] h-[400px]">
                <span className="text-xl text-stone-400">Loading...</span>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UpPastCompetitions;
