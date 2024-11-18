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
import BlurIn from './ui/blur-in';
import { Badge } from './ui/badge';

const UpPastCompetitions = ({ response }: { response: ApiResonse }) => {

    const [upcomingCompetitions, setUpcomingCompetitions] = useState<Competition[]>([]);
    const [pastCompetitions, setPastCompetitions] = useState<Competition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (response?.items) {
            const KeralComps = response.items.filter((comp) => comp.city.includes("Kerala"));
            setPastCompetitions(KeralComps.filter((comp) => new Date(comp.date.till) < new Date()));
            setUpcomingCompetitions((KeralComps.filter((comp) => new Date(comp.date.from) > new Date())).reverse());
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [response]);

    const handleRegisterRedirectToWCA = (id: string) => {
        window.open(`https://www.worldcubeassociation.org/competitions/${id}/register`, '_blank');
    }

    console.log(pastCompetitions);


    return (
        <div className="flex flex-col items-center gap-6">
            {
                isLoading ? (<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <LoadingComponent />
                </div>) : (
                    <div className='animate-fade-in w-full'>
                        <BlurIn
                            word="Competitions"
                            className="text-4xl text-center font-bold tracking-tighter md:text-6xl mb-6"
                        />
                        <div className='flex flex-wrap justify-evenly gap-10 '>
                            <section>
                                <h2 style={{ zIndex: '10000' }} className="text-xl md:text-2xl font-bold text-green-500 py-5 sticky top-[95px] bg-black text-center">Upcoming Competitions</h2>
                                {
                                    upcomingCompetitions.length > 0 ? (
                                        <ScrollArea className="whitespace-nowrap rounded-md max-h-[450px] overflow-auto">
                                            <div className="flex flex-col space-y-4">
                                                {
                                                    upcomingCompetitions.map((competition, index) =>
                                                        <>
                                                            <Card className="bg-neutral-900 hover:bg-neutral-800 transition-all text-stone-400 w-[90vw] md:w-[600px] border-none rounded-none">
                                                                <Link prefetch={true} key={index} href={`/competitions/${competition.id}`}>
                                                                    <CardContent className="p-6 h-fit max-w-[90vw] md:max-w-[400px] cursor-pointer">
                                                                        <h3 className="text-[17px] font-bold text-stone-200 text-wrap">{competition.name}</h3>
                                                                        <p className="text-wrap text-[15px] py-2">
                                                                            {competition?.venue.name.includes('[') ? (competition.venue.name).split('(')[0].slice(1, -1) : competition?.venue.name}
                                                                        </p>
                                                                        <div className='text-xs text-wrap'>
                                                                            {
                                                                                competition?.events.map((event, index) => (
                                                                                    <TooltipProvider key={index}>
                                                                                        <Tooltip>
                                                                                            <TooltipTrigger>
                                                                                                <span className={`cubing-icon event-${event} pr-3`}></span>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent className='bg-green-400 text-black py-1 px-2 rounded-none'>
                                                                                                <p>{event}</p>
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                    </TooltipProvider>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </CardContent>
                                                                </Link>
                                                                <CardFooter className="bg-neutral-950 py-3 px-5 flex justify-between items-center">
                                                                    <span className='text-sm flex font-semibold items-center gap-1'>
                                                                        {
                                                                            competition.date.from === competition.date.till
                                                                                ? new Date(competition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                                                : `${new Date(competition.date.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(competition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
                                                                        }
                                                                    </span>
                                                                    <p onClick={() => handleRegisterRedirectToWCA(competition.id)} className='text-sm hover:text-green-400 cursor-pointer'>Register</p>
                                                                </CardFooter>
                                                            </Card>
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <ScrollBar orientation="vertical" />
                                        </ScrollArea>
                                    ) : (
                                        <div className='w-[90vw] md:w-[600px] max-h-[400px]'><h1 className='text-md md:text-xl text-center mt-0 md:mt-5 text-neutral-500 font-medium'>New competitions are on the way!</h1></div>
                                    )
                                }
                            </section>

                            {/* Similar structure for Past Competitions */}
                            <section>
                                <h2 style={{ zIndex: '10000' }} className="text-xl md:text-2xl text-center text-red-500 font-bold py-5 sticky top-[95px] bg-black">Past Competitions</h2>
                                {
                                    pastCompetitions.length > 0 ? (
                                        <ScrollArea className="whitespace-nowrap rounded-md h-[70vh] md:h-[360px] overflow-auto">
                                            <div className="flex flex-col space-y-4">
                                                {
                                                    pastCompetitions.map((competition, index) =>
                                                        <>
                                                            <Card className="bg-neutral-900 hover:bg-neutral-800 transition-all text-stone-400 w-[90vw] md:w-[600px] border-none rounded-none">
                                                                <div className='w-full relative'>
                                                                    <Badge className='absolute right-1 md:right-2 top-1 text-[11px] md:text-xs bg-transparent hover:bg-transparent cursor-default px-1'>
                                                                        {
                                                                            competition.isCanceled ? (
                                                                                <span className="text-red-400">Cancelled</span>
                                                                            ) : (
                                                                                new Date(competition.date.from).toDateString() === new Date().toDateString() ||
                                                                                    new Date(competition.date.till).toDateString() === new Date().toDateString() ? (
                                                                                    <span className="text-green-300">Ongoing</span>
                                                                                ) : (
                                                                                    <span className="text-red-400">Completed</span>
                                                                                )
                                                                            )
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <Link prefetch={true} key={index} href={`/competitions/${competition.id}`}>
                                                                    <CardContent className="p-6 h-fit max-w-[90vw] md:max-w-[400px] cursor-pointer">
                                                                        <h3 className="text-[17px] font-bold text-stone-200">{competition.name}</h3>
                                                                        <p className="text-wrap text-[15px] py-2">
                                                                            {competition?.venue.name.includes('[') ? (competition.venue.name).split('(')[0].slice(1, -1) : competition?.venue.name}
                                                                        </p>
                                                                        <div className='text-xs text-wrap'>
                                                                            {
                                                                                competition?.events.map((event, index) => (
                                                                                    <TooltipProvider key={index}>
                                                                                        <Tooltip>
                                                                                            <TooltipTrigger>
                                                                                                <span className={`cubing-icon event-${event} pr-3`}></span>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent className='bg-green-400 text-black py-1 px-2 rounded-none'>
                                                                                                <p>{event}</p>
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                    </TooltipProvider>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </CardContent>
                                                                </Link>
                                                                <CardFooter className="bg-neutral-950 py-3 px-5 flex justify-between items-center">
                                                                    <span className='text-sm lex font-semibold items-center gap-1'>
                                                                        {
                                                                            competition.date.from === competition.date.till
                                                                                ? new Date(competition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                                                : `${new Date(competition.date.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(competition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
                                                                        }
                                                                    </span>
                                                                </CardFooter>
                                                            </Card>
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <ScrollBar orientation="vertical" />
                                        </ScrollArea>
                                    ) : (
                                        <div className='w-[90vw] md:w-[600px] h-[400px]'>
                                            <span className='text-xl text-stone-400'>Loading...</span>
                                        </div>
                                    )
                                }
                            </section>
                        </div>

                    </div>

                )
            }
        </div >
    )
}

export default UpPastCompetitions