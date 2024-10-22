'use client'

import { CompetitorData, RequestInfo } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import '@cubing/icons'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from 'next/image'
import LoadingComponent from './loading'
import { Metadata } from 'next'
import axios from 'axios'
import BlurIn from './ui/blur-in'

export const metadata: Metadata = {
    title: "Member Info | Cubing Kerala",
    description: "Information about a member of the Rubik's Cube community in Kerala",
    icons: {
        icon: "logoblack.png",
    }
};

const MemberInfoComponent = ({ member, memberResult }: { member: RequestInfo, memberResult: CompetitorData }) => {

    const [currentMember, setCurrentMember] = useState<RequestInfo>(member)
    const [currentMemberResult, setCurrentMemberResult] = useState<CompetitorData>(memberResult)
    const [memberDataFromWCA, setMemberDataFromWCA] = useState<CompetitorData | null>(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0);
        if (member) {
            setCurrentMember(member)
            getMemberDetailsFromWCA();
        }
        if (memberResult) {
            setCurrentMemberResult(memberResult)
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    }, [member, memberResult])

    const getMemberDetailsFromWCA = async () => {
        const response = await axios.get(`https://www.worldcubeassociation.org/api/v0/persons/${member.wcaid}`);
        setMemberDataFromWCA(response.data);
    }

    const personalRecordsArray = Object.entries(currentMemberResult.personal_records).map(([event, ranking]) => ({
        event,
        ranking
    }));


    function convertMillisecondsToTime(milliseconds: number) {
        if (milliseconds < 0) {
            return 'DNF';
        }

        let totalSeconds = milliseconds / 100;

        if (totalSeconds < 60) {
            return totalSeconds.toFixed(2);
        } else {
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = (totalSeconds % 60).toFixed(2);
            if (Number(seconds) < 10) {
                return `${minutes}.0${seconds}`;
            }
            return `${minutes}.${seconds}`;
        }
    }


    function convertMbldToMinutes(number: number): string {
        const numStr = `0${number.toString()}`;

        const DD = parseInt(numStr.substring(1, 3), 10);
        const TTTTT = parseInt(numStr.substring(3, 8), 10);
        const MM = parseInt(numStr.substring(8, 10), 10);

        const difference = 99 - DD;
        const missed = MM;
        const solved = difference + missed;
        const attempted = solved + missed;

        const totalSeconds = TTTTT;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const timeFormatted = `${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}`;

        const finalOutput = `${solved}/${attempted} ${timeFormatted}`;
        return finalOutput;
    }


    return (
        <div className="min-h-screen bg-black text-stone-200">
            {
                isLoading ? (<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <LoadingComponent />
                </div>) : (
                    <main className="flex flex-col items-center py-6 md:py-8 px-4 md:px-6 cursor-default animate-fade-in">
                        <div className="text-center">
                            {/* <h2 className="text-3xl font-bold">{currentMember.name}</h2> */}
                            <BlurIn
                                word={currentMember.name}
                                className="text-2xl text-center font-bold tracking-tighter md:text-4xl"
                            />
                            <Badge className='rounded-md bg-neutral-900 hover:bg-neutral-900 text-stone-200 border-none' variant="secondary">Cubing Kerala {(currentMember.role).split('')[0].toUpperCase() + (currentMember.role).slice(1)} </Badge>
                        </div>
                        <div className="w-full max-w-[200px] h-[200px] my-4">
                            <Avatar className="w-full h-full rounded-md">
                                <AvatarImage className='object-cover' src={memberDataFromWCA?.person.avatar.url.includes("missing_avatar_thumb") ? "/user.png" : memberDataFromWCA?.person.avatar.url} alt="Profile Picture" />
                                <AvatarFallback className='rounded-md bg-neutral-900 text-stone-200'>{currentMember.name}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex w-full max-w-fit py-2 px-4  text-stone-200 justify-center space-x-8 my-4">
                            <div className="text-center">
                                <p className="text-xs text-neutral-500 font-medium">COUNTRY</p>
                                <p className='text-sm font-semibold'>{(currentMember.country).toUpperCase()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-neutral-500 font-medium">WCA ID</p>
                                <p className='text-sm font-semibold'>{currentMember.wcaid}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-neutral-500 font-medium">COMPETITIONS</p>
                                <p className='text-sm font-semibold'>{currentMemberResult.competition_count}</p>
                            </div>
                        </div>
                        <div className="flex justify-center space-x-8 mb-6">
                            <div className="text-center">
                                <p className="text-xs text-neutral-500 font-medium">MEDALS</p>
                                <div className='flex justify-center space-x-2'>
                                    <div className='flex justify-center items-center'>
                                        <p className='text-sm font-semibold'>{currentMemberResult.medals.gold}</p>
                                        <Image width={100} height={100} src="/gold.png" alt="gold" className='w-6 h-6' />
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <p className='text-sm font-semibold'>{currentMemberResult.medals.silver}</p>
                                        <Image width={100} height={100} src="/silver.png" alt="silver" className='w-6 h-6' />
                                    </div>
                                    <div className='flex items-center justify-center'><p className='text-sm font-semibold'>{currentMemberResult.medals.bronze}</p>
                                        <Image width={100} height={100} src="/bronze.png" alt="bronze" className='w-6 h-6' /></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-4xl mt-5">
                            <Table className='text-sm md:text-[15px]'>
                                <TableHeader>
                                    <TableRow className='hover:bg-transparent border-none'>
                                        <TableHead className='text-neutral-500'>Event</TableHead>
                                        <TableHead className='text-neutral-500'>NR</TableHead>
                                        <TableHead className='text-neutral-500'>CR</TableHead>
                                        <TableHead className='text-neutral-500'>WR</TableHead>
                                        <TableHead className='text-neutral-500'>Best</TableHead>
                                        <TableHead className='text-neutral-500'>Average</TableHead>
                                        <TableHead className='text-neutral-500'>WR</TableHead>
                                        <TableHead className='text-neutral-500'>CR</TableHead>
                                        <TableHead className='text-neutral-500'>NR</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        personalRecordsArray.map((event, index) => (
                                            <TableRow className='hover:bg-neutral-900 border-none' key={index}>
                                                <TableCell>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <span className={`cubing-icon event-${event.event}`}></span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className='bg-green-400 py-1 px-2 rounded-none text-black'>
                                                                <p>{event.event}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>

                                                {/* Single Rankings */}
                                                <TableCell>{event.ranking?.single?.country_rank ?? null}</TableCell>
                                                <TableCell>{event.ranking?.single?.continent_rank ?? null}</TableCell>
                                                <TableCell>{event.ranking?.single?.world_rank ?? null}</TableCell>

                                                {/* Single Best Time */}
                                                <TableCell className='font-semibold text-nowrap'>
                                                    {event.ranking?.single?.best
                                                        ? event.event === '333mbf'
                                                            ? convertMbldToMinutes(event.ranking.single.best)
                                                            : event.event === '333fm' ? (event.ranking.single.best)
                                                                : convertMillisecondsToTime(event.ranking.single.best)
                                                        : null}
                                                </TableCell>

                                                {/* Average Rankings */}
                                                <TableCell className='font-semibold text-nowrap'>
                                                    {event.ranking?.average?.best
                                                        ? event.event !== '333mbf'
                                                            ? convertMillisecondsToTime(event.ranking.average.best)
                                                            : null
                                                        : null}
                                                </TableCell>
                                                <TableCell>{event.ranking?.average?.world_rank ?? null}</TableCell>
                                                <TableCell>{event.ranking?.average?.continent_rank ?? null}</TableCell>
                                                <TableCell>{event.ranking?.average?.country_rank ?? null}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </main>
                )
            }
        </div>
    )
}

export default MemberInfoComponent