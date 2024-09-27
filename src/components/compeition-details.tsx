"use client";

import { CompetitionDetails } from '@/types/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import React, { useEffect, useState } from 'react';
import "@cubing/icons";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import Link from 'next/link';
import LoadingComponent from './loading';

const LeafletMap = dynamic(() => import("@/components/map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

const CompetitionDetailsComponent = ({ compInfo }: { compInfo: CompetitionDetails }) => {
    const [currentCompetition, setCurrentCompetition] = useState<CompetitionDetails>(compInfo);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentCompetition(compInfo);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [compInfo]);

    const coordinates: LatLngTuple = [
        compInfo.venue.coordinates.latitude,
        compInfo.venue.coordinates.longitude
    ];

    return (
        <div className="w-full mx-auto text-stone-200 py-6 md:py-8 px-4 md:px-5">
            {
                isLoading ? (<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <LoadingComponent />
                </div>) : (
                    <div className="grid animate-fade-in gap-6">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='grid gap-6'>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{currentCompetition.name}</h1>
                                    <p className="mt-4 text-stone-400">
                                        {
                                            currentCompetition.date.from === currentCompetition.date.till
                                                ? new Date(currentCompetition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                : `${new Date(currentCompetition.date.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(currentCompetition.date.till).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Event Details</h2>
                                    <div className="mt-4 grid gap-4">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="font-medium">Location</p>
                                                <p className="text-stone-400">
                                                    {`${currentCompetition?.venue.name.includes('[') ? (currentCompetition.venue.name).split('(')[0].slice(1,-1) : currentCompetition?.venue.name}, ${currentCompetition.venue.address}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="font-medium">Events</p>
                                                <div className='py-2'>
                                                    {currentCompetition.events.map((event) => (
                                                        <TooltipProvider key={event}>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <span className={`cubing-icon event-${event} pr-3`}></span>
                                                                </TooltipTrigger>
                                                                <TooltipContent className='bg-green-400 rounded-md text-xs p-1 text-black'>
                                                                    <p>{event}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <>
                                <LeafletMap coordinates={coordinates} address={currentCompetition.venue.address} />
                            </>
                        </div>
                        <div className="grid gap-6">
                            <div>
                                <h2 className="text-2xl font-bold">Important Information</h2>
                                <div className="mt-4">
                                    <p className="text-stone-400">{currentCompetition.information}</p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Organizers</h2>
                                <div className="mt-4 grid gap-4">
                                    {currentCompetition.organisers.map((organiser) => (
                                        <div key={organiser.email} className="flex items-center gap-2">
                                            <div>
                                                <p className="font-medium">{organiser.name}</p>
                                                <p className="text-stone-400">{organiser.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {
                            new Date(compInfo.date.till) < new Date() ? <div className='w-full my-5 text-center text-blue-500 hover:text-blue-600 hover:underline hover:underline-offset-2 cursor-pointer'>
                                <Link href={`https://www.worldcubeassociation.org/competitions/${compInfo.id}`}>Check out the competition results!</Link>
                            </div> : <div className='w-full my-5 text-center text-blue-500 hover:text-blue-600 hover:underline hover:underline-offset-2 cursor-pointer'>
                                <Link href={`https://www.worldcubeassociation.org/competitions/${compInfo.id}`}>Find out more about this competition!</Link>
                            </div>
                        }
                    </div>
                )
            }
        </div>
    );
};

export default CompetitionDetailsComponent;
