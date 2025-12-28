"use client";

import React, { useEffect, useState } from "react";
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
import { RefreshCw } from "lucide-react";

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 600 * 1000;

// Helper functions for localStorage
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
    const now = Date.now();

    if (now > item.expiry) {
      localStorage.removeItem("competitions");
      return null;
    }

    return {
      data: item.value,
      cachedAt: item.cachedAt,
    };
  } catch (error) {
    localStorage.removeItem("competitions");
    return null;
  }
};

const clearCompetitionsCache = () => {
  localStorage.removeItem("competitions");
};

const UpPastCompetitions = () => {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<
    Competition[]
  >([]);
  const [pastCompetitions, setPastCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // Track if data has been loaded

  const fetchCompetitions = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsRefreshing(true);
        setLoading(true);
        setDataLoaded(false); // Hide content when refreshing
      }

      const timestamp = Date.now();
      const res = await axios.get(`/api/get-competitions?_t=${timestamp}`, {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        timeout: 35000,
      });

      if (res.data && !res.data.error) {
        setUpcomingCompetitions(res.data.upcomingCompetitions);
        setPastCompetitions(res.data.pastCompetitions);
        setLastUpdated(
          new Date().toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );

        setCompetitionsCache(res.data);

        if (showLoading) {
          setTimeout(() => {
            setIsRefreshing(false);
            setLoading(false);
            setDataLoaded(true);
          }, 1000);
        } else {
          setLoading(false);
          setDataLoaded(true);
        }
      } else {
        throw new Error(res.data.error || "No data received");
      }
    } catch (error: any) {
      console.error("Error fetching competitions:", error);

      let errorMsg = "Failed to refresh competitions";
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        errorMsg = "Request timeout - please try again";
      } else if (error.response?.status >= 500) {
        errorMsg = "Server error - please try again later";
      } else if (!navigator.onLine) {
        errorMsg = "No internet connection";
      }

      setLastUpdated(`Refresh failed: ${errorMsg}`);

      if (showLoading) {
        setTimeout(() => {
          setIsRefreshing(false);
          setLoading(false);
          setDataLoaded(true);
        }, 2000);
      } else {
        setLoading(false);
        setDataLoaded(true);
      }
    }
  };

  const handleForceRefresh = () => {
    clearCompetitionsCache();
    fetchCompetitions(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadCompetitions = () => {
      const cachedResult = getCompetitionsCache();

      if (cachedResult) {
        setUpcomingCompetitions(cachedResult.data?.upcomingCompetitions || []);
        setPastCompetitions(cachedResult.data?.pastCompetitions || []);
        const lastFetch = new Date(cachedResult.data?.lastFetch).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        setLastUpdated(lastFetch);
        setLoading(false);
        setDataLoaded(true);
      } else {
        console.log("Cache expired or missing - fetching fresh data");
        setLoading(true);
        setDataLoaded(false);
        fetchCompetitions(false);
      }
    };

    loadCompetitions();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page visible - checking cache");
        loadCompetitions();
      }
    };

    const handleFocus = () => {
      console.log("Page focused - checking cache");
      loadCompetitions();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Show loading component when loading or not yet loaded data
  if (loading || !dataLoaded) {
    return <LoadingComponent />;
  }

  return (
    <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 text-stone-200 flex flex-col min-h-[calc(100vh-160px)]">
      <div className="animate-fade-in w-full">
        <div className="flex align-center justify-between mb-4">
          <div>
            <BlurIn
              word="Competitions"
              className="text-4xl text-start font-bold tracking-tighter md:text-6xl mb-2 md:mb-4"
            />
            <div className="text-xs text-gray-400 text-start ml-1">
              Last updated: {lastUpdated}
            </div>
          </div>
          <div className="mt-2 md:mt-3">
            {!isRefreshing && (
              <button
                onClick={handleForceRefresh}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded flex items-center gap-1.5 text-xs transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw size={13}/>
                <span>Refresh</span>
              </button>
            )}
            {isRefreshing && (
              <div className="px-3 py-2 bg-neutral-800 text-white rounded text-xs flex items-center gap-1.5">
                <RefreshCw size={13} className="animate-spin"/>
                <span>Loading...</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {/* Upcoming Competitions Section */}
          <section>
            <h2
              style={{ zIndex: "10000" }}
              className="text-xl md:text-2xl font-bold text-green-500 py-3 md:py-5 bg-neutral-950 text-start"
            >
              Upcoming Competitions
            </h2>
            {upcomingCompetitions && upcomingCompetitions.length > 0 ? (
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex space-x-4 pb-4">
                  {upcomingCompetitions.map((competition, index) => (
                    <Card
                      key={`upcoming-${competition.id}-${index}`}
                      className="bg-neutral-950 hover:bg-neutral-900 transition-all ease-in duration-200 text-stone-400 min-w-[320px] max-w-fit md:w-[380px] flex-shrink-0 border border-neutral-800 rounded-md"
                    >
                      <Link
                        prefetch={true}
                        href={`/competitions/${competition.id}`}
                      >
                        <CardContent className="p-4 h-[150px] cursor-pointer">
                          <h3 className="text-[17px] font-bold text-stone-200 text-wrap line-clamp-2">
                            {competition.name}
                          </h3>
                          <p className="text-wrap w-full text-[15px] py-2">
                            {competition?.city}
                          </p>
                          <div className="text-xs text-wrap max-w-[300px]">
                            {competition?.event_ids.map(
                              (event: any, eventIndex: number) => (
                                <TooltipProvider
                                  key={`${competition.id}-${event}-${eventIndex}`}
                                >
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
                      <CardFooter className="pb-3 px-4 flex justify-start items-center">
                        <span className="text-sm flex font-semibold items-center gap-1">
                          {competition.start_date === competition.end_date
                            ? new Date(
                                competition.start_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
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
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <Card className="bg-neutral-950 w-full md:w-[380px] h-[150px] border border-neutral-800 rounded-md">
                <CardContent className="p-4 h-fit flex flex-col justify-center">
                  <h3 className="text-[17px] font-bold text-stone-200">
                    Stay tuned!
                  </h3>
                  <h1 className="text-md md:text-lg text-neutral-400 font-normal">
                    New competitions are on the way...
                  </h1>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Competitions Section */}
          <section>
            <h2
              style={{ zIndex: "10000" }}
              className="text-xl md:text-2xl text-start text-red-500 font-bold py-3 md:py-5 bg-neutral-950"
            >
              Past Competitions
            </h2>
            {pastCompetitions?.length > 0 ? (
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex space-x-4 pb-4">
                  {pastCompetitions.map((competition, index) => (
                    <Card
                      key={`past-${competition.id}-${index}`}
                      className="bg-neutral-950 relative hover:bg-neutral-900 transition-all ease-in duration-200 text-stone-400 min-w-[320px] max-w-fit md:w-[380px] flex-shrink-0 border border-neutral-800 rounded-md"
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
                        href={`/competitions/${competition.id}`}
                      >
                        <CardContent className="p-4 h-[150px] cursor-pointer">
                          <h3 className="text-[17px] font-bold text-stone-200 line-clamp-2">
                            {competition.name}
                          </h3>
                          <p className="text-wrap w-full text-[15px] py-2">
                            {competition?.city}
                          </p>
                          <div className="text-xs text-wrap max-w-[300px]">
                            {competition?.event_ids.map(
                              (event: any, eventIndex: number) => (
                                <TooltipProvider
                                  key={`${competition.id}-${event}-${eventIndex}`}
                                >
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
                      <CardFooter className="pb-3 px-4 flex justify-between items-center">
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
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="bg-neutral-950 w-full flex flex-col items-start justify-center cursor-default">
                <h3 className="text-[17px] font-bold text-stone-200">
                  No past competitions yet!
                </h3>
                <h1 className="text-md md:text-lg text-neutral-400 font-normal">
                  Check back later...
                </h1>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UpPastCompetitions;
