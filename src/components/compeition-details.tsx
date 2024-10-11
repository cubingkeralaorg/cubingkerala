"use client";

import { EventDetails } from '@/types/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import React, { useEffect, useState } from 'react';
import "@cubing/icons";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import LoadingComponent from './loading';
import { CiLink } from "react-icons/ci";

const LeafletMap = dynamic(() => import("@/components/map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

const CompetitionDetailsComponent = ({ compInfo }: { compInfo: EventDetails }) => {
    const [currentCompetition, setCurrentCompetition] = useState<EventDetails>(compInfo);
    const [isLoading, setIsLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [formatedInformation, setFormatedInformation] = useState<string>('');

    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentCompetition(compInfo);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [compInfo]);

    useEffect(() => {
        if (currentCompetition.information) {
            setFormatedInformation(convertMarkdownToHTML(currentCompetition.information));
        }
    }, [currentCompetition.information]);

    console.log(currentCompetition);

    const coordinates: LatLngTuple = [
        compInfo.latitude_degrees,
        compInfo.longitude_degrees
    ];

    // Convert the information into HTML
    const convertMarkdownToHTML = (text: string) => {
        // Convert bullet points to <li> items
        const bulletPointReplaced = text
            .replace(/^\* (.*)$/gm, '<li>$1</li>') // Match bullet points
            .replace(/### (.*?)\n/g, '<strong>$1</strong><br/>') // Match headings
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Match bold text

        // Wrap the list items in a <ul> tag
        const listWrapped = bulletPointReplaced.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');

        // Split paragraphs and wrap in <p> tags
        const paragraphs = listWrapped.split('\n\n').map(paragraph => `<p>${paragraph.trim()}</p>`).join('\n');

        return paragraphs;
    };

    const handleRegisterForThisCompetition = () => {
        window.open(`https://www.worldcubeassociation.org/competitions/${compInfo.id}/register`, '_blank');
    }

    const handleCompetitionIsOver = () => {
        window.open(`https://www.worldcubeassociation.org/competitions/${compInfo.id}`, '_blank');
    }

    const handleOrganiserRedirect = (url: string | null): void => {
        url && window.open(url, '_blank');
    }

    return (
        <div className="w-full mx-auto text-stone-200 py-6 md:py-8 px-4 md:px-5">
            {
                isLoading ? (
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <LoadingComponent />
                    </div>
                ) : (
                    <div className="grid animate-fade-in gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-green-500">{currentCompetition.name}</h1>
                            <p className="mt-4 text-stone-400">
                                {
                                    currentCompetition.start_date === currentCompetition.end_date
                                        ? new Date(currentCompetition.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : `${new Date(currentCompetition.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(currentCompetition.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
                                }
                            </p>
                        </div>
                        <div className='flex flex-wrap'>
                            <div className='w-full md:w-1/2'>
                                <div>
                                    <h2 className="text-2xl font-bold">Event Details</h2>
                                    <div className="mt-4 grid gap-2">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="font-medium">Location</p>
                                                <p className="text-stone-400">
                                                    {`${currentCompetition?.venue.includes('[') ? (currentCompetition.venue).split('(')[0].slice(1, -1) : currentCompetition?.venue}, ${currentCompetition.venue_address}`}
                                                </p>
                                                <div onClick={() => setShowMap(!showMap)} className="text-green-400 hover:text-green-500 cursor-pointer flex gap-1 mt-2"><p>Map</p>
                                                    <CiLink />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            showMap && <div>
                                                <LeafletMap coordinates={coordinates} address={currentCompetition.venue_address} />
                                            </div>
                                        }
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="font-medium">Events</p>
                                                <div className='py-2'>
                                                    {currentCompetition.event_ids.map((event) => (
                                                        <TooltipProvider key={event}>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <span className={`cubing-icon event-${event} pr-3`}></span>
                                                                </TooltipTrigger>
                                                                <TooltipContent className='bg-green-400 rounded-none text-xs py-1 px-2 text-black'>
                                                                    <p>{event}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="font-medium">Main Event</p>
                                                <div className='py-2'>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <span className={`cubing-icon event-${compInfo.main_event_id} pr-3`}></span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className='bg-green-400 rounded-none text-xs py-1 px-2 text-black'>
                                                                <p>{compInfo.main_event_id}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="font-medium">Competitor Limit</p>
                                                <p className="text-stone-400">
                                                    {currentCompetition.competitor_limit}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='mt-6 hidden md:block'>
                                            <h2 className="text-2xl font-bold">Information</h2>
                                            <div dangerouslySetInnerHTML={{ __html: formatedInformation }} className="mt-4 text-stone-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full md:w-1/2 flex justify-start md:justify-end mt-6 md:mt-0'>
                                <div>
                                    <h2 className="text-2xl font-bold">Registration Details</h2>
                                    <div className='mt-4'>
                                        <p className="font-medium">Registration period</p>
                                        <p className="text-stone-400">
                                            {`Online registration opened on ${new Date(currentCompetition.registration_open).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                        </p>
                                        <p className="text-stone-400">
                                            {`Registration will close on ${new Date(currentCompetition.registration_close).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                        </p>
                                    </div>
                                    <div className='my-2'>
                                        {
                                            new Date(compInfo.end_date) > new Date() ?
                                                <div onClick={() => handleRegisterForThisCompetition()} className='text-blue-500 hover:text-blue-600 cursor-pointer flex gap-1'>
                                                    <p>Register for this competition here</p>
                                                    <CiLink />
                                                </div>
                                                :
                                                <div className='text-red-500 flex gap-1 hover:text-red-600 cursor-pointer' onClick={() => handleCompetitionIsOver()}>
                                                    <p>Competition is over. Check results here</p>
                                                    <CiLink />
                                                </div>
                                        }
                                    </div>
                                    <div className='mt-6 block md:hidden'>
                                        <h2 className="text-2xl font-bold">Information</h2>
                                        <div dangerouslySetInnerHTML={{ __html: formatedInformation }} className="mt-4 text-stone-400"></div>
                                    </div>
                                    <div className='mt-6'>
                                        <h2 className="text-2xl font-bold">Organizers</h2>
                                        <div className="mt-4 grid">
                                            {currentCompetition.organizers.map((organiser) => (
                                                <div key={organiser.id} className="flex items-center gap-2">
                                                    <p onClick={()=>handleOrganiserRedirect(organiser.url)} className={`font-medium text-normal text-stone-400 ${organiser.wca_id ? 'hover:text-blue-500 cursor-pointer' : 'cursor-default'}`}>{organiser.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex mt-10 gap-1 text-sm text-green-400 hover:text-green-500 underline underline-offset-4 cursor-pointer'><p>More details on World Cube Association</p>
                                    <CiLink/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default CompetitionDetailsComponent;

