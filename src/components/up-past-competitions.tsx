"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import "@cubing/icons";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ApiResonse, Competition } from '@/types/types'
import Link from 'next/link'
import LoadingComponent from './loading'
import ShimmerButton from './magicui/shimmer-button'

const UpPastCompetitions = ({ response }: { response: ApiResonse }) => {

    const [upcomingCompetitions, setUpcomingCompetitions] = useState<Competition[]>([]);
    const [pastCompetitions, setPastCompetitions] = useState<Competition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (response?.items) {
            const KeralComps = response.items.filter((comp) => comp.city.includes("Kerala"));
            setPastCompetitions(KeralComps.filter((comp) => new Date(comp.date.till) < new Date()));
            setUpcomingCompetitions((KeralComps.filter((comp) => new Date(comp.date.till) > new Date())).reverse());
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [response]);

    return (
        <div className="gap-6">
            {
                isLoading ? (<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <LoadingComponent />
                </div>) : (
                    <div className='animate-fade-in'>
                        <h1 className="text-3xl font-bold mb-10 text-green-500">Competitions</h1>
                        <section>
                            <h2 className="text-2xl font-bold">Upcoming Competitions</h2>
                            {
                                upcomingCompetitions.length > 0 ? <ScrollArea className="whitespace-nowrap rounded-md mb-5">
                                    <div className="flex space-x-4 py-5">
                                        {
                                            upcomingCompetitions.map((competition, index) =>
                                                <Link prefetch={true} key={index} href={`/competitions/${competition.id}`}>
                                                    <Card className="bg-neutral-900 hover:bg-neutral-800 transition-all text-stone-400 w-[350px] md:w-[400px] border-none cursor-pointer rounded-none">
                                                        <CardContent className="p-6 h-[150px] max-w-[90vw] md:max-w-[400px]">
                                                            <h3 className="text-md font-bold text-stone-200 text-wrap">{competition.name}</h3>
                                                            <p className="text-wrap text-sm py-2">
                                                                {competition?.venue.name.includes('[') ? (competition.venue.name).split('(')[0].slice(1, -1) : competition?.venue.name}
                                                            </p>
                                                            <div className='text-xs'>
                                                                {
                                                                    competition?.events.map((event, index) => (
                                                                        <TooltipProvider key={index}>
                                                                            <Tooltip>
                                                                                <TooltipTrigger>
                                                                                    <span className={`cubing-icon event-${event} pr-3`}></span>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent className='bg-green-400 text-black p-1 rounded-md'>
                                                                                    <p>{event}</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    ))
                                                                }
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="bg-neutral-950 py-3 px-5 flex justify-between items-center">
                                                            <span className='text-xs flex font-semibold items-center gap-1'>
                                                                {
                                                                    competition.date.from === competition.date.till
                                                                        ? new Date(competition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                                        : `${new Date(competition.date.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(competition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
                                                                }
                                                            </span>
                                                            <Link href={`https://www.worldcubeassociation.org/competitions/${competition.id}/register`}>
                                                                <ShimmerButton className='py-1 px-4 text-green-400 text-xs'>
                                                                    Register
                                                                </ShimmerButton>
                                                            </Link>
                                                        </CardFooter>
                                                    </Card>
                                                </Link>
                                            )
                                        }
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea> : <div className='min-h-[200px] flex items-center'><h1 className='text-lg lg:text-2xl font-semibold'>New competitions are on the way!</h1></div>
                            }
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold">Past Competitions</h2>
                            {
                                pastCompetitions.length > 0 ? <ScrollArea className="whitespace-nowrap rounded-md mb-5">
                                    <div className="flex space-x-4 py-5">
                                        {
                                            pastCompetitions.map((competition, index) =>
                                                <Link prefetch={true} key={index} href={`/competitions/${competition.id}`}>
                                                    <Card className="bg-neutral-900 hover:bg-neutral-800 transition-all text-stone-400 w-[350px] md:w-[400px] border-none cursor-pointer rounded-none">
                                                        <CardContent className="p-6 h-[150px] max-w-[90vw] md:max-w-[400px]">
                                                            <h3 className="text-md font-bold text-stone-200">{competition.name}</h3>
                                                            <p className="text-wrap text-sm py-2">
                                                                {competition?.venue.name.includes('[') ? (competition.venue.name).split('(')[0].slice(1, -1) : competition?.venue.name}
                                                            </p>
                                                            <div className='text-xs'>
                                                                {
                                                                    competition?.events.map((event, index) => (
                                                                        <TooltipProvider key={index}>
                                                                            <Tooltip>
                                                                                <TooltipTrigger>
                                                                                    <span className={`cubing-icon event-${event} pr-3`}></span>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent className='bg-green-400 text-black'>
                                                                                    <p>{event}</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    ))
                                                                }
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="bg-neutral-950 py-3 px-5 flex justify-between items-center">
                                                            <span className='text-xs flex font-semibold items-center gap-1'>
                                                                {
                                                                    competition.date.from === competition.date.till
                                                                        ? new Date(competition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                                        : `${new Date(competition.date.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(competition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
                                                                }
                                                            </span>
                                                            <ShimmerButton className='py-1 px-4 text-xs'>
                                                                Completed
                                                            </ShimmerButton>
                                                        </CardFooter>
                                                    </Card>
                                                </Link>
                                            )
                                        }
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea> : <div className='min-h-[200px] flex items-center'>
                                    <span className='text-md font-semibold'>Loading...</span>
                                </div>
                            }
                        </section>
                    </div>

                )
            }
        </div>
    )
}

export default UpPastCompetitions