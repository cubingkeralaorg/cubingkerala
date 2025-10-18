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

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Cache for 7 days since competitions don't change frequently
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours

// Helper functions for localStorage with long-term storage
const setCompetitionsCache = (data: any) => {
  const now = new Date();
  const item = {
    value: data,
    cachedAt: now.getTime(),
    expiry: now.getTime() + CACHE_DURATION,
  };
  localStorage.setItem("competitions", JSON.stringify(item));
};

const getCompetitionsCache = () => {
  const itemStr = localStorage.getItem("competitions");
  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    // Always return cached data, even if expired (we'll only refresh on manual trigger)
    return {
      data: item.value,
      isExpired: Date.now() > item.expiry,
      cachedAt: item.cachedAt
    };
  } catch (error) {
    // If parsing fails, remove the corrupted item
    localStorage.removeItem("competitions");
    return null;
  }
};

const clearCompetitionsCache = () => {
  localStorage.removeItem("competitions");
};

const UpPastCompetitions = () => {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<Competition[]>([]);
  const [pastCompetitions, setPastCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false); // Only show loading during manual refresh
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCompetitions = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsRefreshing(true);
      }

      const timestamp = Date.now();
      const res = await axios.get(`/api/get-competitions?_t=${timestamp}`, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
        timeout: 35000,
      });

      if (res.data && !res.data.error) {
        setUpcomingCompetitions(res.data.upcomingCompetitions);
        setPastCompetitions(res.data.pastCompetitions);
        setLastUpdated(new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }));

        // Always cache the fresh data
        setCompetitionsCache(res.data);

        if (showLoading) {
          // Show success message briefly
          setTimeout(() => setIsRefreshing(false), 1000);
        }
      } else {
        throw new Error(res.data.error || "No data received");
      }
    } catch (error: any) {
      console.error("Error fetching competitions:", error);

      let errorMsg = "Failed to refresh competitions";
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMsg = "Request timeout - please try again";
      } else if (error.response?.status >= 500) {
        errorMsg = "Server error - please try again later";
      } else if (!navigator.onLine) {
        errorMsg = "No internet connection";
      }

      setLastUpdated(`Refresh failed: ${errorMsg}`);

      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 2000);
      }
    }
  };

  const handleForceRefresh = () => {
    clearCompetitionsCache();
    fetchCompetitions(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const cachedResult = getCompetitionsCache();

    if (cachedResult) {
      // Always show cached data immediately
      setUpcomingCompetitions(cachedResult.data?.upcomingCompetitions);
      setPastCompetitions(cachedResult.data?.pastCompetitions);
      const lastFetch = new Date(cachedResult.data?.lastFetch).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      setLastUpdated(lastFetch);
    } else {
      // No cache exists - this is the first visit, so fetch data
      setLoading(true);
      fetchCompetitions(false).finally(() => setLoading(false));
    }
  }, []);

  // Show loading only when there's no cached data (first visit)
  if (loading && !upcomingCompetitions.length && !pastCompetitions.length) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="animate-fade-in w-full">
        <BlurIn
          word="Competitions"
          className="text-4xl text-center font-bold tracking-tighter md:text-6xl mb-3 md:mb-6"
        />
        {/* Status info and refresh controls */}
      <div className="text-xs text-gray-400 text-center mb-4 space-y-2">
        <div>Last updated: {lastUpdated}</div>

        <div className="flex items-center justify-center gap-4">
          {!loading && !isRefreshing && (
            <>
              <button
                onClick={handleForceRefresh}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-xs transition-colors"
                disabled={isRefreshing}
              >
                Refresh Competitions
              </button>
            </>
          )}
          {isRefreshing && (
            <div className="px-3 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-xs transition-colors">
              Refreshing competitions...
            </div>
          )}
        </div>
      </div>
        <div className="flex flex-wrap justify-around">
          <section>
            <h2
              style={{ zIndex: "10000" }}
              className="text-xl md:text-2xl font-bold text-green-500 py-5 bg-neutral-950 text-center"
            >
              Upcoming Competitions
            </h2>
            {loading && upcomingCompetitions.length === 0 && (
              <div className="w-[90vw] md:w-[600px] h-[400px] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <span className="text-xl text-stone-400">Loading competitions...</span>
                  <div className="text-sm text-gray-500">First time loading, please wait</div>
                </div>
              </div>
            )}
            {upcomingCompetitions && upcomingCompetitions.length > 0 ? (
              <ScrollArea
                className={`whitespace-nowrap rounded-md h-[70vh] md:h-[50vh] overflow-auto ${upcomingCompetitions.length > 5 ? "h-[70vh]" : "h-fit"
                  }`}
              >
                <div className="flex flex-col space-y-2">
                  {upcomingCompetitions.map((competition, index) => (
                    <Card
                      key={`upcoming-${competition.id}-${index}`}
                      className="bg-neutral-950 hover:bg-neutral-900 transition-all ease-in duration-200 text-stone-400 w-[90vw] md:w-[600px] border border-neutral-800 rounded-md"
                    >
                      <Link
                        prefetch={true}
                        href={`/competitions/${competition.id}`}
                      >
                        <CardContent className="p-2 md:p-4 h-fit max-w-[90vw] md:max-w-full cursor-pointer">
                          <h3 className="text-[17px] font-bold text-stone-200 text-wrap">
                            {competition.name}
                          </h3>
                          <p className="text-wrap w-full text-[15px] py-2">
                            {competition?.city}
                          </p>
                          <div className="text-xs text-wrap">
                            {competition?.event_ids.map(
                              (event: any, eventIndex: number) => (
                                <TooltipProvider key={`${competition.id}-${event}-${eventIndex}`}>
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
                          {competition.start_date === competition.end_date
                            ? new Date(competition.start_date).toLocaleDateString(
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
              !loading && (
                <div className="bg-neutral-950 w-[90vw] md:w-[600px] border border-neutral-800 rounded-md h-[125px] md:h-[138px] flex flex-col items-center justify-center cursor-default">
                  <h3 className="text-[17px] font-bold text-stone-200">
                    Stay tuned!
                  </h3>
                  <h1 className="text-md md:text-lg text-neutral-400 font-normal">
                    New competitions are on the way...
                  </h1>
                </div>
              )
            )}
          </section>

          <section>
            <h2
              style={{ zIndex: "10000" }}
              className="text-xl md:text-2xl text-center text-red-500 font-bold py-5 bg-neutral-950"
            >
              Past Competitions
            </h2>
            {pastCompetitions?.length > 0 ? (
              <ScrollArea className="whitespace-nowrap rounded-md h-[90vh] md:h-[50vh] overflow-auto">
                <div className="flex flex-col space-y-2">
                  {pastCompetitions.map((competition, index) => (
                    <Card
                      key={`past-${competition.id}-${index}`}
                      className="bg-neutral-950 relative hover:bg-neutral-900 transition-all ease-in duration-200 text-stone-400 w-[90vw] md:w-[600px] border border-neutral-800 rounded-md"
                    >
                      <div className="w-full">
                        <Badge className="absolute right-3 bottom-3 text-[11px] md:text-xs bg-transparent hover:bg-transparent cursor-default px-1">
                          {competition.cancelled_at ? (
                            <span className="text-red-400">Cancelled</span>
                          ) : new Date(competition.start_date).toDateString() === new Date().toDateString() ||
                            new Date(competition.end_date).toDateString() === new Date().toDateString() ? (
                            <span className="text-green-300">Ongoing</span>
                          ) : (
                            <span className="text-red-400">Completed</span>
                          )}
                        </Badge>
                      </div>
                      <Link
                        prefetch={true}
                        href={`/competitions/${competition.id}`}
                      >
                        <CardContent className="p-2 md:p-4 h-fit max-w-[90vw] md:max-w-full cursor-pointer">
                          <h3 className="text-[17px] font-bold text-stone-200">
                            {competition.name}
                          </h3>
                          <p className="text-wrap w-full text-[15px] py-2">
                            {competition?.city}
                          </p>
                          <div className="text-xs text-wrap">
                            {competition?.event_ids.map(
                              (event: any, eventIndex: number) => (
                                <TooltipProvider key={`${competition.id}-${event}-${eventIndex}`}>
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
                        <span className="text-sm flex font-semibold items-center gap-1">
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
              loading && (
                <div className="w-[90vw] md:w-[600px] h-[400px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <span className="text-xl text-stone-400">Loading past competitions...</span>
                    <div className="text-sm text-gray-500">First time loading, please wait</div>
                  </div>
                </div>
              )
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UpPastCompetitions;